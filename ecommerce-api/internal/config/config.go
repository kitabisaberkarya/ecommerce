package config

import (
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/spf13/viper"
)

// Config holds all application configuration loaded from environment variables or .env file.
type Config struct {
	// Application
	AppEnv  string `mapstructure:"APP_ENV"`
	AppName string `mapstructure:"APP_NAME"`
	AppURL  string `mapstructure:"APP_URL"`
	Port    string `mapstructure:"PORT"`

	// Database (PostgreSQL)
	DBHost            string        `mapstructure:"DB_HOST"`
	DBPort            string        `mapstructure:"DB_PORT"`
	DBUser            string        `mapstructure:"DB_USER"`
	DBPassword        string        `mapstructure:"DB_PASSWORD"`
	DBName            string        `mapstructure:"DB_NAME"`
	DBSSLMode         string        `mapstructure:"DB_SSLMODE"`
	DBMaxOpenConns    int           `mapstructure:"DB_MAX_OPEN_CONNS"`
	DBMaxIdleConns    int           `mapstructure:"DB_MAX_IDLE_CONNS"`
	DBConnMaxLifetime time.Duration `mapstructure:"DB_CONN_MAX_LIFETIME"`

	// Redis
	RedisHost     string `mapstructure:"REDIS_HOST"`
	RedisPort     string `mapstructure:"REDIS_PORT"`
	RedisPassword string `mapstructure:"REDIS_PASSWORD"`
	RedisDB       int    `mapstructure:"REDIS_DB"`

	// JWT
	JWTSecret             string `mapstructure:"JWT_SECRET"`
	JWTAccessExpiresIn    int    `mapstructure:"JWT_ACCESS_EXPIRES_IN"`  // minutes
	JWTRefreshExpiresIn   int    `mapstructure:"JWT_REFRESH_EXPIRES_IN"` // minutes

	// CORS
	CORSAllowedOrigins string `mapstructure:"CORS_ALLOWED_ORIGINS"`

	// Rate Limiting
	RateLimitRequests int `mapstructure:"RATE_LIMIT_REQUESTS"` // per period
	RateLimitPeriod   int `mapstructure:"RATE_LIMIT_PERIOD"`   // seconds

	// Storage
	StorageProvider  string `mapstructure:"STORAGE_PROVIDER"` // local | s3
	StorageLocalPath string `mapstructure:"STORAGE_LOCAL_PATH"`
	S3Endpoint       string `mapstructure:"S3_ENDPOINT"`
	S3Bucket         string `mapstructure:"S3_BUCKET"`
	S3Region         string `mapstructure:"S3_REGION"`
	S3AccessKey      string `mapstructure:"S3_ACCESS_KEY"`
	S3SecretKey      string `mapstructure:"S3_SECRET_KEY"`

	// Email (SMTP)
	SMTPHost     string `mapstructure:"SMTP_HOST"`
	SMTPPort     int    `mapstructure:"SMTP_PORT"`
	SMTPUser     string `mapstructure:"SMTP_USER"`
	SMTPPassword string `mapstructure:"SMTP_PASSWORD"`
	SMTPFrom     string `mapstructure:"SMTP_FROM"`

	// Payment (Midtrans)
	MidtransServerKey string `mapstructure:"MIDTRANS_SERVER_KEY"`
	MidtransClientKey string `mapstructure:"MIDTRANS_CLIENT_KEY"`
	MidtransEnv       string `mapstructure:"MIDTRANS_ENV"` // sandbox | production

	// Search (Meilisearch)
	MeiliHost      string `mapstructure:"MEILI_HOST"`
	MeiliMasterKey string `mapstructure:"MEILI_MASTER_KEY"`
}

// NewConfig reads configuration from .env file and/or environment variables.
func NewConfig() *Config {
	setDefaults()

	viper.AddConfigPath(".")
	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	if err := viper.ReadInConfig(); err != nil {
		log.Printf("⚠️  Config file not found, reading from environment: %v", err)
	}

	cfg := &Config{}
	if err := viper.Unmarshal(cfg); err != nil {
		log.Fatalf("❌ Failed to unmarshal config: %v", err)
	}

	return cfg
}

// DSN builds the PostgreSQL connection string.
func (c *Config) DSN() string {
	return fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		c.DBHost, c.DBPort, c.DBUser, c.DBPassword, c.DBName, c.DBSSLMode,
	)
}

// RedisAddr returns the Redis address in host:port format.
func (c *Config) RedisAddr() string {
	return fmt.Sprintf("%s:%s", c.RedisHost, c.RedisPort)
}

// IsProd returns true when running in production mode.
func (c *Config) IsProd() bool {
	return strings.ToLower(c.AppEnv) == "production"
}

// CORSOrigins returns the list of allowed CORS origins.
func (c *Config) CORSOrigins() []string {
	if c.CORSAllowedOrigins == "" {
		return []string{"http://localhost:5173", "http://localhost:3000"}
	}
	parts := strings.Split(c.CORSAllowedOrigins, ",")
	for i := range parts {
		parts[i] = strings.TrimSpace(parts[i])
	}
	return parts
}

func setDefaults() {
	viper.SetDefault("APP_ENV", "development")
	viper.SetDefault("APP_NAME", "E-Commerce API")
	viper.SetDefault("APP_URL", "http://localhost:8080")
	viper.SetDefault("PORT", "8080")

	viper.SetDefault("DB_HOST", "localhost")
	viper.SetDefault("DB_PORT", "5432")
	viper.SetDefault("DB_USER", "ecommerce")
	viper.SetDefault("DB_PASSWORD", "ecommerce")
	viper.SetDefault("DB_NAME", "ecommerce")
	viper.SetDefault("DB_SSLMODE", "disable")
	viper.SetDefault("DB_MAX_OPEN_CONNS", 25)
	viper.SetDefault("DB_MAX_IDLE_CONNS", 5)
	viper.SetDefault("DB_CONN_MAX_LIFETIME", 300*time.Second)

	viper.SetDefault("REDIS_HOST", "localhost")
	viper.SetDefault("REDIS_PORT", "6379")
	viper.SetDefault("REDIS_PASSWORD", "")
	viper.SetDefault("REDIS_DB", 0)

	viper.SetDefault("JWT_ACCESS_EXPIRES_IN", 15)    // 15 minutes
	viper.SetDefault("JWT_REFRESH_EXPIRES_IN", 10080) // 7 days

	viper.SetDefault("RATE_LIMIT_REQUESTS", 100)
	viper.SetDefault("RATE_LIMIT_PERIOD", 60)

	viper.SetDefault("STORAGE_PROVIDER", "local")
	viper.SetDefault("STORAGE_LOCAL_PATH", "./uploads")

	viper.SetDefault("SMTP_PORT", 587)
	viper.SetDefault("SMTP_FROM", "noreply@ecommerce.local")

	viper.SetDefault("MIDTRANS_ENV", "sandbox")

	viper.SetDefault("MEILI_HOST", "http://localhost:7700")
}
