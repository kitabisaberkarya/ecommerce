package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"ecommerce-api/internal/delivery/http/middleware"
	"ecommerce-api/internal/delivery/http/response"
	"ecommerce-api/internal/domain"
	orderUC "ecommerce-api/internal/usecase/order"
	"ecommerce-api/pkg/pagination"
	"ecommerce-api/pkg/validator"
)

// OrderHandler handles order endpoints.
type OrderHandler struct {
	orderUC   orderUC.Usecase
	validator *validator.Validate
}

// NewOrderHandler creates a new OrderHandler.
func NewOrderHandler(orderUC orderUC.Usecase, v *validator.Validate) *OrderHandler {
	return &OrderHandler{orderUC: orderUC, validator: v}
}

type createOrderRequest struct {
	AddressID     string `json:"address_id"     validate:"required,uuid"`
	PaymentMethod string `json:"payment_method" validate:"required,min=2"`
	VoucherCode   string `json:"voucher_code"`
	Notes         string `json:"notes"          validate:"max=500"`
	ShippingCost  int64  `json:"shipping_cost"  validate:"gte=0"`
}

type updateOrderStatusRequest struct {
	Status string `json:"status" validate:"required,oneof=confirmed processing shipped delivered cancelled refunded"`
	Reason string `json:"reason"`
}

type cancelOrderRequest struct {
	Reason string `json:"reason" validate:"required,min=5,max=255"`
}

// CreateOrder godoc
// @Summary  Create an order from the user's cart
// @Tags     orders
// @Security BearerAuth
// @Accept   json
// @Produce  json
// @Param    body body createOrderRequest true "Order data"
// @Success  201 {object} response.Envelope
// @Router   /orders [post]
func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var req createOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if err := h.validator.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	addrID, _ := uuid.Parse(req.AddressID)
	userID := middleware.GetUserID(c)

	order, err := h.orderUC.CreateFromCart(c.Request.Context(), orderUC.CreateOrderInput{
		UserID:        userID,
		AddressID:     addrID,
		PaymentMethod: req.PaymentMethod,
		VoucherCode:   req.VoucherCode,
		Notes:         req.Notes,
		ShippingCost:  req.ShippingCost,
	})
	if err != nil {
		response.Error(c, err)
		return
	}
	response.Created(c, "Order created successfully", order)
}

// ListMyOrders godoc
// @Summary  List the authenticated user's orders
// @Tags     orders
// @Security BearerAuth
// @Produce  json
// @Param    status query string false "Filter by status"
// @Param    page   query int    false "Page"
// @Param    limit  query int    false "Limit"
// @Success  200 {object} response.Envelope
// @Router   /orders [get]
func (h *OrderHandler) ListMyOrders(c *gin.Context) {
	p := pagination.FromContext(c)
	userID := middleware.GetUserID(c)
	status := domain.OrderStatus(c.Query("status"))

	orders, total, err := h.orderUC.ListMyOrders(c.Request.Context(), userID, status, p.Page, p.Limit)
	if err != nil {
		response.Error(c, err)
		return
	}
	meta := pagination.NewMeta(p, total)
	response.Paginated(c, orders, meta)
}

// GetOrder godoc
// @Summary  Get a specific order by ID
// @Tags     orders
// @Security BearerAuth
// @Produce  json
// @Param    id path string true "Order UUID"
// @Success  200 {object} response.Envelope
// @Router   /orders/{id} [get]
func (h *OrderHandler) GetOrder(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid order ID")
		return
	}

	userID := middleware.GetUserID(c)
	isAdmin := middleware.IsAdmin(c)

	order, err := h.orderUC.GetByID(c.Request.Context(), id, userID, isAdmin)
	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Order retrieved", order)
}

// CancelOrder godoc
// @Summary  Cancel an order
// @Tags     orders
// @Security BearerAuth
// @Accept   json
// @Produce  json
// @Param    id   path string            true "Order UUID"
// @Param    body body cancelOrderRequest true "Cancellation reason"
// @Success  200 {object} response.Envelope
// @Router   /orders/{id}/cancel [post]
func (h *OrderHandler) CancelOrder(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid order ID")
		return
	}

	var req cancelOrderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "reason is required")
		return
	}

	userID := middleware.GetUserID(c)
	if err := h.orderUC.Cancel(c.Request.Context(), id, userID, req.Reason); err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Order cancelled", nil)
}

// AdminListOrders godoc
// @Summary  Admin: list all orders
// @Tags     admin
// @Security BearerAuth
// @Produce  json
// @Param    status query string false "Filter by status"
// @Param    page   query int    false "Page"
// @Param    limit  query int    false "Limit"
// @Success  200 {object} response.Envelope
// @Router   /admin/orders [get]
func (h *OrderHandler) AdminListOrders(c *gin.Context) {
	p := pagination.FromContext(c)
	status := domain.OrderStatus(c.Query("status"))

	orders, total, err := h.orderUC.ListAllOrders(c.Request.Context(), status, p.Page, p.Limit)
	if err != nil {
		response.Error(c, err)
		return
	}
	meta := pagination.NewMeta(p, total)
	response.Paginated(c, orders, meta)
}

// AdminUpdateOrderStatus godoc
// @Summary  Admin: update order status
// @Tags     admin
// @Security BearerAuth
// @Accept   json
// @Produce  json
// @Param    id   path string                  true "Order UUID"
// @Param    body body updateOrderStatusRequest true "New status"
// @Success  200 {object} response.Envelope
// @Router   /admin/orders/{id}/status [patch]
func (h *OrderHandler) AdminUpdateOrderStatus(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid order ID")
		return
	}

	var req updateOrderStatusRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if err := h.validator.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	if err := h.orderUC.UpdateStatus(c.Request.Context(), id,
		domain.OrderStatus(req.Status), req.Reason, true); err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Order status updated", nil)
}
