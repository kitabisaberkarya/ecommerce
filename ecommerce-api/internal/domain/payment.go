package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// PaymentStatus tracks the lifecycle of a payment.
type PaymentStatus string

const (
	PaymentStatusPending  PaymentStatus = "pending"
	PaymentStatusPaid     PaymentStatus = "paid"
	PaymentStatusFailed   PaymentStatus = "failed"
	PaymentStatusRefunded PaymentStatus = "refunded"
	PaymentStatusExpired  PaymentStatus = "expired"
)

// Payment represents a payment transaction linked to an order.
type Payment struct {
	ID                uuid.UUID     `db:"id"                  json:"id"`
	OrderID           uuid.UUID     `db:"order_id"            json:"order_id"`
	PaymentMethod     string        `db:"payment_method"      json:"payment_method"`
	Status            PaymentStatus `db:"status"              json:"status"`
	Amount            int64         `db:"amount"              json:"amount"`
	GatewayProvider   string        `db:"gateway_provider"    json:"gateway_provider"`
	GatewayOrderID    string        `db:"gateway_order_id"    json:"gateway_order_id,omitempty"`
	GatewayPaymentURL string        `db:"gateway_payment_url" json:"gateway_payment_url,omitempty"`
	GatewayResponse   string        `db:"gateway_response"    json:"gateway_response,omitempty"`
	PaidAt            *time.Time    `db:"paid_at"             json:"paid_at,omitempty"`
	ExpiredAt         *time.Time    `db:"expired_at"          json:"expired_at,omitempty"`
	CreatedAt         time.Time     `db:"created_at"          json:"created_at"`
	UpdatedAt         time.Time     `db:"updated_at"          json:"updated_at"`
}

// PaymentRepository defines the persistence contract for Payment entities.
type PaymentRepository interface {
	Create(ctx context.Context, payment *Payment) error
	FindByID(ctx context.Context, id uuid.UUID) (*Payment, error)
	FindByOrderID(ctx context.Context, orderID uuid.UUID) (*Payment, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status PaymentStatus, gatewayResponse string) error
	MarkPaid(ctx context.Context, id uuid.UUID, paidAt time.Time) error
}
