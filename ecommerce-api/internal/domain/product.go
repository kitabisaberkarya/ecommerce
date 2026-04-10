package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// ProductStatus represents the visibility / lifecycle state of a product.
type ProductStatus string

const (
	ProductStatusDraft    ProductStatus = "draft"
	ProductStatusActive   ProductStatus = "active"
	ProductStatusInactive ProductStatus = "inactive"
)

// ProductCondition describes the physical condition of the item.
type ProductCondition string

const (
	ProductConditionNew  ProductCondition = "new"
	ProductConditionUsed ProductCondition = "used"
)

// Product is the main product entity.
type Product struct {
	ID          uuid.UUID        `db:"id"           json:"id"`
	SellerID    uuid.UUID        `db:"seller_id"    json:"seller_id"`
	CategoryID  uuid.UUID        `db:"category_id"  json:"category_id"`
	Name        string           `db:"name"         json:"name"`
	Slug        string           `db:"slug"         json:"slug"`
	Description string           `db:"description"  json:"description"`
	Images      []string         `db:"images"       json:"images"`
	Status      ProductStatus    `db:"status"       json:"status"`
	Weight      float64          `db:"weight"       json:"weight"` // grams
	Condition   ProductCondition `db:"condition"    json:"condition"`
	MinPurchase int              `db:"min_purchase" json:"min_purchase"`
	MaxPurchase int              `db:"max_purchase" json:"max_purchase"` // 0 = unlimited
	CreatedAt   time.Time        `db:"created_at"   json:"created_at"`
	UpdatedAt   time.Time        `db:"updated_at"   json:"updated_at"`
	DeletedAt   *time.Time       `db:"deleted_at"   json:"-"`

	// Populated by JOINs, not stored in table
	Category *Category        `db:"-" json:"category,omitempty"`
	Variants []*ProductVariant `db:"-" json:"variants,omitempty"`
	Rating   float64          `db:"-" json:"rating"`
	Reviews  int              `db:"-" json:"reviews"`
}

// ProductVariant represents a specific SKU of a product (e.g. size M, color red).
type ProductVariant struct {
	ID           uuid.UUID         `db:"id"            json:"id"`
	ProductID    uuid.UUID         `db:"product_id"    json:"product_id"`
	SKU          string            `db:"sku"           json:"sku"`
	Name         string            `db:"name"          json:"name"`
	Price        int64             `db:"price"         json:"price"`          // IDR
	ComparePrice int64             `db:"compare_price" json:"compare_price"`  // original / strikethrough price
	CostPrice    int64             `db:"cost_price"    json:"cost_price"`     // internal cost
	Stock        int               `db:"stock"         json:"stock"`
	Weight       float64           `db:"weight"        json:"weight"` // override product weight
	Images       []string          `db:"images"        json:"images"`
	Attributes   map[string]string `db:"attributes"    json:"attributes"` // e.g. {"warna":"merah","ukuran":"M"}
	IsActive     bool              `db:"is_active"     json:"is_active"`
	CreatedAt    time.Time         `db:"created_at"    json:"created_at"`
	UpdatedAt    time.Time         `db:"updated_at"    json:"updated_at"`
}

// DiscountPercent returns the discount percentage (0-100) compared to ComparePrice.
func (v *ProductVariant) DiscountPercent() float64 {
	if v.ComparePrice <= 0 || v.Price >= v.ComparePrice {
		return 0
	}
	return float64(v.ComparePrice-v.Price) / float64(v.ComparePrice) * 100
}

// ProductFilter holds search / filtering parameters for the product list.
type ProductFilter struct {
	Search     string
	CategoryID *uuid.UUID
	SellerID   *uuid.UUID
	Status     ProductStatus
	MinPrice   int64
	MaxPrice   int64
	SortBy     string // "price_asc" | "price_desc" | "newest" | "popular"
	Page       int
	Limit      int
}

// ProductRepository defines the persistence contract for Product entities.
type ProductRepository interface {
	Create(ctx context.Context, product *Product) error
	FindByID(ctx context.Context, id uuid.UUID) (*Product, error)
	FindBySlug(ctx context.Context, slug string) (*Product, error)
	List(ctx context.Context, filter ProductFilter) ([]*Product, int64, error)
	Update(ctx context.Context, product *Product) error
	SoftDelete(ctx context.Context, id uuid.UUID) error

	// Variants
	CreateVariant(ctx context.Context, variant *ProductVariant) error
	FindVariantByID(ctx context.Context, id uuid.UUID) (*ProductVariant, error)
	FindVariantsByProductID(ctx context.Context, productID uuid.UUID) ([]*ProductVariant, error)
	UpdateVariant(ctx context.Context, variant *ProductVariant) error
	DecrementStock(ctx context.Context, variantID uuid.UUID, qty int) error
	IncrementStock(ctx context.Context, variantID uuid.UUID, qty int) error
}
