package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.uber.org/zap"

	"ecommerce-api/internal/config"
	infra "ecommerce-api/internal/infrastructure/database"
	"ecommerce-api/internal/logger"
	"ecommerce-api/internal/delivery/http/router"
	"ecommerce-api/internal/repository/postgres"
	authUC    "ecommerce-api/internal/usecase/auth"
	cartUC    "ecommerce-api/internal/usecase/cart"
	orderUC   "ecommerce-api/internal/usecase/order"
	productUC "ecommerce-api/internal/usecase/product"
	"ecommerce-api/pkg/token"
	"ecommerce-api/pkg/validator"
)

// @title       E-Commerce Platform API
// @version     1.0
// @description Enterprise-grade e-commerce REST API built with Go.
//
// @contact.name  API Support
// @contact.email support@ecommerce.local
//
// @license.name Apache 2.0
// @license.url  http://www.apache.org/licenses/LICENSE-2.0.html
//
// @host     localhost:8080
// @BasePath /api/v1
//
// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and the access token.
func main() {
	// ── Config ────────────────────────────────────────────────────────────────
	cfg := config.NewConfig()

	// ── Logger ────────────────────────────────────────────────────────────────
	log := logger.NewLogger(cfg.AppEnv)
	defer log.Sync() //nolint:errcheck

	log.Info("🚀 Starting E-Commerce API",
		zap.String("env", cfg.AppEnv),
		zap.String("port", cfg.Port),
	)

	// ── Database ──────────────────────────────────────────────────────────────
	db, err := infra.NewPostgres(infra.PostgresConfig{
		DSN:             cfg.DSN(),
		MaxOpenConns:    cfg.DBMaxOpenConns,
		MaxIdleConns:    cfg.DBMaxIdleConns,
		ConnMaxLifetime: cfg.DBConnMaxLifetime,
	}, log)
	if err != nil {
		log.Fatal("Failed to connect to PostgreSQL", zap.Error(err))
	}
	defer db.Close()

	// ── Redis ─────────────────────────────────────────────────────────────────
	rdb, err := infra.NewRedis(infra.RedisConfig{
		Addr:     cfg.RedisAddr(),
		Password: cfg.RedisPassword,
		DB:       cfg.RedisDB,
	}, log)
	if err != nil {
		log.Warn("Failed to connect to Redis — caching disabled", zap.Error(err))
		rdb = nil
	}
	if rdb != nil {
		defer rdb.Close()
	}

	// ── Shared utilities ──────────────────────────────────────────────────────
	tokenMaker := token.New(cfg.JWTSecret, cfg.JWTAccessExpiresIn, cfg.JWTRefreshExpiresIn)
	v := validator.New()

	// ── Repositories ──────────────────────────────────────────────────────────
	userRepo     := postgres.NewUserRepository(db)
	categoryRepo := postgres.NewCategoryRepository(db)
	productRepo  := postgres.NewProductRepository(db)
	cartRepo     := postgres.NewCartRepository(db)
	orderRepo    := postgres.NewOrderRepository(db)
	addressRepo  := postgres.NewAddressRepository(db)
	voucherRepo  := postgres.NewVoucherRepository(db)

	// ── Usecases ──────────────────────────────────────────────────────────────
	authUsecase    := authUC.New(userRepo, tokenMaker)
	productUsecase := productUC.New(productRepo, categoryRepo)
	cartUsecase    := cartUC.New(cartRepo, productRepo)
	orderUsecase   := orderUC.New(orderRepo, cartRepo, productRepo, addressRepo, voucherRepo)

	// ── Router ────────────────────────────────────────────────────────────────
	r := router.New(cfg.IsProd(), cfg.CORSOrigins(), router.Dependencies{
		DB:           db,
		Redis:        rdb,
		Log:          log,
		TokenMaker:   tokenMaker,
		Validator:    v,
		AuthUC:       authUsecase,
		ProductUC:    productUsecase,
		CartUC:       cartUsecase,
		OrderUC:      orderUsecase,
		CategoryRepo: categoryRepo,
		AddressRepo:  addressRepo,
	})

	// ── HTTP Server ───────────────────────────────────────────────────────────
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Run server in background goroutine
	go func() {
		log.Info("✅ Server listening", zap.String("addr", srv.Addr))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("Server error", zap.Error(err))
		}
	}()

	// ── Graceful Shutdown ─────────────────────────────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	sig := <-quit
	log.Info("Shutdown signal received", zap.String("signal", sig.String()))

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Error("Graceful shutdown failed", zap.Error(err))
		os.Exit(1)
	}
	log.Info("👋 Server stopped gracefully")
}
