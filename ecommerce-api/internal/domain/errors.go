package domain

import "errors"

// Sentinel domain errors used across all layers.
var (
	ErrNotFound          = errors.New("resource not found")
	ErrAlreadyExists     = errors.New("resource already exists")
	ErrUnauthorized      = errors.New("unauthorized")
	ErrForbidden         = errors.New("forbidden")
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrInvalidInput      = errors.New("invalid input")
	ErrConflict          = errors.New("conflict")
	ErrInsufficientStock = errors.New("insufficient stock")
	ErrCartEmpty         = errors.New("cart is empty")
	ErrVoucherInvalid    = errors.New("voucher is invalid or expired")
	ErrVoucherQuotaExceeded = errors.New("voucher quota has been exceeded")
	ErrOrderNotCancellable  = errors.New("order cannot be cancelled at this stage")
	ErrPaymentFailed        = errors.New("payment processing failed")
	ErrTokenExpired         = errors.New("token has expired")
	ErrTokenInvalid         = errors.New("token is invalid")
	ErrEmailNotVerified     = errors.New("email address is not verified")
)
