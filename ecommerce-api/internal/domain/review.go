package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Review is a product review submitted by a customer after purchase.
type Review struct {
	ID         uuid.UUID `db:"id"          json:"id"`
	UserID     uuid.UUID `db:"user_id"      json:"user_id"`
	ProductID  uuid.UUID `db:"product_id"   json:"product_id"`
	OrderID    uuid.UUID `db:"order_id"     json:"order_id"`
	Rating     int       `db:"rating"       json:"rating"` // 1-5
	Title      string    `db:"title"        json:"title"`
	Body       string    `db:"body"         json:"body"`
	Images     []string  `db:"images"       json:"images"`
	IsApproved bool      `db:"is_approved"  json:"is_approved"`
	CreatedAt  time.Time `db:"created_at"   json:"created_at"`
	UpdatedAt  time.Time `db:"updated_at"   json:"updated_at"`

	// Populated by JOIN
	User *User `db:"-" json:"user,omitempty"`
}

// ReviewFilter holds parameters for listing reviews.
type ReviewFilter struct {
	ProductID  *uuid.UUID
	UserID     *uuid.UUID
	IsApproved *bool
	Page       int
	Limit      int
}

// ReviewRepository defines the persistence contract for Review entities.
type ReviewRepository interface {
	Create(ctx context.Context, review *Review) error
	FindByID(ctx context.Context, id uuid.UUID) (*Review, error)
	List(ctx context.Context, filter ReviewFilter) ([]*Review, int64, error)
	UpdateApproval(ctx context.Context, id uuid.UUID, approved bool) error
	GetProductRating(ctx context.Context, productID uuid.UUID) (avg float64, count int, err error)
	HasReviewed(ctx context.Context, userID, orderID, productID uuid.UUID) (bool, error)
}
