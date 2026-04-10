package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"ecommerce-api/internal/domain"
)

type categoryRepository struct {
	db *sqlx.DB
}

// NewCategoryRepository creates a new PostgreSQL-backed CategoryRepository.
func NewCategoryRepository(db *sqlx.DB) domain.CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(ctx context.Context, cat *domain.Category) error {
	if cat.ID == uuid.Nil {
		cat.ID = uuid.New()
	}
	_, err := r.db.NamedExecContext(ctx, `
		INSERT INTO categories (id, parent_id, name, slug, description, image_url, is_active, sort_order)
		VALUES (:id, :parent_id, :name, :slug, :description, :image_url, :is_active, :sort_order)
	`, cat)
	if err != nil {
		return fmt.Errorf("categoryRepo.Create: %w", mapPgError(err))
	}
	return nil
}

func (r *categoryRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Category, error) {
	var cat domain.Category
	err := r.db.GetContext(ctx, &cat, `SELECT * FROM categories WHERE id = $1`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("categoryRepo.FindByID: %w", err)
	}
	return &cat, nil
}

func (r *categoryRepository) FindBySlug(ctx context.Context, slug string) (*domain.Category, error) {
	var cat domain.Category
	err := r.db.GetContext(ctx, &cat, `SELECT * FROM categories WHERE slug = $1`, slug)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("categoryRepo.FindBySlug: %w", err)
	}
	return &cat, nil
}

func (r *categoryRepository) FindAll(ctx context.Context, activeOnly bool) ([]*domain.Category, error) {
	query := `SELECT * FROM categories`
	args := []interface{}{}
	if activeOnly {
		query += ` WHERE is_active = TRUE`
	}
	query += ` ORDER BY sort_order ASC, name ASC`

	var cats []*domain.Category
	if err := r.db.SelectContext(ctx, &cats, query, args...); err != nil {
		return nil, fmt.Errorf("categoryRepo.FindAll: %w", err)
	}
	return cats, nil
}

func (r *categoryRepository) FindByParentID(ctx context.Context, parentID *uuid.UUID) ([]*domain.Category, error) {
	var cats []*domain.Category
	var err error
	if parentID == nil {
		err = r.db.SelectContext(ctx, &cats,
			`SELECT * FROM categories WHERE parent_id IS NULL ORDER BY sort_order ASC, name ASC`)
	} else {
		err = r.db.SelectContext(ctx, &cats,
			`SELECT * FROM categories WHERE parent_id = $1 ORDER BY sort_order ASC, name ASC`, *parentID)
	}
	if err != nil {
		return nil, fmt.Errorf("categoryRepo.FindByParentID: %w", err)
	}
	return cats, nil
}

func (r *categoryRepository) Update(ctx context.Context, cat *domain.Category) error {
	res, err := r.db.NamedExecContext(ctx, `
		UPDATE categories
		SET parent_id = :parent_id, name = :name, slug = :slug, description = :description,
		    image_url = :image_url, is_active = :is_active, sort_order = :sort_order
		WHERE id = :id
	`, cat)
	if err != nil {
		return fmt.Errorf("categoryRepo.Update: %w", mapPgError(err))
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *categoryRepository) Delete(ctx context.Context, id uuid.UUID) error {
	res, err := r.db.ExecContext(ctx, `DELETE FROM categories WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("categoryRepo.Delete: %w", err)
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}
