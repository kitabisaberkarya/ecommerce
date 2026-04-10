package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Address represents a user's saved shipping or billing address.
type Address struct {
	ID            uuid.UUID `db:"id"             json:"id"`
	UserID        uuid.UUID `db:"user_id"        json:"user_id"`
	Label         string    `db:"label"          json:"label"` // e.g. "Rumah", "Kantor"
	RecipientName string    `db:"recipient_name" json:"recipient_name"`
	Phone         string    `db:"phone"          json:"phone"`
	Province      string    `db:"province"       json:"province"`
	City          string    `db:"city"           json:"city"`
	District      string    `db:"district"       json:"district"`
	PostalCode    string    `db:"postal_code"    json:"postal_code"`
	AddressLine   string    `db:"address_line"   json:"address_line"`
	IsDefault     bool      `db:"is_default"     json:"is_default"`
	CreatedAt     time.Time `db:"created_at"     json:"created_at"`
	UpdatedAt     time.Time `db:"updated_at"     json:"updated_at"`
}

// AddressSnapshot is an immutable copy embedded in orders.
type AddressSnapshot struct {
	RecipientName string `json:"recipient_name"`
	Phone         string `json:"phone"`
	Province      string `json:"province"`
	City          string `json:"city"`
	District      string `json:"district"`
	PostalCode    string `json:"postal_code"`
	AddressLine   string `json:"address_line"`
}

// ToSnapshot converts an Address to an immutable AddressSnapshot.
func (a *Address) ToSnapshot() AddressSnapshot {
	return AddressSnapshot{
		RecipientName: a.RecipientName,
		Phone:         a.Phone,
		Province:      a.Province,
		City:          a.City,
		District:      a.District,
		PostalCode:    a.PostalCode,
		AddressLine:   a.AddressLine,
	}
}

// AddressRepository defines the persistence contract for Address entities.
type AddressRepository interface {
	Create(ctx context.Context, addr *Address) error
	FindByID(ctx context.Context, id uuid.UUID) (*Address, error)
	FindByUserID(ctx context.Context, userID uuid.UUID) ([]*Address, error)
	FindDefaultByUserID(ctx context.Context, userID uuid.UUID) (*Address, error)
	Update(ctx context.Context, addr *Address) error
	Delete(ctx context.Context, id uuid.UUID) error
	SetDefault(ctx context.Context, userID, addressID uuid.UUID) error
}
