package routes

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"schema-builder-backend/internal/handlers"
	"schema-builder-backend/internal/middleware"
)

func SetupRoutes(
	r *gin.Engine,
	authHandler *handlers.AuthHandler,
	schemaHandler *handlers.SchemaHandler,
	aiHandler *handlers.AIHandler,
	authMiddleware *middleware.AuthMiddleware,
	securityMiddleware *middleware.SecurityMiddleware,
) {
	r.Use(securityMiddleware.ErrorHandler())
	r.Use(securityMiddleware.RequestID())
	r.Use(securityMiddleware.RequestLogger())
	r.Use(securityMiddleware.CORS())
	r.Use(securityMiddleware.SecurityHeaders())
	r.Use(securityMiddleware.MaxBodySize(10 << 20))
	r.Use(securityMiddleware.ValidateContentType())
	r.Use(securityMiddleware.RateLimit())

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().UTC(),
			"version":   "1.0.0",
		})
	})

	api := r.Group("/api/v1")

	// Public routes
	public := api.Group("/")
	{
		public.GET("/schemas/public", schemaHandler.ListPublicSchemas)
	}

	protected := api.Group("/")
	protected.Use(authMiddleware.RequireAuth())
	{
		user := protected.Group("/user")
		{
			user.GET("/profile", authHandler.GetProfile)
			user.PUT("/profile", authHandler.UpdateProfile)
		}

		schemas := protected.Group("/schemas")
		{
			schemas.POST("", schemaHandler.CreateSchema)                           // Create a new schema
			schemas.GET("", schemaHandler.ListUserSchemas)                         // List user's schemas
			schemas.GET("/others", schemaHandler.ListOtherUsersSchemas)            // List other users' schemas
			schemas.GET("/:id", schemaHandler.GetSchema)                           // Get specific schema
			schemas.PUT("/:id", schemaHandler.UpdateSchema)                        // Update schema
			schemas.DELETE("/:id", schemaHandler.DeleteSchema)                     // Delete schema
			schemas.POST("/:id/duplicate", schemaHandler.DuplicateSchema)          // Duplicate schema
			schemas.PATCH("/:id/visibility", schemaHandler.ToggleSchemaVisibility) // Toggle public/private
		}

		ai := protected.Group("/ai")
		{
			ai.POST("/chat", aiHandler.Chat) // Send message to AI assistant
		}
	}
}
