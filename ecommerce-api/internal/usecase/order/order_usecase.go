package order

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"ecommerce-api/internal/domain"
	"ecommerce-api/pkg/idgen"
)

// CreateOrderInput holds the data needed to create an order.
type CreateOrderInput struct {
	UserID        uuid.UUID
	AddressID     uuid.UUID
	PaymentMethod string
	VoucherCode   string
	Notes         string
	ShippingCost  int64
}

// Usecase defines order business logic.
type Usecase interface {
	CreateFromCart(ctx context.Context, in CreateOrderInput) (*domain.Order, error)
	GetByID(ctx context.Context, id uuid.UUID, requesterID uuid.UUID, isAdmin bool) (*domain.Order, error)
	ListMyOrders(ctx context.Context, userID uuid.UUID, status domain.OrderStatus, page, limit int) ([]*domain.Order, int64, error)
	ListAllOrders(ctx context.Context, status domain.OrderStatus, page, limit int) ([]*domain.Order, int64, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status domain.OrderStatus, reason string, isAdmin bool) error
	Cancel(ctx context.Context, id uuid.UUID, userID uuid.UUID, reason string) error
}

type orderUsecase struct {
	orderRepo   domain.OrderRepository
	cartRepo    domain.CartRepository
	productRepo domain.ProductRepository
	addressRepo domain.AddressRepository
	voucherRepo domain.VoucherRepository
}

// New creates a new order Usecase.
func New(
	orderRepo domain.OrderRepository,
	cartRepo domain.CartRepository,
	productRepo domain.ProductRepository,
	addressRepo domain.AddressRepository,
	voucherRepo domain.VoucherRepository,
) Usecase {
	return &orderUsecase{
		orderRepo:   orderRepo,
		cartRepo:    cartRepo,
		productRepo: productRepo,
		addressRepo: addressRepo,
		voucherRepo: voucherRepo,
	}
}

func (u *orderUsecase) CreateFromCart(ctx context.Context, in CreateOrderInput) (*domain.Order, error) {
	// Load cart
	cart, err := u.cartRepo.FindOrCreateByUser(ctx, in.UserID)
	if err != nil {
		return nil, fmt.Errorf("order.Create: load cart: %w", err)
	}
	if len(cart.Items) == 0 {
		return nil, domain.ErrCartEmpty
	}

	// Load shipping address
	addr, err := u.addressRepo.FindByID(ctx, in.AddressID)
	if err != nil {
		return nil, fmt.Errorf("order.Create: load address: %w", err)
	}
	if addr.UserID != in.UserID {
		return nil, domain.ErrForbidden
	}

	// Calculate subtotal and build order items
	var subtotal int64
	var orderItems []*domain.OrderItem
	for _, item := range cart.Items {
		variant, err := u.productRepo.FindVariantByID(ctx, item.VariantID)
		if err != nil {
			return nil, fmt.Errorf("order.Create: load variant %s: %w", item.VariantID, err)
		}
		if variant.Stock < item.Quantity {
			return nil, fmt.Errorf("insufficient stock for %s: %w", variant.Name, domain.ErrInsufficientStock)
		}

		product, err := u.productRepo.FindByID(ctx, item.ProductID)
		if err != nil {
			return nil, err
		}

		lineTotal := variant.Price * int64(item.Quantity)
		subtotal += lineTotal

		imgURL := ""
		if len(variant.Images) > 0 {
			imgURL = variant.Images[0]
		} else if len(product.Images) > 0 {
			imgURL = product.Images[0]
		}

		orderItems = append(orderItems, &domain.OrderItem{
			ProductID:   item.ProductID,
			VariantID:   item.VariantID,
			ProductName: product.Name,
			VariantName: variant.Name,
			SKU:         variant.SKU,
			Price:       variant.Price,
			Quantity:    item.Quantity,
			Subtotal:    lineTotal,
			ImageURL:    imgURL,
		})
	}

	// Apply voucher
	var discountAmount int64
	var voucherCode string
	if in.VoucherCode != "" {
		voucher, err := u.voucherRepo.FindByCode(ctx, in.VoucherCode)
		if err == nil {
			if vErr := voucher.IsValid(subtotal, time.Now()); vErr == nil {
				discountAmount = voucher.CalculateDiscount(subtotal)
				voucherCode = in.VoucherCode
				_ = u.voucherRepo.IncrementUsage(ctx, voucher.ID)
			}
		}
	}

	total := subtotal + in.ShippingCost - discountAmount
	if total < 0 {
		total = 0
	}

	order := &domain.Order{
		ID:              uuid.New(),
		UserID:          in.UserID,
		OrderNumber:     generateOrderNumber(),
		Status:          domain.OrderStatusPending,
		Subtotal:        subtotal,
		ShippingCost:    in.ShippingCost,
		DiscountAmount:  discountAmount,
		Total:           total,
		Notes:           in.Notes,
		ShippingAddress: addr.ToSnapshot(),
		PaymentMethod:   in.PaymentMethod,
		VoucherCode:     voucherCode,
	}

	if err := u.orderRepo.Create(ctx, order); err != nil {
		return nil, fmt.Errorf("order.Create: save order: %w", err)
	}

	for _, item := range orderItems {
		item.OrderID = order.ID
	}
	if err := u.orderRepo.CreateItems(ctx, orderItems); err != nil {
		return nil, fmt.Errorf("order.Create: save items: %w", err)
	}

	// Decrement stock
	for _, item := range cart.Items {
		if err := u.productRepo.DecrementStock(ctx, item.VariantID, item.Quantity); err != nil {
			// Log but don't fail the order
			fmt.Printf("WARN: failed to decrement stock for variant %s: %v\n", item.VariantID, err)
		}
	}

	// Clear cart
	_ = u.cartRepo.ClearCart(ctx, cart.ID)

	return u.orderRepo.FindByID(ctx, order.ID)
}

