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

type voucherRepository struct {
	db *sqlx.DB
}

// NewVoucherRepository creates a new PostgreSQL-backed VoucherRepository.
func NewVoucherRepository(db *sqlx.DB) domain.VoucherRepository {
	return &voucherRepository{db: db}
}

func (r *voucherRepository) Create(ctx context.Context, v *domain.Voucher) error {
	if v.ID == uuid.Nil {
		v.ID = uuid.New()
	}
	_, err := r.db.NamedExecContext(ctx, `
		INSERT INTO vouchers (id, code, type, amount, max_discount, min_purchase, quota, is_active, start_at, end_at)
		VALUES (:id, :code, :type, :amount, :max_discount, :min_purchase, :quota, :is_active, :start_at, :end_at)
	`, v)
	if err != nil {
		return fmt.Errorf("voucherRepo.Create: %w", mapPgError(err))
	}
	return nil
}

func (r *voucherRepository) FindByCode(ctx context.Context, code string) (*domain.Voucher, error) {
	var v domain.Voucher
	err := r.db.GetContext(ctx, &v, `SELECT * FROM vouchers WHERE code = $1`, code)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("voucherRepo.FindByCode: %w", err)
	}
	return &v, nil
}

func (r *voucherRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Voucher, error) {
	var v domain.Voucher
	err := r.db.GetContext(ctx, &v, `SELECT * FROM vouchers WHERE id = $1`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("voucherRepo.FindByID: %w", err)
	}
	return &v, nil
}

func (r *voucherRepository) IncrementUsage(ctx context.Context, id uuid.UUID) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE vouchers SET used_count = used_count + 1 WHERE id = $1`, id)
	return err
}

func (r *voucherRepository) Update(ctx context.Context, v *domain.Voucher) error {
	res, err := r.db.NamedExecContext(ctx, `
		UPDATE vouchers
		SET code=:code, type=:type, amount=:amount, max_discount=:max_discount,
		    min_purchase=:min_purchase, quota=:quota, is_active=:is_active,
		    start_at=:start_at, end_at=:end_at
		WHERE id=:id
	`, v)
	if err != nil {
		return err
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}
