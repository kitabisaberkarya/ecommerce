package validator

import (
	"regexp"
	"strings"

	gvalidator "github.com/go-playground/validator/v10"
)

// Validate is a re-export of the upstream Validate type so callers don't need
// to import go-playground/validator directly.
type Validate = gvalidator.Validate

var (
	rePhone      = regexp.MustCompile(`^(\+62|62|0)[0-9]{8,13}$`)
	reAlphaSpace = regexp.MustCompile(`^[a-zA-Z\s]+$`)
	rePostalCode = regexp.MustCompile(`^[0-9]{5}$`)
)

// New creates a new validator instance with custom rules registered.
func New() *Validate {
	v := gvalidator.New()

	_ = v.RegisterValidation("phone_id", validateIndonesianPhone)
	_ = v.RegisterValidation("alpha_space", validateAlphaSpace)
	_ = v.RegisterValidation("postal_code", validatePostalCode)
	_ = v.RegisterValidation("strong_password", validateStrongPassword)

	return v
}

// FormatErrors converts validator.ValidationErrors into a field→message map.
func FormatErrors(err error) map[string]string {
	errs := make(map[string]string)
	if ve, ok := err.(gvalidator.ValidationErrors); ok {
		for _, fe := range ve {
			field := strings.ToLower(fe.Field())
			errs[field] = fieldErrorMessage(fe)
		}
	}
	return errs
}

func fieldErrorMessage(fe gvalidator.FieldError) string {
	switch fe.Tag() {
	case "required":
		return "This field is required"
	case "email":
		return "Invalid email address"
	case "min":
		return "Value is too short (min " + fe.Param() + ")"
	case "max":
		return "Value is too long (max " + fe.Param() + ")"
	case "phone_id":
		return "Invalid Indonesian phone number"
	case "alpha_space":
		return "Only letters and spaces are allowed"
	case "postal_code":
		return "Must be a 5-digit postal code"
	case "strong_password":
		return "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
	case "oneof":
		return "Invalid value, must be one of: " + fe.Param()
	case "gte":
		return "Value must be greater than or equal to " + fe.Param()
	case "lte":
		return "Value must be less than or equal to " + fe.Param()
	default:
		return "Invalid value"
	}
}

func validateIndonesianPhone(fl gvalidator.FieldLevel) bool {
	return rePhone.MatchString(fl.Field().String())
}

func validateAlphaSpace(fl gvalidator.FieldLevel) bool {
	return reAlphaSpace.MatchString(fl.Field().String())
}

func validatePostalCode(fl gvalidator.FieldLevel) bool {
	return rePostalCode.MatchString(fl.Field().String())
}

func validateStrongPassword(fl gvalidator.FieldLevel) bool {
	pw := fl.Field().String()
	if len(pw) < 8 {
		return false
	}
	var hasUpper, hasLower, hasDigit, hasSpecial bool
	for _, c := range pw {
		switch {
		case c >= 'A' && c <= 'Z':
			hasUpper = true
		case c >= 'a' && c <= 'z':
			hasLower = true
		case c >= '0' && c <= '9':
			hasDigit = true
		default:
			hasSpecial = true
		}
	}
	return hasUpper && hasLower && hasDigit && hasSpecial
}
