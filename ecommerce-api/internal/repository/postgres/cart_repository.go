package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"ecommerce-api/internal/domain"
)

type cartRepository struct {
	db *sqlx.DB
}

// NewCartRepository creates a new PostgreSQL-backed CartRepository.
func NewCartRepository(db *sqlx.DB) domain.CartRepository {
	return &cartRepository{db: db}
}

func (r *cartRepository) FindOrCreateByUser(ctx context.Context, userID uuid.UUID) (*domain.Cart, error) {
	var cart domain.Cart
	err := r.db.GetContext(ctx, &cart,
		`SELECT * FROM carts WHERE user_id = $1`, userID)
	if errors.Is(err, sql.ErrNoRows) {
		cart = domain.Cart{ID: uuid.New(), UserID: &userID}
		_, err = r.db.ExecContext(ctx,
			`INSERT INTO carts (id, user_id) VALUES ($1, $2)`, cart.ID, userID)
		if err != nil {
			return nil, fmt.Errorf("cartRepo.FindOrCreateByUser: %w", err)
		}
	} else if err != nil {
		return nil, fmt.Errorf("cartRepo.FindOrCreateByUser: %w", err)
	}
	return r.loadItems(ctx, &cart)
}

func (r *cartRepository) FindOrCreateBySession(ctx context.Context, sessionID string) (*domain.Cart, error) {
	var cart domain.Cart
	err := r.db.GetContext(ctx, &cart,
		`SELECT * FROM carts WHERE session_id = $1 AND user_id IS NULL`, sessionID)
	if errors.Is(err, sql.ErrNoRows) {
		cart = domain.Cart{ID: uuid.New(), SessionID: sessionID}
		_, err = r.db.ExecContext(ctx,
			`INSERT INTO carts (id, session_id) VALUES ($1, $2)`, cart.ID, sessionID)
		if err != nil {
			return nil, fmt.Errorf("cartRepo.FindOrCreateBySession: %w", err)
		}
	} else if err != nil {
		return nil, fmt.Errorf("cartRepo.FindOrCreateBySession: %w", err)
	}
	return r.loadItems(ctx, &cart)
}

func (r *cartRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Cart, error) {
	var cart domain.Cart
	if err := r.db.GetContext(ctx, &cart, `SELECT * FROM carts WHERE id = $1`, id); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return r.loadItems(ctx, &cart)
}

func (r *cartRepository) AddItem(ctx context.Context, cartID, productID, variantID uuid.UUID, qty int) error {
	_, err := r.db.ExecContext(ctx, `
		INSERT INTO cart_items (id, cart_id, product_id, variant_id, quantity)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (cart_id, variant_id) DO UPDATE
		SET quantity = cart_items.quantity + EXCLUDED.quantity,
		    updated_at = NOW()
	`, uuid.New(), cartID, productID, variantID, qty)
	if err != nil {
		return fmt.Errorf("cartRepo.AddItem: %w", err)
	}
	return nil
}

func (r *cartRepository) UpdateItemQuantity(ctx context.Context, itemID uuid.UUID, qty int) error {
	res, err := r.db.ExecContext(ctx,
		`UPDATE cart_items SET quantity = $1 WHERE id = $2`, qty, itemID)
	if err != nil {
		return fmt.Errorf("cartRepo.UpdateItemQuantity: %w", err)
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *cartRepository) RemoveItem(ctx context.Context, itemID uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM cart_items WHERE id = $1`, itemID)
	return err
}

func (r *cartRepository) ClearCart(ctx context.Context, cartID uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM cart_items WHERE cart_id = $1`, cartID)
	return err
}

func (r *cartRepository) MergeCarts(ctx context.Context, sessionID string, userID uuid.UUID) error {
	// Find session cart
	var sessionCart domain.Cart
	err := r.db.GetContext(ctx, &sessionCart,
		`SELECT * FROM carts WHERE session_id = $1 AND user_id IS NULL`, sessionID)
	if errors.Is(err, sql.ErrNoRows) {
		return nil // nothing to merge
	}
	if err != nil {
		return err
	}

	// Get or create user cart
	userCart, err := r.FindOrCreateByUser(ctx, userID)
	if err != nil {
		return err
	}

	// Move items from session cart to user cart
	_, err = r.db.ExecContext(ctx, `
		INSERT INTO cart_items (id, cart_id, product_id, variant_id, quantity)
		SELECT uuid_generate_v4(), $1, product_id, variant_id, quantity
		FROM   cart_items
		WHERE  cart_id = $2
		ON CONFLICT (cart_id, variant_id) DO UPDATE
		SET quantity = cart_items.quantity + EXCLUDED.quantity,
		    updated_at = NOW()
	`, userCart.ID, sessionCart.ID)
	if err != nil {
		return err
	}

	// Delete session cart
	_, err = r.db.ExecContext(ctx, `DELETE FROM carts WHERE id = $1`, sessionCart.ID)
	return err
}

// loadItems fetches and attaches cart items with product/variant details.
func (r *cartRepository) loadItems(ctx context.Context, cart *domain.Cart) (*domain.Cart, error) {
	rows, err := r.db.QueryxContext(ctx, `
		SELECT ci.*, p.name AS product_name, p.images AS product_images,
		       pv.name AS variant_name, pv.price, pv.compare_price, pv.stock, pv.images AS variant_images, pv.attributes
		FROM cart_items ci
		JOIN products        p  ON p.id  = ci.product_id
		JOIN product_variants pv ON pv.id = ci.variant_id
		WHERE ci.cart_id = $1
		ORDER BY ci.created_at ASC
	`, cart.ID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var row struct {
			domain.CartItem
			ProductName    string `db:"product_name"`
			ProductImages  []byte `db:"product_images"`
			VariantName    string `db:"variant_name"`
			Price          int64  `db:"price"`
			ComparePrice   int64  `db:"compare_price"`
			Stock          int    `db:"stock"`
			VariantImages  []byte `db:"variant_images"`
			VariantAttrs   []byte `db:"attributes"`
		}
		if err := rows.StructScan(&row); err != nil {
			return nil, err
		}
		item := row.CartItem
		item.Product = &domain.Product{ID: item.ProductID, Name: row.ProductName}
		item.Variant = &domain.ProductVariant{
			ID:           item.VariantID,
			Name:         row.VariantName,
			Price:        row.Price,
			ComparePrice: row.ComparePrice,
			Stock:        row.Stock,
		}
		cart.Items = append(cart.Items, &item)
	}
	return cart, nil
}
