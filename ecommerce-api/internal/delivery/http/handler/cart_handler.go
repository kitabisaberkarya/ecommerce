package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"ecommerce-api/internal/delivery/http/middleware"
	"ecommerce-api/internal/delivery/http/response"
	cartUC "ecommerce-api/internal/usecase/cart"
	"ecommerce-api/pkg/validator"
)

// CartHandler handles shopping cart endpoints.
type CartHandler struct {
	cartUC    cartUC.Usecase
	validator *validator.Validate
}

// NewCartHandler creates a new CartHandler.
func NewCartHandler(cartUC cartUC.Usecase, v *validator.Validate) *CartHandler {
	return &CartHandler{cartUC: cartUC, validator: v}
}

type addToCartRequest struct {
	ProductID string `json:"product_id" validate:"required,uuid"`
	VariantID string `json:"variant_id" validate:"required,uuid"`
	Quantity  int    `json:"quantity"   validate:"required,gte=1"`
}

type updateCartItemRequest struct {
	Quantity int `json:"quantity" validate:"required,gte=0"`
}

// GetCart godoc
// @Summary  Get current cart contents
// @Tags     cart
// @Produce  json
// @Success  200 {object} response.Envelope
// @Router   /cart [get]
func (h *CartHandler) GetCart(c *gin.Context) {
	userID, sessionID := h.resolveUser(c)
	cart, err := h.cartUC.GetCart(c.Request.Context(), userID, sessionID)
	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Cart retrieved", cart)
}

// AddItem godoc
// @Summary  Add an item to the cart
// @Tags     cart
// @Accept   json
// @Produce  json
// @Param    body body addToCartRequest true "Item to add"
// @Success  200 {object} response.Envelope
// @Router   /cart/items [post]
func (h *CartHandler) AddItem(c *gin.Context) {
	var req addToCartRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if err := h.validator.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	productID, _ := uuid.Parse(req.ProductID)
	variantID, _ := uuid.Parse(req.VariantID)
	userID, sessionID := h.resolveUser(c)

	cart, err := h.cartUC.AddItem(c.Request.Context(), userID, sessionID, productID, variantID, req.Quantity)
	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Item added to cart", cart)
}

// UpdateItem godoc
// @Summary  Update item quantity (qty=0 removes the item)
// @Tags     cart
// @Accept   json
// @Produce  json
// @Param    item_id path string             true "Cart item UUID"
// @Param    body    body updateCartItemRequest true "New quantity"
// @Success  200 {object} response.Envelope
// @Router   /cart/items/{item_id} [put]
func (h *CartHandler) UpdateItem(c *gin.Context) {
	itemID, err := uuid.Parse(c.Param("item_id"))
	if err != nil {
		response.BadRequest(c, "Invalid item ID")
		return
	}

	var req updateCartItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}

	userID, sessionID := h.resolveUser(c)
	cart, err := h.cartUC.UpdateItem(c.Request.Context(), userID, sessionID, itemID, req.Quantity)
	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Cart updated", cart)
}

// RemoveItem godoc
// @Summary  Remove an item from the cart
// @Tags     cart
// @Param    item_id path string true "Cart item UUID"
// @Success  200 {object} response.Envelope
// @Router   /cart/items/{item_id} [delete]
func (h *CartHandler) RemoveItem(c *gin.Context) {
	itemID, err := uuid.Parse(c.Param("item_id"))
	if err != nil {
		response.BadRequest(c, "Invalid item ID")
		return
	}

	userID, sessionID := h.resolveUser(c)
	cart, err := h.cartUC.RemoveItem(c.Request.Context(), userID, sessionID, itemID)
	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Item removed", cart)
}

// ClearCart godoc
// @Summary  Clear the entire cart
// @Tags     cart
// @Success  204
// @Router   /cart [delete]
func (h *CartHandler) ClearCart(c *gin.Context) {
	userID, sessionID := h.resolveUser(c)
	if err := h.cartUC.ClearCart(c.Request.Context(), userID, sessionID); err != nil {
		response.Error(c, err)
		return
	}
	response.NoContent(c)
}

// resolveUser returns userID (nil if guest) and sessionID from the request context/header.
func (h *CartHandler) resolveUser(c *gin.Context) (*uuid.UUID, string) {
	id := middleware.GetUserID(c)
	if id != uuid.Nil {
		return &id, ""
	}
	sessionID := c.GetHeader("X-Session-ID")
	if sessionID == "" {
		sessionID = c.Query("session_id")
	}
	return nil, sessionID
}
