package idgen

import "github.com/google/uuid"

// New returns a new random UUID v4.
func New() uuid.UUID {
	return uuid.New()
}

// NewString returns a new random UUID v4 as string.
func NewString() string {
	return uuid.New().String()
}

// Parse parses a UUID string.
func Parse(s string) (uuid.UUID, error) {
	return uuid.Parse(s)
}

// MustParse parses a UUID string and panics on error.
func MustParse(s string) uuid.UUID {
	return uuid.MustParse(s)
}

// IsValid reports whether the string is a valid UUID.
func IsValid(s string) bool {
	_, err := uuid.Parse(s)
	return err == nil
}
