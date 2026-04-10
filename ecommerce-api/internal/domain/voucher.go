package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// VoucherType defines how the discount is calculated.
type VoucherType string

const (
	VoucherTypeFixed      VoucherType = "fixed"      // fixed IDR amount off
	VoucherTypePercentage VoucherType = "percentage"  // percentage off
	VoucherTypeFreeShip   VoucherType = "free_shipping"
)

// Voucher represents a discount coupon that customers can apply at checkout.
type Voucher struct {
	ID          uuid.UUID   `db:"id"           json:"id"`
	Code        string      `db:"code"         json:"code"`
	Type        VoucherType `db:"type"         json:"type"`
	Amount      int64       `db:"amount"       json:"amount"`       // IDR or percentage value
	MaxDiscount int64       `db:"max_discount" json:"max_discount"` // cap for percentage type
	MinPurchase int64       `db:"min_purchase" json:"min_purchase"` // minimum cart total
	Quota       int         `db:"quota"        json:"quota"`        // total allowed uses; 0 = unlimited
	UsedCount   int         `db:"used_count"   json:"used_count"`
	IsActive    bool        `db:"is_active"    json:"is_active"`
	StartAt     time.Time   `db:"start_at"     json:"start_at"`
	EndAt       time.Time   `db:"end_at"       json:"end_at"`
	CreatedAt   time.Time   `db:"created_at"   json:"created_at"`
	UpdatedAt   time.Time   `db:"updated_at"   json:"updated_at"`
}

// IsValid checks whether the voucher can be applied to a given subtotal at time t.
func (v *Voucher) IsValid(subtotal int64, t time.Time) error {
	if !v.IsActive {
		return ErrVoucherInvalid
	}
	if t.Before(v.StartAt) || t.After(v.EndAt) {
		return ErrVoucherInvalid
	}
	if v.Quota > 0 && v.UsedCount >= v.Quota {
		return ErrVoucherQuotaExceeded
	}
	if subtotal < v.MinPurchase {
		return ErrVoucherInvalid
	}
	return nil
}

// CalculateDiscount returns the discount amount for the given subtotal.
func (v *Voucher) CalculateDiscount(subtotal int64) int64 {
	switch v.Type {
	case VoucherTypeFixed:
		if v.Amount > subtotal {
			return subtotal
		}
		return v.Amount
	case VoucherTypePercentage:
		discount := subtotal * v.Amount / 100
		if v.MaxDiscount > 0 && discount > v.MaxDiscount {
			return v.MaxDiscount
		}
		return discount
	case VoucherTypeFreeShip:
		return 0 // shipping discount handled separately
	}
	return 0
}

// VoucherRepository defines the persistence contract for Voucher entities.
type VoucherRepository interface {
	Create(ctx context.Context, v *Voucher) error
	FindByCode(ctx context.Context, code string) (*Voucher, error)
	FindByID(ctx context.Context, id uuid.UUID) (*Voucher, error)
	IncrementUsage(ctx context.Context, id uuid.UUID) error
	Update(ctx context.Context, v *Voucher) error
}
