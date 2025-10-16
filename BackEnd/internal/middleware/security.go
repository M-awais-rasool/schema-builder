package middleware

import (
	"net/http"
	"time"

	"github.com/didip/tollbooth/v7"
	"github.com/didip/tollbooth/v7/limiter"
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/requestid"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"schema-builder-backend/internal/config"
	"schema-builder-backend/internal/models"
	"schema-builder-backend/pkg/logger"
)

type SecurityMiddleware struct {
	config *config.Config
	log    *logrus.Logger
}

func NewSecurityMiddleware(cfg *config.Config) *SecurityMiddleware {
	return &SecurityMiddleware{
		config: cfg,
		log:    logger.GetLogger(),
	}
}

func (m *SecurityMiddleware) CORS() gin.HandlerFunc {
	corsConfig := cors.Config{
		AllowOrigins:     m.config.CORS.AllowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization", "X-Request-ID"},
		ExposeHeaders:    []string{"Content-Length", "X-Request-ID"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	return cors.New(corsConfig)
}

func (m *SecurityMiddleware) RateLimit() gin.HandlerFunc {
	lmt := tollbooth.NewLimiter(
		float64(m.config.Security.RateLimitMaxRequests),
		&limiter.ExpirableOptions{
			DefaultExpirationTTL: m.config.Security.RateLimitWindow,
		},
	)
	lmt.SetMessage("Rate limit exceeded. Please try again later.")
	lmt.SetMessageContentType("application/json")

	return gin.HandlerFunc(func(c *gin.Context) {
		httpError := tollbooth.LimitByRequest(lmt, c.Writer, c.Request)
		if httpError != nil {
			c.JSON(httpError.StatusCode, models.ErrorResponse{
				Error:   "rate_limit_exceeded",
				Message: httpError.Message,
			})
			c.Abort()
			return
		}

		c.Next()
	})
}

func (m *SecurityMiddleware) RequestID() gin.HandlerFunc {
	return requestid.New()
}

func (m *SecurityMiddleware) SecurityHeaders() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		c.Header("X-Content-Type-Options", "nosniff")
		c.Header("X-Frame-Options", "DENY")
		c.Header("X-XSS-Protection", "1; mode=block")
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")
		c.Header("Content-Security-Policy", "default-src 'self'")

		c.Header("Server", "")

		c.Next()
	})
}

func (m *SecurityMiddleware) RequestLogger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		entry := m.log.WithFields(logrus.Fields{
			"status":     param.StatusCode,
			"method":     param.Method,
			"path":       param.Path,
			"ip":         param.ClientIP,
			"user_agent": param.Request.UserAgent(),
			"latency":    param.Latency,
			"request_id": param.Request.Header.Get("X-Request-ID"),
		})

		if param.StatusCode >= 400 {
			entry.Error("Request completed with error")
		} else {
			entry.Info("Request completed")
		}

		return ""
	})
}

func (m *SecurityMiddleware) ErrorHandler() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		m.log.WithField("panic", recovered).Error("Panic recovered")

		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "internal_server_error",
			Message: "An unexpected error occurred",
		})
	})
}

func (m *SecurityMiddleware) ValidateContentType() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		if c.Request.Method == "POST" || c.Request.Method == "PUT" || c.Request.Method == "PATCH" {
			contentType := c.GetHeader("Content-Type")
			if contentType != "" && !isValidContentType(contentType) {
				c.JSON(http.StatusUnsupportedMediaType, models.ErrorResponse{
					Error:   "unsupported_media_type",
					Message: "Content-Type must be application/json",
				})
				c.Abort()
				return
			}
		}

		c.Next()
	})
}

func isValidContentType(contentType string) bool {
	validTypes := []string{
		"application/json",
		"application/json; charset=utf-8",
		"multipart/form-data",
	}

	for _, validType := range validTypes {
		if contentType == validType ||
			(validType == "multipart/form-data" && len(contentType) > len(validType) && contentType[:len(validType)] == validType) {
			return true
		}
	}

	return false
}

func (m *SecurityMiddleware) MaxBodySize(maxBytes int64) gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxBytes)
		c.Next()
	})
}
