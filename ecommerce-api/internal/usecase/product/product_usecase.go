package product

import (
	"context"
	"errors"
	"fmt"

	"github.com/google/uuid"

	"ecommerce-api/internal/domain"
	"ecommerce-api/pkg/slug"
)

// CreateProductInput holds validated product creation data.
type CreateProductInput struct {
	SellerID    uuid.UUID
	CategoryID  uuid.UUID
	Name        string
	Description string
	Images      []string
	Status      domain.ProductStatus
	Weight      float64
	Condition   domain.ProductCondition
	MinPurchase int
	MaxPurchase int
}

// CreateVariantInput holds validated variant creation data.
type CreateVariantInput struct {
	ProductID    uuid.UUID
	SKU          string
	Name         string
	Price        int64
	ComparePrice int64
	CostPrice    int64
	Stock        int
	Weight       float64
	Images       []string
	Attributes   map[string]string
}

// Usecase defines product management business logic.
type Usecase interface {
	Create(ctx context.Context, in CreateProductInput) (*domain.Product, error)
	GetByID(ctx context.Context, id uuid.UUID) (*domain.Product, error)
	GetBySlug(ctx context.Context, slug string) (*domain.Product, error)
	List(ctx context.Context, filter domain.ProductFilter) ([]*domain.Product, int64, error)
	Update(ctx context.Context, id uuid.UUID, in CreateProductInput) (*domain.Product, error)
	Delete(ctx context.Context, id uuid.UUID, requesterID uuid.UUID, isAdmin bool) error

	AddVariant(ctx context.Context, in CreateVariantInput) (*domain.ProductVariant, error)
	UpdateVariant(ctx context.Context, variantID uuid.UUID, in CreateVariantInput) (*domain.ProductVariant, error)
}

type productUsecase struct {
	productRepo  domain.ProductRepository
	categoryRepo domain.CategoryRepository
}

// New creates a new product Usecase.
func New(productRepo domain.ProductRepository, categoryRepo domain.CategoryRepository) Usecase {
	return &productUsecase{
		productRepo:  productRepo,
		categoryRepo: categoryRepo,
	}
}

func (u *productUsecase) Create(ctx context.Context, in CreateProductInput) (*domain.Product, error) {
	if _, err := u.categoryRepo.FindByID(ctx, in.CategoryID); err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			return nil, fmt.Errorf("category not found: %w", domain.ErrInvalidInput)
		}
		return nil, err
	}

	productSlug := slug.MakeUnique(in.Name)
	p := &domain.Product{
		ID:          uuid.New(),
		SellerID:    in.SellerID,
		CategoryID:  in.CategoryID,
		Name:        in.Name,
		Slug:        productSlug,
		Description: in.Description,
		Images:      in.Images,
		Status:      in.Status,
		Weight:      in.Weight,
		Condition:   in.Condition,
		MinPurchase: in.MinPurchase,
		MaxPurchase: in.MaxPurchase,
	}
	if p.MinPurchase < 1 {
		p.MinPurchase = 1
	}
	if p.Status == "" {
		p.Status = domain.ProductStatusDraft
	}

	if err := u.productRepo.Create(ctx, p); err != nil {
		return nil, fmt.Errorf("product.Create: %w", err)
	}
	return p, nil
}

func (u *productUsecase) GetByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	return u.productRepo.FindByID(ctx, id)
}

func (u *productUsecase) GetBySlug(ctx context.Context, s string) (*domain.Product, error) {
	return u.productRepo.FindBySlug(ctx, s)
}

func (u *productUsecase) List(ctx context.Context, filter domain.ProductFilter) ([]*domain.Product, int64, error) {
	if filter.Page < 1 {
		filter.Page = 1
	}
	if filter.Limit < 1 || filter.Limit > 100 {
		filter.Limit = 20
	}
	return u.productRepo.List(ctx, filter)
}

func (u *productUsecase) Update(ctx context.Context, id uuid.UUID, in CreateProductInput) (*domain.Product, error) {
	p, err := u.productRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	p.CategoryID = in.CategoryID
	p.Name = in.Name
	p.Slug = slug.Make(in.Name)
	p.Description = in.Description
	p.Images = in.Images
	p.Status = in.Status
	p.Weight = in.Weight
	p.Condition = in.Condition
	p.MinPurchase = in.MinPurchase
	p.MaxPurchase = in.MaxPurchase

	if err := u.productRepo.Update(ctx, p); err != nil {
		return nil, fmt.Errorf("product.Update: %w", err)
	}
	return p, nil
}

func (u *productUsecase) Delete(ctx context.Context, id uuid.UUID, requesterID uuid.UUID, isAdmin bool) error {
	p, err := u.productRepo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if !isAdmin && p.SellerID != requesterID {
		return domain.ErrForbidden
	}
	return u.productRepo.SoftDelete(ctx, id)
}

func (u *productUsecase) AddVariant(ctx context.Context, in CreateVariantInput) (*domain.ProductVariant, error) {
	if _, err := u.productRepo.FindByID(ctx, in.ProductID); err != nil {
		return nil, err
	}
	v := &domain.ProductVariant{
		ID:           uuid.New(),
		ProductID:    in.ProductID,
		SKU:          in.SKU,
		Name:         in.Name,
		Price:        in.Price,
		ComparePrice: in.ComparePrice,
		CostPrice:    in.CostPrice,
		Stock:        in.Stock,
		Weight:       in.Weight,
		Images:       in.Images,
		Attributes:   in.Attributes,
		IsActive:     true,
	}
	if err := u.productRepo.CreateVariant(ctx, v); err != nil {
		return nil, fmt.Errorf("product.AddVariant: %w", err)
	}
	return v, nil
}

func (u *productUsecase) UpdateVariant(ctx context.Context, variantID uuid.UUID, in CreateVariantInput) (*domain.ProductVariant, error) {
	v, err := u.productRepo.FindVariantByID(ctx, variantID)
	if err != nil {
		return nil, err
	}
	v.SKU = in.SKU
	v.Name = in.Name
	v.Price = in.Price
	v.ComparePrice = in.ComparePrice
	v.CostPrice = in.CostPrice
	v.Stock = in.Stock
	v.Weight = in.Weight
	v.Images = in.Images
	v.Attributes = in.Attributes

	if err := u.productRepo.UpdateVariant(ctx, v); err != nil {
		return nil, fmt.Errorf("product.UpdateVariant: %w", err)
	}
	return v, nil
}
