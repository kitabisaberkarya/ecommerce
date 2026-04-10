package hash

import (
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

const defaultCost = bcrypt.DefaultCost

// Make hashes a plain-text password using bcrypt.
func Make(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), defaultCost)
	if err != nil {
		return "", fmt.Errorf("hash.Make: %w", err)
	}
	return string(bytes), nil
}

// Check compares a plain-text password against a bcrypt hash.
// Returns true if they match.
func Check(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}