func (u *orderUsecase) GetByID(ctx context.Context, id uuid.UUID, requesterID uuid.UUID, isAdmin bool) (*domain.Order, error) {
	o, err := u.orderRepo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if !isAdmin && o.UserID != requesterID {
		return nil, domain.ErrForbidden
	}
	return o, nil
}

func (u *orderUsecase) ListMyOrders(ctx context.Context, userID uuid.UUID, status domain.OrderStatus, page, limit int) ([]*domain.Order, int64, error) {
	return u.orderRepo.List(ctx, domain.OrderFilter{
		UserID: &userID,
		Status: status,
		Page:   page,
		Limit:  limit,
	})
}

func (u *orderUsecase) ListAllOrders(ctx context.Context, status domain.OrderStatus, page, limit int) ([]*domain.Order, int64, error) {
	return u.orderRepo.List(ctx, domain.OrderFilter{
		Status: status,
		Page:   page,
		Limit:  limit,
	})
}

func (u *orderUsecase) UpdateStatus(ctx context.Context, id uuid.UUID, status domain.OrderStatus, reason string, isAdmin bool) error {
	if !isAdmin {
		return domain.ErrForbidden
	}
	return u.orderRepo.UpdateStatus(ctx, id, status, reason)
}

func (u *orderUsecase) Cancel(ctx context.Context, id uuid.UUID, userID uuid.UUID, reason string) error {
	o, err := u.orderRepo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if o.UserID != userID {
		return domain.ErrForbidden
	}
	if !o.CanCancel() {
		return domain.ErrOrderNotCancellable
	}

	if err := u.orderRepo.UpdateStatus(ctx, id, domain.OrderStatusCancelled, reason); err != nil {
		return err
	}

	// Restore stock
	for _, item := range o.Items {
		_ = u.productRepo.IncrementStock(ctx, item.VariantID, item.Quantity)
	}
	return nil
}

func generateOrderNumber() string {
	ts := time.Now().Format("20060102")
	short := idgen.NewString()[:8]
	return fmt.Sprintf("ORD-%s-%s", ts, short)
}
