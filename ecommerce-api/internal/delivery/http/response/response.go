// Package response provides a standardised API response envelope.
package response

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"ecommerce-api/internal/domain"
	"ecommerce-api/pkg/pagination"
)

// Envelope is the standard JSON wrapper for all API responses.
type Envelope struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Meta    interface{} `json:"meta,omitempty"`
	Errors  interface{} `json:"errors,omitempty"`
}

// OK sends 200 with data payload.
func OK(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Envelope{Success: true, Message: message, Data: data})
}

// Created sends 201 with data payload.
func Created(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, Envelope{Success: true, Message: message, Data: data})
}

// Paginated sends 200 with data + pagination meta.
func Paginated(c *gin.Context, data interface{}, meta pagination.Meta) {
	c.JSON(http.StatusOK, Envelope{Success: true, Data: data, Meta: meta})
}

// NoContent sends 204.
func NoContent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

// Error maps a domain error to the appropriate HTTP status and sends JSON.
func Error(c *gin.Context, err error) {
	code, msg := mapError(err)
	c.JSON(code, Envelope{Success: false, Message: msg})
}

// ValidationError sends 422 with field-level error details.
func ValidationError(c *gin.Context, fieldErrors map[string]string) {
	c.JSON(http.StatusUnprocessableEntity, Envelope{
		Success: false,
		Message: "Validation failed",
		Errors:  fieldErrors,
	})
}

// BadRequest sends 400.
func BadRequest(c *gin.Context, msg string) {
	c.JSON(http.StatusBadRequest, Envelope{Success: false, Message: msg})
}

// Unauthorized sends 401.
func Unauthorized(c *gin.Context, msg string) {
	c.JSON(http.StatusUnauthorized, Envelope{Success: false, Message: msg})
}

// Forbidden sends 403.
func Forbidden(c *gin.Context, msg string) {
	c.JSON(http.StatusForbidden, Envelope{Success: false, Message: msg})
}

// NotFound sends 404.
func NotFound(c *gin.Context, msg string) {
	c.JSON(http.StatusNotFound, Envelope{Success: false, Message: msg})
}

// InternalError sends 500.
func InternalError(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, Envelope{
		Success: false,
		Message: "An unexpected error occurred. Please try again later.",
	})
}

func mapError(err error) (int, string) {
	switch {
	case errors.Is(err, domain.ErrNotFound):
		return http.StatusNotFound, "Resource not found"
	case errors.Is(err, domain.ErrAlreadyExists):
		return http.StatusConflict, "Resource already exists"
	case errors.Is(err, domain.ErrUnauthorized), errors.Is(err, domain.ErrTokenInvalid), errors.Is(err, domain.ErrTokenExpired):
		return http.StatusUnauthorized, err.Error()
	case errors.Is(err, domain.ErrForbidden):
		return http.StatusForbidden, "You are not allowed to perform this action"
	case errors.Is(err, domain.ErrInvalidCredentials):
		return http.StatusUnauthorized, "Invalid email or password"
	case errors.Is(err, domain.ErrInvalidInput):
		return http.StatusBadRequest, err.Error()
	case errors.Is(err, domain.ErrInsufficientStock):
		return http.StatusConflict, "Insufficient stock"
	case errors.Is(err, domain.ErrCartEmpty):
		return http.StatusBadRequest, "Cart is empty"
	case errors.Is(err, domain.ErrVoucherInvalid):
		return http.StatusBadRequest, "Voucher is invalid or expired"
	case errors.Is(err, domain.ErrVoucherQuotaExceeded):
		return http.StatusBadRequest, "Voucher quota has been exceeded"
	case errors.Is(err, domain.ErrOrderNotCancellable):
		return http.StatusBadRequest, "Order cannot be cancelled at this stage"
	default:
		return http.StatusInternalServerError, "An unexpected error occurred"
	}
}
