package postgres

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"ecommerce-api/internal/domain"
)

type orderRepository struct {
	db *sqlx.DB
}

// NewOrderRepository creates a new PostgreSQL-backed OrderRepository.
func NewOrderRepository(db *sqlx.DB) domain.OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(ctx context.Context, o *domain.Order) error {
	if o.ID == uuid.Nil {
		o.ID = uuid.New()
	}
	addrJSON, _ := json.Marshal(o.ShippingAddress)
	_, err := r.db.ExecContext(ctx, `
		INSERT INTO orders
		    (id, user_id, order_number, status, subtotal, shipping_cost, discount_amount, tax_amount,
		     total, notes, shipping_address, payment_method, voucher_code)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
	`, o.ID, o.UserID, o.OrderNumber, o.Status, o.Subtotal, o.ShippingCost, o.DiscountAmount,
		o.TaxAmount, o.Total, o.Notes, addrJSON, o.PaymentMethod, o.VoucherCode,
	)
	if err != nil {
		return fmt.Errorf("orderRepo.Create: %w", mapPgError(err))
	}
	return nil
}

func (r *orderRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Order, error) {
	return r.findOne(ctx, `WHERE o.id = $1`, id)
}

func (r *orderRepository) FindByOrderNumber(ctx context.Context, number string) (*domain.Order, error) {
	return r.findOne(ctx, `WHERE o.order_number = $1`, number)
}

func (r *orderRepository) findOne(ctx context.Context, where string, args ...interface{}) (*domain.Order, error) {
	var raw struct {
		domain.Order
		ShippingAddrRaw []byte `db:"shipping_address"`
	}
	query := fmt.Sprintf(`SELECT o.* FROM orders o %s`, where)
	if err := r.db.GetContext(ctx, &raw, query, args...); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("orderRepo.findOne: %w", err)
	}
	o := raw.Order
	_ = json.Unmarshal(raw.ShippingAddrRaw, &o.ShippingAddress)

	items, err := r.loadItems(ctx, o.ID)
	if err == nil {
		o.Items = items
	}
	return &o, nil
}

func (r *orderRepository) List(ctx context.Context, f domain.OrderFilter) ([]*domain.Order, int64, error) {
	var conditions []string
	var args []interface{}
	idx := 1

	if f.UserID != nil {
		conditions = append(conditions, fmt.Sprintf("o.user_id = $%d", idx))
		args = append(args, *f.UserID)
		idx++
	}
	if f.Status != "" {
		conditions = append(conditions, fmt.Sprintf("o.status = $%d", idx))
		args = append(args, f.Status)
		idx++
	}

	where := ""
	if len(conditions) > 0 {
		where = "WHERE " + strings.Join(conditions, " AND ")
	}

	var total int64
	if err := r.db.GetContext(ctx, &total,
		fmt.Sprintf(`SELECT COUNT(*) FROM orders o %s`, where), args...); err != nil {
		return nil, 0, err
	}

	offset := (f.Page - 1) * f.Limit
	query := fmt.Sprintf(`
		SELECT o.* FROM orders o %s
		ORDER BY o.created_at DESC
		LIMIT %d OFFSET %d
	`, where, f.Limit, offset)

	rows, err := r.db.QueryxContext(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var orders []*domain.Order
	for rows.Next() {
		var raw struct {
			domain.Order
			ShippingAddrRaw []byte `db:"shipping_address"`
		}
		if err := rows.StructScan(&raw); err != nil {
			return nil, 0, err
		}
		o := raw.Order
		_ = json.Unmarshal(raw.ShippingAddrRaw, &o.ShippingAddress)
		orders = append(orders, &o)
	}
	return orders, total, nil
}

func (r *orderRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.OrderStatus, reason string) error {
	res, err := r.db.ExecContext(ctx,
		`UPDATE orders SET status = $1, cancel_reason = $2 WHERE id = $3`,
		status, reason, id)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *orderRepository) CreateItems(ctx context.Context, items []*domain.OrderItem) error {
	if len(items) == 0 {
		return nil
	}
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	for _, item := range items {
		if item.ID == uuid.Nil {
			item.ID = uuid.New()
		}
		_, err = tx.ExecContext(ctx, `
			INSERT INTO order_items
			    (id, order_id, product_id, variant_id, product_name, variant_name, sku, price, quantity, subtotal, image_url)
			VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
		`, item.ID, item.OrderID, item.ProductID, item.VariantID,
			item.ProductName, item.VariantName, item.SKU,
			item.Price, item.Quantity, item.Subtotal, item.ImageURL,
		)
		if err != nil {
			return err
		}
	}
	return tx.Commit()
}

func (r *orderRepository) loadItems(ctx context.Context, orderID uuid.UUID) ([]*domain.OrderItem, error) {
	var items []*domain.OrderItem
	err := r.db.SelectContext(ctx, &items,
		`SELECT * FROM order_items WHERE order_id = $1`, orderID)
	return items, err
}
