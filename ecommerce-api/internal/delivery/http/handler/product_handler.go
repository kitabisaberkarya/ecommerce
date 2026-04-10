package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"ecommerce-api/internal/delivery/http/middleware"
	"ecommerce-api/internal/delivery/http/response"
	"ecommerce-api/internal/domain"
	productUC "ecommerce-api/internal/usecase/product"
	"ecommerce-api/pkg/pagination"
	"ecommerce-api/pkg/validator"
)

// ProductHandler handles product and variant endpoints.
type ProductHandler struct {
	productUC productUC.Usecase
	validator *validator.Validate
}

// NewProductHandler creates a new ProductHandler.
func NewProductHandler(productUC productUC.Usecase, v *validator.Validate) *ProductHandler {
	return &ProductHandler{productUC: productUC, validator: v}
}

type createProductRequest struct {
	CategoryID  string                   `json:"category_id"  validate:"required,uuid"`
	Name        string                   `json:"name"         validate:"required,min=3,max=255"`
	Description string                   `json:"description"  validate:"required"`
	Images      []string                 `json:"images"`
	Status      domain.ProductStatus     `json:"status"       validate:"oneof=draft active inactive"`
	Weight      float64                  `json:"weight"       validate:"gte=0"`
	Condition   domain.ProductCondition  `json:"condition"    validate:"oneof=new used"`
	MinPurchase int                      `json:"min_purchase" validate:"gte=1"`
	MaxPurchase int                      `json:"max_purchase" validate:"gte=0"`
}

type createVariantRequest struct {
	SKU          string            `json:"sku"           validate:"required,min=3,max=100"`
	Name         string            `json:"name"          validate:"required,min=1,max=255"`
	Price        int64             `json:"price"         validate:"required,gte=0"`
	ComparePrice int64             `json:"compare_price" validate:"gte=0"`
	CostPrice    int64             `json:"cost_price"    validate:"gte=0"`
	Stock        int               `json:"stock"         validate:"gte=0"`
	Weight       float64           `json:"weight"        validate:"gte=0"`
	Images       []string          `json:"images"`
	Attributes   map[string]string `json:"attributes"`
}

// ListProducts godoc
// @Summary  List products with filters and pagination
// @Tags     products
// @Produce  json
// @Param    page        query int    false "Page number"
// @Param    limit       query int    false "Items per page"
// @Param    search      query string false "Search query"
// @Param    category_id query string false "Category UUID"
// @Param    sort_by     query string false "Sort: newest|price_asc|price_desc|popular"
// @Success  200 {object} response.Envelope
// @Router   /products [get]
func (h *ProductHandler) ListProducts(c *gin.Context) {
	p := pagination.FromContext(c)

	filter := domain.ProductFilter{
		Search: c.Query("search"),
		SortBy: c.Query("sort_by"),
		Status: domain.ProductStatusActive,
		Page:   p.Page,
		Limit:  p.Limit,
	}

	if catID := c.Query("category_id"); catID != "" {
		id, err := uuid.Parse(catID)
		if err == nil {
			filter.CategoryID = &id
		}
	}

	// Non-admin public requests only see active products
	if middleware.IsAdmin(c) {
		statusParam := c.Query("status")
		if statusParam != "" {
			filter.Status = domain.ProductStatus(statusParam)
		} else {
			filter.Status = ""
		}
	}

	products, total, err := h.productUC.List(c.Request.Context(), filter)
	if err != nil {
		response.Error(c, err)
		return
	}
	meta := pagination.NewMeta(p, total)
	response.Paginated(c, products, meta)
}

// GetProduct godoc
// @Summary  Get a product by ID or slug
// @Tags     products
// @Produce  json
// @Param    id path string true "Product UUID or slug"
// @Success  200 {object} response.Envelope
// @Router   /products/{id} [get]
func (h *ProductHandler) GetProduct(c *gin.Context) {
	idOrSlug := c.Param("id")

	var (
		p   *domain.Product
		err error
	)
	if id, parseErr := uuid.Parse(idOrSlug); parseErr == nil {
		p, err = h.productUC.GetByID(c.Request.Context(), id)
	} else {
		p, err = h.productUC.GetBySlug(c.Request.Context(), idOrSlug)
	}

	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Product retrieved", p)
}

