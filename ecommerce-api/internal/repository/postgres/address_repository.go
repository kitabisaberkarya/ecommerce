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

type addressRepository struct {
	db *sqlx.DB
}

// NewAddressRepository creates a new PostgreSQL-backed AddressRepository.
func NewAddressRepository(db *sqlx.DB) domain.AddressRepository {
	return &addressRepository{db: db}
}

func (r *addressRepository) Create(ctx context.Context, addr *domain.Address) error {
	if addr.ID == uuid.Nil {
		addr.ID = uuid.New()
	}
	_, err := r.db.NamedExecContext(ctx, `
		INSERT INTO addresses (id, user_id, label, recipient_name, phone, province, city, district, postal_code, address_line, is_default)
		VALUES (:id, :user_id, :label, :recipient_name, :phone, :province, :city, :district, :postal_code, :address_line, :is_default)
	`, addr)
	return err
}

func (r *addressRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Address, error) {
	var addr domain.Address
	err := r.db.GetContext(ctx, &addr, `SELECT * FROM addresses WHERE id = $1`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("addressRepo.FindByID: %w", err)
	}
	return &addr, nil
}

func (r *addressRepository) FindByUserID(ctx context.Context, userID uuid.UUID) ([]*domain.Address, error) {
	var addrs []*domain.Address
	err := r.db.SelectContext(ctx, &addrs,
		`SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at ASC`, userID)
	return addrs, err
}

func (r *addressRepository) FindDefaultByUserID(ctx context.Context, userID uuid.UUID) (*domain.Address, error) {
	var addr domain.Address
	err := r.db.GetContext(ctx, &addr,
		`SELECT * FROM addresses WHERE user_id = $1 AND is_default = TRUE LIMIT 1`, userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &addr, nil
}

func (r *addressRepository) Update(ctx context.Context, addr *domain.Address) error {
	res, err := r.db.NamedExecContext(ctx, `
		UPDATE addresses
		SET label=:label, recipient_name=:recipient_name, phone=:phone,
		    province=:province, city=:city, district=:district,
		    postal_code=:postal_code, address_line=:address_line, is_default=:is_default
		WHERE id=:id AND user_id=:user_id
	`, addr)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *addressRepository) Delete(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM addresses WHERE id = $1`, id)
	return err
}

func (r *addressRepository) SetDefault(ctx context.Context, userID, addressID uuid.UUID) error {
	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			_ = tx.Rollback()
		}
	}()

	_, err = tx.ExecContext(ctx,
		`UPDATE addresses SET is_default = FALSE WHERE user_id = $1`, userID)
	if err != nil {
		return err
	}
	_, err = tx.ExecContext(ctx,
		`UPDATE addresses SET is_default = TRUE WHERE id = $1 AND user_id = $2`, addressID, userID)
	if err != nil {
		return err
	}
	return tx.Commit()
}
