package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Firebase FirebaseConfig
	CORS     CORSConfig
	Security SecurityConfig
	AI       AIConfig
	Email    EmailConfig
}

type ServerConfig struct {
	Port string
	Env  string
}

type DatabaseConfig struct {
	URI      string
	Database string
}

type JWTConfig struct {
	Secret    string
	ExpiresIn time.Duration
}

type FirebaseConfig struct {
	ProjectID string
}

type CORSConfig struct {
	AllowedOrigins []string
}

type SecurityConfig struct {
	BcryptCost           int
	RateLimitMaxRequests int
	RateLimitWindow      time.Duration
}

type AIConfig struct {
	GeminiAPIKey string
}

type EmailConfig struct {
	Host     string
	Port     int
	User     string
	Password string
	FromName string
}

func Load() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		fmt.Printf("Warning: Error loading .env file: %v\n", err)
	}

	jwtExpiresIn, err := time.ParseDuration(getEnv("JWT_EXPIRES_IN", "24h"))
	if err != nil {
		return nil, fmt.Errorf("invalid JWT_EXPIRES_IN value: %v", err)
	}

	bcryptCost, err := strconv.Atoi(getEnv("BCRYPT_COST", "12"))
	if err != nil {
		return nil, fmt.Errorf("invalid BCRYPT_COST value: %v", err)
	}

	rateLimitMaxRequests, err := strconv.Atoi(getEnv("RATE_LIMIT_MAX_REQUESTS", "100"))
	if err != nil {
		return nil, fmt.Errorf("invalid RATE_LIMIT_MAX_REQUESTS value: %v", err)
	}

	rateLimitWindow, err := strconv.Atoi(getEnv("RATE_LIMIT_WINDOW", "60"))
	if err != nil {
		return nil, fmt.Errorf("invalid RATE_LIMIT_WINDOW value: %v", err)
	}

	emailPort, err := strconv.Atoi(getEnv("EMAIL_PORT", "587"))
	if err != nil {
		return nil, fmt.Errorf("invalid EMAIL_PORT value: %v", err)
	}

	config := &Config{
		Server: ServerConfig{
			Port: getEnv("PORT", "8080"),
			Env:  getEnv("ENV", "development"),
		},
		Database: DatabaseConfig{
			URI:      getEnv("MONGODB_URI", "mongodb://localhost:27017"),
			Database: getEnv("MONGODB_DATABASE", "schema_builder"),
		},
		JWT: JWTConfig{
			Secret:    getEnv("JWT_SECRET", "default-secret-please-change-in-production"),
			ExpiresIn: jwtExpiresIn,
		},
		Firebase: FirebaseConfig{
			ProjectID: getEnv("FIREBASE_PROJECT_ID", ""),
		},
		CORS: CORSConfig{
			AllowedOrigins: parseStringSlice(getEnv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173")),
		},
		Security: SecurityConfig{
			BcryptCost:           bcryptCost,
			RateLimitMaxRequests: rateLimitMaxRequests,
			RateLimitWindow:      time.Duration(rateLimitWindow) * time.Second,
		},
		AI: AIConfig{
			GeminiAPIKey: getEnv("GEMINI_API_KEY", ""),
		},
		Email: EmailConfig{
			Host:     getEnv("EMAIL_HOST", "smtp.gmail.com"),
			Port:     emailPort,
			User:     getEnv("EMAIL_USER", ""),
			Password: getEnv("EMAIL_PASS", ""),
			FromName: getEnv("EMAIL_FROM_NAME", "Schema Builder"),
		},
	}

	if err := config.Validate(); err != nil {
		return nil, fmt.Errorf("configuration validation failed: %v", err)
	}

	return config, nil
}

func (c *Config) Validate() error {
	if c.JWT.Secret == "default-secret-please-change-in-production" && c.Server.Env == "production" {
		return fmt.Errorf("JWT_SECRET must be set in production")
	}
	if c.Firebase.ProjectID == "" && c.Server.Env == "production" {
		return fmt.Errorf("FIREBASE_PROJECT_ID is required in production")
	}
	if c.AI.GeminiAPIKey == "" {
		return fmt.Errorf("GEMINI_API_KEY is required")
	}
	return nil
}

func (c *Config) IsDevelopment() bool {
	return c.Server.Env == "development"
}

func (c *Config) IsProduction() bool {
	return c.Server.Env == "production"
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func parseStringSlice(value string) []string {
	if value == "" {
		return []string{}
	}

	var result []string
	for _, v := range splitString(value, ",") {
		if trimmed := trimSpaces(v); trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

func splitString(s, sep string) []string {
	if s == "" {
		return []string{}
	}

	var result []string
	start := 0
	for i := 0; i <= len(s)-len(sep); i++ {
		if s[i:i+len(sep)] == sep {
			result = append(result, s[start:i])
			start = i + len(sep)
		}
	}
	result = append(result, s[start:])
	return result
}

func trimSpaces(s string) string {
	start := 0
	end := len(s)

	for start < end && s[start] == ' ' {
		start++
	}
	for end > start && s[end-1] == ' ' {
		end--
	}

	return s[start:end]
}
