package router

import (
	"github.com/gin-contrib/requestid"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"

	"ecommerce-api/internal/delivery/http/handler"
	"ecommerce-api/internal/delivery/http/middleware"
	"ecommerce-api/internal/domain"
	"ecommerce-api/pkg/token"
	"ecommerce-api/pkg/validator"
	authUC "ecommerce-api/internal/usecase/auth"
	cartUC "ecommerce-api/internal/usecase/cart"
	orderUC "ecommerce-api/internal/usecase/order"
	productUC "ecommerce-api/internal/usecase/product"
)

// Dependencies bundles all objects needed to build the router.
type Dependencies struct {
	DB          *sqlx.DB
	Redis       *redis.Client
	Log         *zap.Logger
	TokenMaker  *token.Maker
	Validator   *validator.Validate

	// Usecases
	AuthUC    authUC.Usecase
	ProductUC productUC.Usecase
	CartUC    cartUC.Usecase
	OrderUC   orderUC.Usecase

	// Repositories (used directly in simple CRUD handlers)
	CategoryRepo domain.CategoryRepository
	AddressRepo  domain.AddressRepository
}

// New constructs a fully configured Gin engine.
func New(isProd bool, allowedOrigins []string, deps Dependencies) *gin.Engine {
	if isProd {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	// ── Global Middleware ─────────────────────────────────────────────────────
	r.Use(requestid.New())
	r.Use(middleware.Recovery(deps.Log))
	r.Use(middleware.Logger(deps.Log))
	r.Use(middleware.Cors(allowedOrigins))

	// ── System routes ─────────────────────────────────────────────────────────
	healthH := handler.NewHealthHandler(deps.DB, deps.Redis)
	r.GET("/health", healthH.Check)
	r.GET("/ping", func(c *gin.Context) { c.JSON(200, gin.H{"message": "pong"}) })

	// ── Handlers ──────────────────────────────────────────────────────────────
	v := deps.Validator
	authH     := handler.NewAuthHandler(deps.AuthUC, v)
	productH  := handler.NewProductHandler(deps.ProductUC, v)
	categoryH := handler.NewCategoryHandler(deps.CategoryRepo, v)
	cartH     := handler.NewCartHandler(deps.CartUC, v)
	orderH    := handler.NewOrderHandler(deps.OrderUC, v)

	authMiddleware := middleware.Auth(deps.TokenMaker)
	optionalAuth  := middleware.OptionalAuth(deps.TokenMaker)
	adminOnly     := middleware.RequireRole(domain.RoleAdmin)
	sellerOrAdmin := middleware.RequireRole(domain.RoleSeller, domain.RoleAdmin)

	// ── API v1 ────────────────────────────────────────────────────────────────
	api := r.Group("/api/v1")

	// Auth
	auth := api.Group("/auth")
	{
		auth.POST("/register", authH.Register)
		auth.POST("/login", authH.Login)
		auth.POST("/refresh", authH.RefreshToken)
		auth.POST("/logout", authH.Logout)
		auth.POST("/logout-all", authMiddleware, authH.LogoutAll)
	}

	// Categories (public read, admin write)
	categories := api.Group("/categories")
	{
		categories.GET("", categoryH.ListCategories)
		categories.GET("/:id", categoryH.GetCategory)
	}

	// Products (public read, seller/admin write)
	products := api.Group("/products")
	products.Use(optionalAuth)
	{
		products.GET("", productH.ListProducts)
		products.GET("/:id", productH.GetProduct)
		products.POST("", authMiddleware, sellerOrAdmin, productH.CreateProduct)
		products.PUT("/:id", authMiddleware, sellerOrAdmin, productH.UpdateProduct)
		products.DELETE("/:id", authMiddleware, sellerOrAdmin, productH.DeleteProduct)
		products.POST("/:id/variants", authMiddleware, sellerOrAdmin, productH.AddVariant)
	}

	// Cart (works for guests and authenticated users)
	cart := api.Group("/cart")
	cart.Use(optionalAuth)
	{
		cart.GET("", cartH.GetCart)
		cart.POST("/items", cartH.AddItem)
		cart.PUT("/items/:item_id", cartH.UpdateItem)
		cart.DELETE("/items/:item_id", cartH.RemoveItem)
		cart.DELETE("", cartH.ClearCart)
	}

	// Orders (authenticated)
	orders := api.Group("/orders")
	orders.Use(authMiddleware)
	{
		orders.POST("", orderH.CreateOrder)
		orders.GET("", orderH.ListMyOrders)
		orders.GET("/:id", orderH.GetOrder)
		orders.POST("/:id/cancel", orderH.CancelOrder)
	}

	// Admin
	admin := api.Group("/admin")
	admin.Use(authMiddleware, adminOnly)
	{
		// Category admin
		admin.POST("/categories", categoryH.CreateCategory)
		admin.PUT("/categories/:id", categoryH.UpdateCategory)
		admin.DELETE("/categories/:id", categoryH.DeleteCategory)

		// Order admin
		admin.GET("/orders", orderH.AdminListOrders)
		admin.PATCH("/orders/:id/status", orderH.AdminUpdateOrderStatus)
	}

	return r
}
