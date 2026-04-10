package auth

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"

	"ecommerce-api/internal/domain"
	"ecommerce-api/pkg/hash"
	"ecommerce-api/pkg/token"
)

// RegisterInput holds validated registration data.
type RegisterInput struct {
	FullName string
	Email    string
	Password string
	Phone    string
}

// LoginInput holds login credentials.
type LoginInput struct {
	Email    string
	Password string
}

// TokenPair is returned after successful auth.
type TokenPair struct {
	AccessToken           string    `json:"access_token"`
	RefreshToken          string    `json:"refresh_token"`
	AccessTokenExpiresAt  time.Time `json:"access_token_expires_at"`
	RefreshTokenExpiresAt time.Time `json:"refresh_token_expires_at"`
	User                  *domain.User `json:"user"`
}

// Usecase defines auth business logic.
type Usecase interface {
	Register(ctx context.Context, in RegisterInput) (*TokenPair, error)
	Login(ctx context.Context, in LoginInput) (*TokenPair, error)
	RefreshToken(ctx context.Context, refreshToken string) (*TokenPair, error)
	Logout(ctx context.Context, refreshToken string) error
	LogoutAll(ctx context.Context, userID uuid.UUID) error
}

type authUsecase struct {
	userRepo   domain.UserRepository
	tokenMaker *token.Maker
}

// New creates a new auth Usecase.
func New(userRepo domain.UserRepository, tokenMaker *token.Maker) Usecase {
	return &authUsecase{
		userRepo:   userRepo,
		tokenMaker: tokenMaker,
	}
}

func (u *authUsecase) Register(ctx context.Context, in RegisterInput) (*TokenPair, error) {
	existing, err := u.userRepo.FindByEmail(ctx, in.Email)
	if err != nil && !errors.Is(err, domain.ErrNotFound) {
		return nil, fmt.Errorf("auth.Register: %w", err)
	}
	if existing != nil {
		return nil, domain.ErrAlreadyExists
	}

	passwordHash, err := hash.Make(in.Password)
	if err != nil {
		return nil, fmt.Errorf("auth.Register: hash password: %w", err)
	}

	user := &domain.User{
		ID:           uuid.New(),
		Email:        in.Email,
		PasswordHash: passwordHash,
		FullName:     in.FullName,
		Phone:        in.Phone,
		Role:         domain.RoleCustomer,
		IsActive:     true,
	}

	if err := u.userRepo.Create(ctx, user); err != nil {
		return nil, fmt.Errorf("auth.Register: create user: %w", err)
	}

	return u.issueTokenPair(ctx, user)
}

func (u *authUsecase) Login(ctx context.Context, in LoginInput) (*TokenPair, error) {
	user, err := u.userRepo.FindByEmail(ctx, in.Email)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			return nil, domain.ErrInvalidCredentials
		}
		return nil, fmt.Errorf("auth.Login: %w", err)
	}

	if !user.IsActive {
		return nil, domain.ErrForbidden
	}

	if !hash.Check(in.Password, user.PasswordHash) {
		return nil, domain.ErrInvalidCredentials
	}

	return u.issueTokenPair(ctx, user)
}

func (u *authUsecase) RefreshToken(ctx context.Context, refreshTokenStr string) (*TokenPair, error) {
	claims, err := u.tokenMaker.Verify(refreshTokenStr)
	if err != nil {
		return nil, domain.ErrTokenInvalid
	}

	rt, err := u.userRepo.FindRefreshToken(ctx, refreshTokenStr)
	if err != nil {
		return nil, domain.ErrTokenInvalid
	}
	if rt.IsRevoked() {
		return nil, domain.ErrTokenInvalid
	}
	if time.Now().After(rt.ExpiresAt) {
		return nil, domain.ErrTokenExpired
	}

	user, err := u.userRepo.FindByID(ctx, claims.UserID)
	if err != nil {
		return nil, fmt.Errorf("auth.RefreshToken: find user: %w", err)
	}

	// Revoke old refresh token (token rotation)
	_ = u.userRepo.RevokeRefreshToken(ctx, refreshTokenStr)

	return u.issueTokenPair(ctx, user)
}

func (u *authUsecase) Logout(ctx context.Context, refreshToken string) error {
	return u.userRepo.RevokeRefreshToken(ctx, refreshToken)
}

func (u *authUsecase) LogoutAll(ctx context.Context, userID uuid.UUID) error {
	return u.userRepo.RevokeAllUserTokens(ctx, userID)
}

// issueTokenPair creates and persists a new access+refresh token pair.
func (u *authUsecase) issueTokenPair(ctx context.Context, user *domain.User) (*TokenPair, error) {
	accessToken, accessExp, err := u.tokenMaker.CreateAccessToken(user.ID, user.Email, string(user.Role))
	if err != nil {
		return nil, fmt.Errorf("auth: create access token: %w", err)
	}

	refreshToken, refreshExp, err := u.tokenMaker.CreateRefreshToken(user.ID, user.Email, string(user.Role))
	if err != nil {
		return nil, fmt.Errorf("auth: create refresh token: %w", err)
	}

	rt := &domain.RefreshToken{
		UserID:    user.ID,
		Token:     refreshToken,
		ExpiresAt: refreshExp,
	}
	if err := u.userRepo.SaveRefreshToken(ctx, rt); err != nil {
		return nil, fmt.Errorf("auth: save refresh token: %w", err)
	}

	return &TokenPair{
		AccessToken:           accessToken,
		RefreshToken:          refreshToken,
		AccessTokenExpiresAt:  accessExp,
		RefreshTokenExpiresAt: refreshExp,
		User:                  user,
	}, nil
}
