package postgres

import (
	"strings"

	"ecommerce-api/internal/domain"
)

// mapPgError translates PostgreSQL error codes into domain errors.
func mapPgError(err error) error {
	if err == nil {
		return nil
	}
	msg := err.Error()
	// pg: unique_violation = 23505
	if strings.Contains(msg, "23505") || strings.Contains(msg, "unique") {
		return domain.ErrAlreadyExists
	}
	return err
}
