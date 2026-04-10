package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// UserRole defines the access level of a user account.
type UserRole string

const (
	RoleAdmin    UserRole = "admin"
	RoleSeller   UserRole = "seller"
	RoleCustomer UserRole = "customer"
)

// User is the core user entity.
type User struct {
	ID              uuid.UUID  `db:"id"               json:"id"`
	Email           string     `db:"email"            json:"email"`
	PasswordHash    string     `db:"password_hash"    json:"-"`
	FullName        string     `db:"full_name"        json:"full_name"`
	Phone           string     `db:"phone"            json:"phone"`
	AvatarURL       string     `db:"avatar_url"       json:"avatar_url"`
	Role            UserRole   `db:"role"             json:"role"`
	IsActive        bool       `db:"is_active"        json:"is_active"`
	EmailVerifiedAt *time.Time `db:"email_verified_at" json:"email_verified_at,omitempty"`
	CreatedAt       time.Time  `db:"created_at"       json:"created_at"`
	UpdatedAt       time.Time  `db:"updated_at"       json:"updated_at"`
	DeletedAt       *time.Time `db:"deleted_at"       json:"-"`
}

// IsVerified returns true if the user's email has been verified.
func (u *User) IsVerified() bool {
	return u.EmailVerifiedAt != nil
}

// RefreshToken stores issued refresh tokens to support multi-device logout.
type RefreshToken struct {
	ID        uuid.UUID  `db:"id"`
	UserID    uuid.UUID  `db:"user_id"`
	Token     string     `db:"token"`
	ExpiresAt time.Time  `db:"expires_at"`
	CreatedAt time.Time  `db:"created_at"`
	RevokedAt *time.Time `db:"revoked_at"`
}

// IsRevoked returns true when the token has been explicitly revoked.
func (rt *RefreshToken) IsRevoked() bool { return rt.RevokedAt != nil }

// UserRepository defines the persistence contract for User entities.
type UserRepository interface {
	Create(ctx context.Context, user *User) error
	FindByID(ctx context.Context, id uuid.UUID) (*User, error)
	FindByEmail(ctx context.Context, email string) (*User, error)
	Update(ctx context.Context, user *User) error
	SoftDelete(ctx context.Context, id uuid.UUID) error

	// Refresh tokens
	SaveRefreshToken(ctx context.Context, rt *RefreshToken) error
	FindRefreshToken(ctx context.Context, token string) (*RefreshToken, error)
	RevokeRefreshToken(ctx context.Context, token string) error
	RevokeAllUserTokens(ctx context.Context, userID uuid.UUID) error
}

// UserUsecase defines the business logic contract for user operations.
type UserUsecase interface {
	GetByID(ctx context.Context, id uuid.UUID) (*User, error)
	UpdateProfile(ctx context.Context, id uuid.UUID, fullName, phone, avatarURL string) (*User, error)
	ChangePassword(ctx context.Context, id uuid.UUID, oldPassword, newPassword string) error
	List(ctx context.Context, search string, role UserRole, page, limit int) ([]*User, int64, error)
	SetActive(ctx context.Context, id uuid.UUID, active bool) error
}
