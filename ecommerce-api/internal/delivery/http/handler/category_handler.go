package handler

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"ecommerce-api/internal/delivery/http/response"
	"ecommerce-api/internal/domain"
	"ecommerce-api/pkg/slug"
	"ecommerce-api/pkg/validator"
)

// CategoryHandler handles category endpoints.
type CategoryHandler struct {
	categoryRepo domain.CategoryRepository
	validator    *validator.Validate
}

// NewCategoryHandler creates a new CategoryHandler.
func NewCategoryHandler(categoryRepo domain.CategoryRepository, v *validator.Validate) *CategoryHandler {
	return &CategoryHandler{categoryRepo: categoryRepo, validator: v}
}

type createCategoryRequest struct {
	ParentID    string `json:"parent_id"`
	Name        string `json:"name"        validate:"required,min=2,max=100"`
	Description string `json:"description"`
	ImageURL    string `json:"image_url"`
	IsActive    bool   `json:"is_active"`
	SortOrder   int    `json:"sort_order"  validate:"gte=0"`
}

// ListCategories godoc
// @Summary  List all categories (tree structure)
// @Tags     categories
// @Produce  json
// @Success  200 {object} response.Envelope
// @Router   /categories [get]
func (h *CategoryHandler) ListCategories(c *gin.Context) {
	activeOnly := c.Query("active") != "false"
	cats, err := h.categoryRepo.FindAll(c.Request.Context(), activeOnly)
	if err != nil {
		response.Error(c, err)
		return
	}
	// Build tree
	tree := buildCategoryTree(cats)
	response.OK(c, "Categories retrieved", tree)
}

// GetCategory godoc
// @Summary  Get category by ID or slug
// @Tags     categories
// @Produce  json
// @Param    id path string true "Category UUID or slug"
// @Success  200 {object} response.Envelope
// @Router   /categories/{id} [get]
func (h *CategoryHandler) GetCategory(c *gin.Context) {
	idOrSlug := c.Param("id")
	var (
		cat *domain.Category
		err error
	)
	if id, parseErr := uuid.Parse(idOrSlug); parseErr == nil {
		cat, err = h.categoryRepo.FindByID(c.Request.Context(), id)
	} else {
		cat, err = h.categoryRepo.FindBySlug(c.Request.Context(), idOrSlug)
	}
	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Category retrieved", cat)
}

// CreateCategory godoc
// @Summary  Admin: create a category
// @Tags     categories
// @Security BearerAuth
// @Accept   json
// @Produce  json
// @Param    body body createCategoryRequest true "Category data"
// @Success  201 {object} response.Envelope
// @Router   /admin/categories [post]
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req createCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if err := h.validator.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	cat := &domain.Category{
		Name:        req.Name,
		Slug:        slug.MakeUnique(req.Name),
		Description: req.Description,
		ImageURL:    req.ImageURL,
		IsActive:    req.IsActive,
		SortOrder:   req.SortOrder,
	}
	if req.ParentID != "" {
		if id, err := uuid.Parse(req.ParentID); err == nil {
			cat.ParentID = &id
		}
	}

	if err := h.categoryRepo.Create(c.Request.Context(), cat); err != nil {
		response.Error(c, err)
		return
	}
	response.Created(c, "Category created", cat)
}

// UpdateCategory godoc
// @Summary  Admin: update a category
// @Tags     categories
// @Security BearerAuth
// @Accept   json
// @Produce  json
// @Param    id   path string               true "Category UUID"
// @Param    body body createCategoryRequest true "Category data"
// @Success  200 {object} response.Envelope
// @Router   /admin/categories/{id} [put]
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid category ID")
		return
	}

	var req createCategoryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}

	cat, err := h.categoryRepo.FindByID(c.Request.Context(), id)
	if err != nil {
		response.Error(c, err)
		return
	}

	cat.Name = req.Name
	cat.Description = req.Description
	cat.ImageURL = req.ImageURL
	cat.IsActive = req.IsActive
	cat.SortOrder = req.SortOrder

	if req.ParentID != "" {
		if pid, err := uuid.Parse(req.ParentID); err == nil {
			cat.ParentID = &pid
		}
	}

	if err := h.categoryRepo.Update(c.Request.Context(), cat); err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Category updated", cat)
}

// DeleteCategory godoc
// @Summary  Admin: delete a category
// @Tags     categories
// @Security BearerAuth
// @Param    id path string true "Category UUID"
// @Success  204
// @Router   /admin/categories/{id} [delete]
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		response.BadRequest(c, "Invalid category ID")
		return
	}
	if err := h.categoryRepo.Delete(c.Request.Context(), id); err != nil {
		response.Error(c, err)
		return
	}
	response.NoContent(c)
}

// buildCategoryTree converts a flat list into a parent→children tree.
func buildCategoryTree(cats []*domain.Category) []*domain.Category {
	index := make(map[uuid.UUID]*domain.Category, len(cats))
	for _, c := range cats {
		index[c.ID] = c
	}
	var roots []*domain.Category
	for _, c := range cats {
		if c.ParentID == nil {
			roots = append(roots, c)
		} else if parent, ok := index[*c.ParentID]; ok {
			parent.Children = append(parent.Children, c)
		}
	}
	return roots
}
