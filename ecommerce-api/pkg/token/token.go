package token

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

var (
	ErrInvalidToken = errors.New("token is invalid")
	ErrExpiredToken  = errors.New("token has expired")
)

// Claims holds the JWT payload.
type Claims struct {
	UserID uuid.UUID `json:"user_id"`
	Email  string    `json:"email"`
	Role   string    `json:"role"`
	jwt.RegisteredClaims
}

// Maker handles JWT creation and verification.
type Maker struct {
	secret     []byte
	accessTTL  time.Duration
	refreshTTL time.Duration
}

// New creates a new token Maker.
func New(secret string, accessTTLMinutes, refreshTTLMinutes int) *Maker {
	return &Maker{
		secret:     []byte(secret),
		accessTTL:  time.Duration(accessTTLMinutes) * time.Minute,
		refreshTTL: time.Duration(refreshTTLMinutes) * time.Minute,
	}
}

// CreateAccessToken generates a short-lived access token.
func (m *Maker) CreateAccessToken(userID uuid.UUID, email, role string) (string, time.Time, error) {
	return m.create(userID, email, role, m.accessTTL)
}

// CreateRefreshToken generates a long-lived refresh token.
func (m *Maker) CreateRefreshToken(userID uuid.UUID, email, role string) (string, time.Time, error) {
	return m.create(userID, email, role, m.refreshTTL)
}

func (m *Maker) create(userID uuid.UUID, email, role string, ttl time.Duration) (string, time.Time, error) {
	expiresAt := time.Now().Add(ttl)
	claims := &Claims{
		UserID: userID,
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ID:        uuid.NewString(),
			Subject:   userID.String(),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			ExpiresAt: jwt.NewNumericDate(expiresAt),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(m.secret)
	if err != nil {
		return "", time.Time{}, fmt.Errorf("token.create: %w", err)
	}
	return signed, expiresAt, nil
}

// Verify parses and validates a JWT string, returning its claims.
func (m *Maker) Verify(tokenStr string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &Claims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return m.secret, nil
	})
	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}
	claims, ok := token.Claims.(*Claims)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}
	return claims, nil
}
