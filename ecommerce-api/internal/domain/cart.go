package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Cart holds a user's in-progress shopping session.
type Cart struct {
	ID        uuid.UUID  `db:"id"         json:"id"`
	UserID    *uuid.UUID `db:"user_id"    json:"user_id,omitempty"`
	SessionID string     `db:"session_id" json:"session_id"`
	CreatedAt time.Time  `db:"created_at" json:"created_at"`
	UpdatedAt time.Time  `db:"updated_at" json:"updated_at"`
	Items     []*CartItem `db:"-"          json:"items"`
}

// Subtotal sums the price × quantity for all items in the cart.
func (c *Cart) Subtotal() int64 {
	var total int64
	for _, item := range c.Items {
		if item.Variant != nil {
			total += item.Variant.Price * int64(item.Quantity)
		}
	}
	return total
}

// TotalItems returns the total number of distinct item lines.
func (c *Cart) TotalItems() int {
	return len(c.Items)
}

// CartItem represents a single product variant in a cart.
type CartItem struct {
	ID        uuid.UUID       `db:"id"         json:"id"`
	CartID    uuid.UUID       `db:"cart_id"    json:"cart_id"`
	ProductID uuid.UUID       `db:"product_id" json:"product_id"`
	VariantID uuid.UUID       `db:"variant_id" json:"variant_id"`
	Quantity  int             `db:"quantity"   json:"quantity"`
	CreatedAt time.Time       `db:"created_at" json:"created_at"`
	UpdatedAt time.Time       `db:"updated_at" json:"updated_at"`
	Product   *Product        `db:"-"          json:"product,omitempty"`
	Variant   *ProductVariant `db:"-"          json:"variant,omitempty"`
}

// CartRepository defines the persistence contract for Cart entities.
type CartRepository interface {
	FindOrCreateByUser(ctx context.Context, userID uuid.UUID) (*Cart, error)
	FindOrCreateBySession(ctx context.Context, sessionID string) (*Cart, error)
	FindByID(ctx context.Context, id uuid.UUID) (*Cart, error)
	AddItem(ctx context.Context, cartID, productID, variantID uuid.UUID, qty int) error
	UpdateItemQuantity(ctx context.Context, itemID uuid.UUID, qty int) error
	RemoveItem(ctx context.Context, itemID uuid.UUID) error
	ClearCart(ctx context.Context, cartID uuid.UUID) error
	MergeCarts(ctx context.Context, sessionID string, userID uuid.UUID) error
}
