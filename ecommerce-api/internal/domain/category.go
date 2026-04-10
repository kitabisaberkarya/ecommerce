package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Category represents a product category, supporting unlimited nesting via parent_id.
type Category struct {
	ID          uuid.UUID  `db:"id"          json:"id"`
	ParentID    *uuid.UUID `db:"parent_id"   json:"parent_id,omitempty"`
	Name        string     `db:"name"        json:"name"`
	Slug        string     `db:"slug"        json:"slug"`
	Description string     `db:"description" json:"description"`
	ImageURL    string     `db:"image_url"   json:"image_url"`
	IsActive    bool       `db:"is_active"   json:"is_active"`
	SortOrder   int        `db:"sort_order"  json:"sort_order"`
	CreatedAt   time.Time  `db:"created_at"  json:"created_at"`
	UpdatedAt   time.Time  `db:"updated_at"  json:"updated_at"`

	// Populated by JOIN, not stored in table
	Children []*Category `db:"-" json:"children,omitempty"`
}

// CategoryRepository defines the persistence contract for Category entities.
type CategoryRepository interface {
	Create(ctx context.Context, cat *Category) error
	FindByID(ctx context.Context, id uuid.UUID) (*Category, error)
	FindBySlug(ctx context.Context, slug string) (*Category, error)
	FindAll(ctx context.Context, activeOnly bool) ([]*Category, error)
	FindByParentID(ctx context.Context, parentID *uuid.UUID) ([]*Category, error)
	Update(ctx context.Context, cat *Category) error
	Delete(ctx context.Context, id uuid.UUID) error
}
