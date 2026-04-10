package cart

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"

	"ecommerce-api/internal/domain"
)

// Usecase defines cart business logic.
type Usecase interface {
	GetCart(ctx context.Context, userID *uuid.UUID, sessionID string) (*domain.Cart, error)
	AddItem(ctx context.Context, userID *uuid.UUID, sessionID string, productID, variantID uuid.UUID, qty int) (*domain.Cart, error)
	UpdateItem(ctx context.Context, userID *uuid.UUID, sessionID string, itemID uuid.UUID, qty int) (*domain.Cart, error)
	RemoveItem(ctx context.Context, userID *uuid.UUID, sessionID string, itemID uuid.UUID) (*domain.Cart, error)
	ClearCart(ctx context.Context, userID *uuid.UUID, sessionID string) error
	MergeGuestCart(ctx context.Context, sessionID string, userID uuid.UUID) error
}

type cartUsecase struct {
	cartRepo    domain.CartRepository
	productRepo domain.ProductRepository
}

// New creates a new cart Usecase.
func New(cartRepo domain.CartRepository, productRepo domain.ProductRepository) Usecase {
	return &cartUsecase{cartRepo: cartRepo, productRepo: productRepo}
}

func (u *cartUsecase) GetCart(ctx context.Context, userID *uuid.UUID, sessionID string) (*domain.Cart, error) {
	return u.resolveCart(ctx, userID, sessionID)
}

func (u *cartUsecase) AddItem(ctx context.Context, userID *uuid.UUID, sessionID string, productID, variantID uuid.UUID, qty int) (*domain.Cart, error) {
	if qty < 1 {
		return nil, fmt.Errorf("quantity must be at least 1: %w", domain.ErrInvalidInput)
	}

	// Verify product & variant exist and have stock
	variant, err := u.productRepo.FindVariantByID(ctx, variantID)
	if err != nil {
		return nil, fmt.Errorf("cart.AddItem: variant not found: %w", err)
	}
	if !variant.IsActive {
		return nil, fmt.Errorf("variant is not available: %w", domain.ErrInvalidInput)
	}
	if variant.Stock < qty {
		return nil, domain.ErrInsufficientStock
	}

	cart, err := u.resolveCart(ctx, userID, sessionID)
	if err != nil {
		return nil, err
	}

	if err := u.cartRepo.AddItem(ctx, cart.ID, productID, variantID, qty); err != nil {
		return nil, fmt.Errorf("cart.AddItem: %w", err)
	}

	return u.resolveCart(ctx, userID, sessionID)
}

func (u *cartUsecase) UpdateItem(ctx context.Context, userID *uuid.UUID, sessionID string, itemID uuid.UUID, qty int) (*domain.Cart, error) {
	if qty < 1 {
		return u.RemoveItem(ctx, userID, sessionID, itemID)
	}
	if err := u.cartRepo.UpdateItemQuantity(ctx, itemID, qty); err != nil {
		return nil, fmt.Errorf("cart.UpdateItem: %w", err)
	}
	return u.resolveCart(ctx, userID, sessionID)
}

func (u *cartUsecase) RemoveItem(ctx context.Context, userID *uuid.UUID, sessionID string, itemID uuid.UUID) (*domain.Cart, error) {
	if err := u.cartRepo.RemoveItem(ctx, itemID); err != nil {
		return nil, fmt.Errorf("cart.RemoveItem: %w", err)
	}
	return u.resolveCart(ctx, userID, sessionID)
}

func (u *cartUsecase) ClearCart(ctx context.Context, userID *uuid.UUID, sessionID string) error {
	cart, err := u.resolveCart(ctx, userID, sessionID)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			return nil
		}
		return err
	}
	return u.cartRepo.ClearCart(ctx, cart.ID)
}

func (u *cartUsecase) MergeGuestCart(ctx context.Context, sessionID string, userID uuid.UUID) error {
	return u.cartRepo.MergeCarts(ctx, sessionID, userID)
}

func (u *cartUsecase) resolveCart(ctx context.Context, userID *uuid.UUID, sessionID string) (*domain.Cart, error) {
	if userID != nil {
		return u.cartRepo.FindOrCreateByUser(ctx, *userID)
	}
	return u.cartRepo.FindOrCreateBySession(ctx, sessionID)
}
