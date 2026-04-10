package database

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"
)

// PostgresConfig holds connection parameters.
type PostgresConfig struct {
	DSN             string
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
}

// NewPostgres establishes a PostgreSQL connection pool and returns a sqlx.DB.
// It pings the database to verify connectivity before returning.
func NewPostgres(cfg PostgresConfig, log *zap.Logger) (*sqlx.DB, error) {
	poolCfg, err := pgxpool.ParseConfig(cfg.DSN)
	if err != nil {
		return nil, fmt.Errorf("postgres: parse config: %w", err)
	}

	poolCfg.MaxConns = int32(cfg.MaxOpenConns)
	poolCfg.MinConns = int32(cfg.MaxIdleConns)
	poolCfg.MaxConnLifetime = cfg.ConnMaxLifetime

	pool, err := pgxpool.NewWithConfig(context.Background(), poolCfg)
	if err != nil {
		return nil, fmt.Errorf("postgres: create pool: %w", err)
	}

	// Wrap pgxpool with stdlib driver so sqlx can use it.
	sqlDB := stdlib.OpenDBFromPool(pool)
	sqlDB.SetMaxOpenConns(cfg.MaxOpenConns)
	sqlDB.SetMaxIdleConns(cfg.MaxIdleConns)
	sqlDB.SetConnMaxLifetime(cfg.ConnMaxLifetime)

	db := sqlx.NewDb(sqlDB, "pgx")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		return nil, fmt.Errorf("postgres: ping: %w", err)
	}

	log.Info("✅ PostgreSQL connected", zap.String("dsn", maskDSN(cfg.DSN)))
	return db, nil
}

// maskDSN hides the password in a DSN string for safe logging.
func maskDSN(dsn string) string {
	// Very simple masking – replace password= value
	out := []rune(dsn)
	inPw := false
	start := 0
	for i, r := range out {
		switch {
		case !inPw && string(out[i:min(i+9, len(out))]) == "password=":
			inPw = true
			start = i + 9
		case inPw && (r == ' ' || r == '\t'):
			for j := start; j < i; j++ {
				out[j] = '*'
			}
			inPw = false
		}
	}
	if inPw {
		for j := start; j < len(out); j++ {
			out[j] = '*'
		}
	}
	return string(out)
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
