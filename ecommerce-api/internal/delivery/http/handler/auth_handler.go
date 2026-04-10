package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"ecommerce-api/internal/delivery/http/middleware"
	"ecommerce-api/internal/delivery/http/response"
	authUC "ecommerce-api/internal/usecase/auth"
	"ecommerce-api/pkg/validator"
)

// AuthHandler handles authentication endpoints.
type AuthHandler struct {
	authUC    authUC.Usecase
	validator *validator.Validate
}

// NewAuthHandler creates a new AuthHandler.
func NewAuthHandler(authUC authUC.Usecase, v *validator.Validate) *AuthHandler {
	return &AuthHandler{authUC: authUC, validator: v}
}

type registerRequest struct {
	FullName string `json:"full_name" validate:"required,min=2,max=100"`
	Email    string `json:"email"     validate:"required,email"`
	Password string `json:"password"  validate:"required,strong_password"`
	Phone    string `json:"phone"     validate:"omitempty,phone_id"`
}

type loginRequest struct {
	Email    string `json:"email"    validate:"required,email"`
	Password string `json:"password" validate:"required"`
}

type refreshRequest struct {
	RefreshToken string `json:"refresh_token" validate:"required"`
}

// Register godoc
// @Summary     Register a new customer account
// @Tags        auth
// @Accept      json
// @Produce     json
// @Param       body body registerRequest true "Registration data"
// @Success     201 {object} response.Envelope
// @Router      /auth/register [post]
func (h *AuthHandler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if err := h.validator.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	pair, err := h.authUC.Register(c.Request.Context(), authUC.RegisterInput{
		FullName: req.FullName,
		Email:    req.Email,
		Password: req.Password,
		Phone:    req.Phone,
	})
	if err != nil {
		response.Error(c, err)
		return
	}
	response.Created(c, "Registration successful", pair)
}

// Login godoc
// @Summary     Login with email and password
// @Tags        auth
// @Accept      json
// @Produce     json
// @Param       body body loginRequest true "Login credentials"
// @Success     200 {object} response.Envelope
// @Router      /auth/login [post]
func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}
	if err := h.validator.Struct(req); err != nil {
		response.ValidationError(c, validator.FormatErrors(err))
		return
	}

	pair, err := h.authUC.Login(c.Request.Context(), authUC.LoginInput{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Login successful", pair)
}

// RefreshToken godoc
// @Summary     Refresh access token
// @Tags        auth
// @Accept      json
// @Produce     json
// @Param       body body refreshRequest true "Refresh token"
// @Success     200 {object} response.Envelope
// @Router      /auth/refresh [post]
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	var req refreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "Invalid request body")
		return
	}

	pair, err := h.authUC.RefreshToken(c.Request.Context(), req.RefreshToken)
	if err != nil {
		response.Error(c, err)
		return
	}
	response.OK(c, "Token refreshed", pair)
}

// Logout godoc
// @Summary     Logout current session
// @Tags        auth
// @Security    BearerAuth
// @Accept      json
// @Produce     json
// @Param       body body refreshRequest true "Refresh token to revoke"
// @Success     204
// @Router      /auth/logout [post]
func (h *AuthHandler) Logout(c *gin.Context) {
	var req refreshRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "refresh_token is required")
		return
	}
	_ = h.authUC.Logout(c.Request.Context(), req.RefreshToken)
	c.Status(http.StatusNoContent)
}

// LogoutAll godoc
// @Summary     Logout from all devices
// @Tags        auth
// @Security    BearerAuth
// @Success     204
// @Router      /auth/logout-all [post]
func (h *AuthHandler) LogoutAll(c *gin.Context) {
	userID := middleware.GetUserID(c)
	_ = h.authUC.LogoutAll(c.Request.Context(), userID)
	c.Status(http.StatusNoContent)
}
