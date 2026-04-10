package handler

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
)

// HealthHandler handles health check and liveness/readiness probes.
type HealthHandler struct {
	db    *sqlx.DB
	redis *redis.Client
}

// NewHealthHandler creates a new HealthHandler with optional dependency checks.
func NewHealthHandler(db *sqlx.DB, rdb *redis.Client) *HealthHandler {
	return &HealthHandler{db: db, redis: rdb}
}

// Check godoc
// @Summary     Health check
// @Description Returns server and dependency status
// @Tags        system
// @Produce     json
// @Success     200 {object} map[string]interface{}
// @Router      /health [get]
func (h *HealthHandler) Check(c *gin.Context) {
	status := gin.H{
		"status":    "UP",
		"timestamp": time.Now().UTC(),
	}

	if h.db != nil {
		dbStatus := "UP"
		if err := h.db.PingContext(c.Request.Context()); err != nil {
			dbStatus = "DOWN: " + err.Error()
			c.JSON(http.StatusServiceUnavailable, status)
			return
		}
		status["database"] = dbStatus
	}

	if h.redis != nil {
		redisStatus := "UP"
		if err := h.redis.Ping(c.Request.Context()).Err(); err != nil {
			redisStatus = "DOWN: " + err.Error()
		}
		status["cache"] = redisStatus
	}

	c.JSON(http.StatusOK, status)
}
