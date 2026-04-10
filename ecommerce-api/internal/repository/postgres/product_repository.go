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

type productRepository struct {
	db *sqlx.DB
}

// NewProductRepository creates a new PostgreSQL-backed ProductRepository.
func NewProductRepository(db *sqlx.DB) domain.ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) Create(ctx context.Context, p *domain.Product) error {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	images, _ := json.Marshal(p.Images)
	_, err := r.db.ExecContext(ctx, `
		INSERT INTO products (id, seller_id, category_id, name, slug, description, images, status, weight, condition, min_purchase, max_purchase)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
	`, p.ID, p.SellerID, p.CategoryID, p.Name, p.Slug, p.Description, images,
		p.Status, p.Weight, p.Condition, p.MinPurchase, p.MaxPurchase,
	)
	if err != nil {
		return fmt.Errorf("productRepo.Create: %w", mapPgError(err))
	}
	return nil
}

func (r *productRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	return r.findOne(ctx, `WHERE p.id = $1 AND p.deleted_at IS NULL`, id)
}

func (r *productRepository) FindBySlug(ctx context.Context, slug string) (*domain.Product, error) {
	return r.findOne(ctx, `WHERE p.slug = $1 AND p.deleted_at IS NULL`, slug)
}

func (r *productRepository) findOne(ctx context.Context, where string, args ...interface{}) (*domain.Product, error) {
	var row struct {
		domain.Product
		ImagesRaw     []byte  `db:"images"`
		AvgRating     float64 `db:"avg_rating"`
		ReviewCount   int     `db:"review_count"`
	}
	query := fmt.Sprintf(`
		SELECT p.*,
		       COALESCE(AVG(rv.rating), 0) AS avg_rating,
		       COUNT(rv.id)                AS review_count
		FROM   products p
		LEFT JOIN reviews rv ON rv.product_id = p.id AND rv.is_approved = TRUE
		%s
		GROUP BY p.id
	`, where)

	if err := r.db.GetContext(ctx, &row, query, args...); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("productRepo.findOne: %w", err)
	}

	p := row.Product
	_ = json.Unmarshal(row.ImagesRaw, &p.Images)
	p.Rating = row.AvgRating
	p.Reviews = row.ReviewCount

	variants, err := r.FindVariantsByProductID(ctx, p.ID)
	if err == nil {
		p.Variants = variants
	}
	return &p, nil
}

func (r *productRepository) List(ctx context.Context, f domain.ProductFilter) ([]*domain.Product, int64, error) {
	where, args := r.buildFilter(f)

	var total int64
	countQ := fmt.Sprintf(`SELECT COUNT(*) FROM products p %s`, where)
	if err := r.db.GetContext(ctx, &total, countQ, args...); err != nil {
		return nil, 0, fmt.Errorf("productRepo.List count: %w", err)
	}

	offset := (f.Page - 1) * f.Limit
	orderBy := "p.created_at DESC"
	switch f.SortBy {
	case "price_asc":
		orderBy = "(SELECT MIN(price) FROM product_variants WHERE product_id = p.id) ASC"
	case "price_desc":
		orderBy = "(SELECT MIN(price) FROM product_variants WHERE product_id = p.id) DESC"
	case "popular":
		orderBy = "review_count DESC, avg_rating DESC"
	}

	listQ := fmt.Sprintf(`
		SELECT p.*,
		       COALESCE(AVG(rv.rating), 0) AS avg_rating,
		       COUNT(rv.id)                AS review_count
		FROM   products p
		LEFT JOIN reviews rv ON rv.product_id = p.id AND rv.is_approved = TRUE
		%s
		GROUP BY p.id
		ORDER BY %s
		LIMIT %d OFFSET %d
	`, where, orderBy, f.Limit, offset)

	rows, err := r.db.QueryxContext(ctx, listQ, args...)
	if err != nil {
		return nil, 0, fmt.Errorf("productRepo.List: %w", err)
	}
	defer rows.Close()

	var products []*domain.Product
	for rows.Next() {
		var row struct {
			domain.Product
			ImagesRaw   []byte  `db:"images"`
			AvgRating   float64 `db:"avg_rating"`
			ReviewCount int     `db:"review_count"`
		}
		if err := rows.StructScan(&row); err != nil {
			return nil, 0, err
		}
		p := row.Product
		_ = json.Unmarshal(row.ImagesRaw, &p.Images)
		p.Rating = row.AvgRating
		p.Reviews = row.ReviewCount
		products = append(products, &p)
	}
	return products, total, nil
}

