package postgres

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"

	"ecommerce-api/internal/domain"
)

type userRepository struct {
	db *sqlx.DB
}

// NewUserRepository creates a new PostgreSQL-backed UserRepository.
func NewUserRepository(db *sqlx.DB) domain.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) Create(ctx context.Context, u *domain.User) error {
	query := `
		INSERT INTO users (id, email, password_hash, full_name, phone, avatar_url, role, is_active, email_verified_at)
		VALUES (:id, :email, :password_hash, :full_name, :phone, :avatar_url, :role, :is_active, :email_verified_at)
	`
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	_, err := r.db.NamedExecContext(ctx, query, u)
	if err != nil {
		return fmt.Errorf("userRepo.Create: %w", mapPgError(err))
	}
	return nil
}

func (r *userRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	var u domain.User
	err := r.db.GetContext(ctx, &u,
		`SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL`, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("userRepo.FindByID: %w", err)
	}
	return &u, nil
}

func (r *userRepository) FindByEmail(ctx context.Context, email string) (*domain.User, error) {
	var u domain.User
	err := r.db.GetContext(ctx, &u,
		`SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("userRepo.FindByEmail: %w", err)
	}
	return &u, nil
}

func (r *userRepository) Update(ctx context.Context, u *domain.User) error {
	query := `
		UPDATE users
		SET full_name = :full_name, phone = :phone, avatar_url = :avatar_url,
		    is_active = :is_active, email_verified_at = :email_verified_at,
		    password_hash = :password_hash
		WHERE id = :id AND deleted_at IS NULL
	`
	res, err := r.db.NamedExecContext(ctx, query, u)
	if err != nil {
		return fmt.Errorf("userRepo.Update: %w", mapPgError(err))
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *userRepository) SoftDelete(ctx context.Context, id uuid.UUID) error {
	res, err := r.db.ExecContext(ctx,
		`UPDATE users SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL`, id)
	if err != nil {
		return fmt.Errorf("userRepo.SoftDelete: %w", err)
	}
	if n, _ := res.RowsAffected(); n == 0 {
		return domain.ErrNotFound
	}
	return nil
}

// --- Refresh Tokens ---

func (r *userRepository) SaveRefreshToken(ctx context.Context, rt *domain.RefreshToken) error {
	if rt.ID == uuid.Nil {
		rt.ID = uuid.New()
	}
	_, err := r.db.ExecContext(ctx,
		`INSERT INTO refresh_tokens (id, user_id, token, expires_at) VALUES ($1, $2, $3, $4)`,
		rt.ID, rt.UserID, rt.Token, rt.ExpiresAt,
	)
	if err != nil {
		return fmt.Errorf("userRepo.SaveRefreshToken: %w", mapPgError(err))
	}
	return nil
}

func (r *userRepository) FindRefreshToken(ctx context.Context, token string) (*domain.RefreshToken, error) {
	var rt domain.RefreshToken
	err := r.db.GetContext(ctx, &rt,
		`SELECT * FROM refresh_tokens WHERE token = $1`, token)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrNotFound
		}
		return nil, fmt.Errorf("userRepo.FindRefreshToken: %w", err)
	}
	return &rt, nil
}

func (r *userRepository) RevokeRefreshToken(ctx context.Context, token string) error {
	now := time.Now()
	_, err := r.db.ExecContext(ctx,
		`UPDATE refresh_tokens SET revoked_at = $1 WHERE token = $2 AND revoked_at IS NULL`,
		now, token,
	)
	return err
}

func (r *userRepository) RevokeAllUserTokens(ctx context.Context, userID uuid.UUID) error {
	_, err := r.db.ExecContext(ctx,
		`UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL`,
		userID,
	)
	return err
}
