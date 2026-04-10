package middleware

import (
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"ecommerce-api/internal/delivery/http/response"
	"ecommerce-api/internal/domain"
	"ecommerce-api/pkg/token"
)

const (
	// ContextUserID is the key used to store the authenticated user's ID in Gin context.
	ContextUserID = "user_id"
	// ContextUserRole is the key used to store the authenticated user's role.
	ContextUserRole = "user_role"
	// ContextUserEmail is the key for the user's email.
	ContextUserEmail = "user_email"
)

// Auth is a JWT authentication middleware factory.
func Auth(maker *token.Maker) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "Authorization header is required")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "bearer") {
			response.Unauthorized(c, "Invalid authorization header format")
			c.Abort()
			return
		}

		claims, err := maker.Verify(parts[1])
		if err != nil {
			response.Unauthorized(c, err.Error())
			c.Abort()
			return
		}

		c.Set(ContextUserID, claims.UserID)
		c.Set(ContextUserRole, claims.Role)
		c.Set(ContextUserEmail, claims.Email)
		c.Next()
	}
}

// OptionalAuth tries to authenticate but does not abort if no token is present.
func OptionalAuth(maker *token.Maker) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader != "" {
			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) == 2 && strings.EqualFold(parts[0], "bearer") {
				if claims, err := maker.Verify(parts[1]); err == nil {
					c.Set(ContextUserID, claims.UserID)
					c.Set(ContextUserRole, claims.Role)
					c.Set(ContextUserEmail, claims.Email)
				}
			}
		}
		c.Next()
	}
}

// RequireRole aborts with 403 if the authenticated user does not hold the given role.
func RequireRole(roles ...domain.UserRole) gin.HandlerFunc {
	return func(c *gin.Context) {
		roleVal, exists := c.Get(ContextUserRole)
		if !exists {
			response.Forbidden(c, "Access denied")
			c.Abort()
			return
		}
		userRole := domain.UserRole(roleVal.(string))
		for _, r := range roles {
			if userRole == r {
				c.Next()
				return
			}
		}
		response.Forbidden(c, "Access denied")
		c.Abort()
	}
}

// GetUserID extracts the authenticated user's UUID from the Gin context.
// Panics if the middleware was not applied — use only in authenticated routes.
func GetUserID(c *gin.Context) uuid.UUID {
	v, _ := c.Get(ContextUserID)
	if id, ok := v.(uuid.UUID); ok {
		return id
	}
	return uuid.Nil
}

// GetUserRole extracts the authenticated user's role.
func GetUserRole(c *gin.Context) domain.UserRole {
	v, _ := c.Get(ContextUserRole)
	if r, ok := v.(string); ok {
		return domain.UserRole(r)
	}
	return ""
}

// IsAdmin returns true when the requesting user has the admin role.
func IsAdmin(c *gin.Context) bool {
	return GetUserRole(c) == domain.RoleAdmin
}