// CreateProduct godoc
// @Summary  Create a new product (seller/admin)
// @Tags     products
// @Security BearerAuth
// @Accept   json
// @Produce  json
// @Param    body body createProductRequest true "Product data"
// @Success  201 {object} response.Envelope
// @Router   /products [post]
func (h *ProductHandler) CreateProduct(c *gin.Context) {
	var req createProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if err := h.validator.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	catID, _ := uuid.Parse(req.CategoryID)
	sellerID := middleware.GetUserID(c)

	p, err := h.productUC.Create(c.Request.Context(), productUC.CreateProductInput{
		SellerID:    sellerID,
		CategoryID:  catID,
		Name:        req.Name,
		Description: req.Description,
		Images:      req.Images,
		Status:      req.Status,
		Weight:      req.Weight,
		Condition:   req.Condition,
		MinPurchase: req.MinPurchase,
		MaxPurchase: req.MaxPurchase,
	})
	if err != nil {
		response.Error(c, err)
		return
	}
	response.Created(c, "Product created", p)
}

// UpdateProduct godoc
// @Summary  Update a product
// @Tags     products
// @Security BearerAuth
// @Accept   json
// @Produce  json
// @Param    id   path string               true "Product UUID"
// @Param    body body createProductRequest true "Product data"
// @Success  200 {object} response.Envelope
// @Router   /products/{id} [put]
func (h *ProductHandler) UpdateProduct(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid product ID")
		return
	}

	var req createProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if err := h.validator.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	catID, _ := uuid.Parse(req.CategoryID)

	p, err := h.productUC.Update(c.Request.Context(), id, productUC.CreateProductInput{
		CategoryID:  catID,
		Name:        req.Name,
		Description: req.Description,
		Images:      req.Images,
		Status:      req.Status,
		Weight:      req.Weight,
		Condition:   req.Condition,
		MinPurchase: req.MinPurchase,
		MaxPurchase: req.MaxPurchase,
	})
	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Product updated", p)
}

// DeleteProduct godoc
// @Summary  Soft-delete a product
// @Tags     products
// @Security BearerAuth
// @Param    id path string true "Product UUID"
// @Success  204
// @Router   /products/{id} [delete]
func (h *ProductHandler) DeleteProduct(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid product ID")
		return
	}
	requesterID := middleware.GetUserID(c)
	isAdmin := middleware.IsAdmin(c)

	if err := h.productUC.Delete(c.Request.Context(), id, requesterID, isAdmin); err != nil {
		response.Error(c, err)
		return
	}
	response.NoContent(c)
}

// AddVariant godoc
// @Summary  Add a variant to a product
// @Tags     products
// @Security BearerAuth
// @Accept   json
// @Produce  json
// @Param    id   path string              true "Product UUID"
// @Param    body body createVariantRequest true "Variant data"
// @Success  201 {object} response.Envelope
// @Router   /products/{id}/variants [post]
func (h *ProductHandler) AddVariant(c *gin.Context) {
	productID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid product ID")
		return
	}

	var req createVariantRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if err := h.validator.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	v, err := h.productUC.AddVariant(c.Request.Context(), productUC.CreateVariantInput{
		ProductID:    productID,
		SKU:          req.SKU,
		Name:         req.Name,
		Price:        req.Price,
		ComparePrice: req.ComparePrice,
		CostPrice:    req.CostPrice,
		Stock:        req.Stock,
		Weight:       req.Weight,
		Images:       req.Images,
		Attributes:   req.Attributes,
	})
	if err != nil {
		response.Error(c, err)
		return
	}
	response.Created(c, "Variant added", v)
}