func (r *productRepository) buildFilter(f domain.ProductFilter) (string, []interface{}) {
	var conditions []string
	var args []interface{}
	idx := 1

	conditions = append(conditions, "p.deleted_at IS NULL")

	if f.Status != "" {
		conditions = append(conditions, fmt.Sprintf("p.status = $%d", idx))
		args = append(args, f.Status)
		idx++
	}
	if f.CategoryID != nil {
		conditions = append(conditions, fmt.Sprintf("p.category_id = $%d", idx))
		args = append(args, *f.CategoryID)
		idx++
	}
	if f.SellerID != nil {
		conditions = append(conditions, fmt.Sprintf("p.seller_id = $%d", idx))
		args = append(args, *f.SellerID)
		idx++
	}
	if f.Search != "" {
		conditions = append(conditions, fmt.Sprintf(
			"(p.search_vector @@ plainto_tsquery('indonesian', $%d) OR p.name ILIKE $%d)",
			idx, idx+1,
		))
		args = append(args, f.Search, "%"+f.Search+"%")
		idx += 2
	}
	if f.MinPrice > 0 {
		conditions = append(conditions, fmt.Sprintf(
			"EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.price >= $%d)", idx))
		args = append(args, f.MinPrice)
		idx++
	}
	if f.MaxPrice > 0 {
		conditions = append(conditions, fmt.Sprintf(
			"EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id AND pv.price <= $%d)", idx))
		args = append(args, f.MaxPrice)
		idx++
	}

	where := ""
	if len(conditions) > 0 {
		where = "WHERE " + strings.Join(conditions, " AND ")
	}
	return where, args
}

func (r *productRepository) Update(ctx context.Context, p *domain.Product) error {
	images, _ := json.Marshal(p.Images)
	res, err := r.db.ExecContext(ctx, `
		UPDATE products
		SET category_id=$1, name=$2, slug=$3, description=$4, images=$5,
		    status=$6, weight=$7, condition=$8, min_purchase=$9, max_purchase=$10
		WHERE id=$11 AND deleted_at IS NULL
	`, p.CategoryID, p.Name, p.Slug, p.Description, images,
		p.Status, p.Weight, p.Condition, p.MinPurchase, p.MaxPurchase, p.ID,
	)
	if err != nil {
		return fmt.Errorf("productRepo.Update: %w", mapPgError(err))
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *productRepository) SoftDelete(ctx context.Context, id uuid.UUID) error {
	res, err := r.db.ExecContext(ctx,
		`UPDATE products SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`, id)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

// --- Variants ---

func (r *productRepository) CreateVariant(ctx context.Context, v *domain.ProductVariant) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	images, _ := json.Marshal(v.Images)
	attrs, _ := json.Marshal(v.Attributes)
	_, err := r.db.ExecContext(ctx, `
		INSERT INTO product_variants
		    (id, product_id, sku, name, price, compare_price, cost_price, stock, weight, images, attributes, is_active)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
	`, v.ID, v.ProductID, v.SKU, v.Name, v.Price, v.ComparePrice, v.CostPrice,
		v.Stock, v.Weight, images, attrs, v.IsActive,
	)
	if err != nil {
		return fmt.Errorf("productRepo.CreateVariant: %w", mapPgError(err))
	}
	return nil
}

func (r *productRepository) FindVariantByID(ctx context.Context, id uuid.UUID) (*domain.ProductVariant, error) {
	row := r.db.QueryRowxContext(ctx,
		`SELECT * FROM product_variants WHERE id = $1`, id)
	return r.scanVariant(row)
}

func (r *productRepository) FindVariantsByProductID(ctx context.Context, productID uuid.UUID) ([]*domain.ProductVariant, error) {
	rows, err := r.db.QueryxContext(ctx,
		`SELECT * FROM product_variants WHERE product_id = $1 ORDER BY created_at ASC`, productID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var variants []*domain.ProductVariant
	for rows.Next() {
		v, err := r.scanVariant(rows)
		if err != nil {
			return nil, err
		}
		variants = append(variants, v)
	}
	return variants, nil
}

type rowScanner interface {
	StructScan(dest interface{}) error
}

func (r *productRepository) scanVariant(row rowScanner) (*domain.ProductVariant, error) {
	var raw struct {
		domain.ProductVariant
		ImagesRaw []byte `db:"images"`
		AttrsRaw  []byte `db:"attributes"`
	}
	if err := row.StructScan(&raw); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	v := raw.ProductVariant
	_ = json.Unmarshal(raw.ImagesRaw, &v.Images)
	_ = json.Unmarshal(raw.AttrsRaw, &v.Attributes)
	return &v, nil
}

func (r *productRepository) UpdateVariant(ctx context.Context, v *domain.ProductVariant) error {
	images, _ := json.Marshal(v.Images)
	attrs, _ := json.Marshal(v.Attributes)
	res, err := r.db.ExecContext(ctx, `
		UPDATE product_variants
		SET sku=$1, name=$2, price=$3, compare_price=$4, cost_price=$5,
		    stock=$6, weight=$7, images=$8, attributes=$9, is_active=$10
		WHERE id=$11
	`, v.SKU, v.Name, v.Price, v.ComparePrice, v.CostPrice,
		v.Stock, v.Weight, images, attrs, v.IsActive, v.ID,
	)
	if err != nil {
		return fmt.Errorf("productRepo.UpdateVariant: %w", mapPgError(err))
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *productRepository) DecrementStock(ctx context.Context, variantID uuid.UUID, qty int) error {
	res, err := r.db.ExecContext(ctx, `
		UPDATE product_variants
		SET stock = stock - $1
		WHERE id = $2 AND stock >= $1
	`, qty, variantID)
	if err != nil {
		return fmt.Errorf("productRepo.DecrementStock: %w", err)
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrInsufficientStock
	}
	return nil
}

func (r *productRepository) IncrementStock(ctx context.Context, variantID uuid.UUID, qty int) error {
	_, err := r.db.ExecContext(ctx, `
		UPDATE product_variants SET stock = stock + $1 WHERE id = $2
	`, qty, variantID)
	return err
}
