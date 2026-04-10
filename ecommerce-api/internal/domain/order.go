package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// OrderStatus is the lifecycle state of an order.
type OrderStatus string

const (
	OrderStatusPending    OrderStatus = "pending"
	OrderStatusConfirmed  OrderStatus = "confirmed"
	OrderStatusProcessing OrderStatus = "processing"
	OrderStatusShipped    OrderStatus = "shipped"
	OrderStatusDelivered  OrderStatus = "delivered"
	OrderStatusCancelled  OrderStatus = "cancelled"
	OrderStatusRefunded   OrderStatus = "refunded"
)

// Order is the core order entity.
type Order struct {
	ID              uuid.UUID       `db:"id"               json:"id"`
	UserID          uuid.UUID       `db:"user_id"          json:"user_id"`
	OrderNumber     string          `db:"order_number"     json:"order_number"`
	Status          OrderStatus     `db:"status"           json:"status"`
	Subtotal        int64           `db:"subtotal"         json:"subtotal"`
	ShippingCost    int64           `db:"shipping_cost"    json:"shipping_cost"`
	DiscountAmount  int64           `db:"discount_amount"  json:"discount_amount"`
	TaxAmount       int64           `db:"tax_amount"       json:"tax_amount"`
	Total           int64           `db:"total"            json:"total"`
	Notes           string          `db:"notes"            json:"notes"`
	ShippingAddress AddressSnapshot `db:"shipping_address" json:"shipping_address"`
	PaymentMethod   string          `db:"payment_method"   json:"payment_method"`
	VoucherCode     string          `db:"voucher_code"     json:"voucher_code,omitempty"`
	CancelReason    string          `db:"cancel_reason"    json:"cancel_reason,omitempty"`
	CreatedAt       time.Time       `db:"created_at"       json:"created_at"`
	UpdatedAt       time.Time       `db:"updated_at"       json:"updated_at"`

	// Populated by JOIN
	Items   []*OrderItem `db:"-" json:"items,omitempty"`
	Payment *Payment     `db:"-" json:"payment,omitempty"`
}

// CanCancel returns true when the order is still in a cancellable state.
func (o *Order) CanCancel() bool {
	return o.Status == OrderStatusPending || o.Status == OrderStatusConfirmed
}

// OrderItem is a snapshot of the product at the time of purchase.
type OrderItem struct {
	ID          uuid.UUID `db:"id"           json:"id"`
	OrderID     uuid.UUID `db:"order_id"     json:"order_id"`
	ProductID   uuid.UUID `db:"product_id"   json:"product_id"`
	VariantID   uuid.UUID `db:"variant_id"   json:"variant_id"`
	ProductName string    `db:"product_name" json:"product_name"`
	VariantName string    `db:"variant_name" json:"variant_name"`
	SKU         string    `db:"sku"          json:"sku"`
	Price       int64     `db:"price"        json:"price"`
	Quantity    int       `db:"quantity"     json:"quantity"`
	Subtotal    int64     `db:"subtotal"     json:"subtotal"`
	ImageURL    string    `db:"image_url"    json:"image_url"`
	CreatedAt   time.Time `db:"created_at"   json:"created_at"`
}

// OrderFilter holds parameters for listing orders.
type OrderFilter struct {
	UserID *uuid.UUID
	Status OrderStatus
	Page   int
	Limit  int
}

// OrderRepository defines the persistence contract for Order entities.
type OrderRepository interface {
	Create(ctx context.Context, order *Order) error
	FindByID(ctx context.Context, id uuid.UUID) (*Order, error)
	FindByOrderNumber(ctx context.Context, number string) (*Order, error)
	List(ctx context.Context, filter OrderFilter) ([]*Order, int64, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status OrderStatus, reason string) error
	CreateItems(ctx context.Context, items []*OrderItem) error
}
