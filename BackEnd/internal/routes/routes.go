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

	// All routes are protected since authentication is handled by AWS Cognito on frontend
	protected := api.Group("/")
	protected.Use(authMiddleware.RequireAuth())
	{
		user := protected.Group("/user")
		{
			user.GET("/profile", authHandler.GetProfile)
			user.PUT("/profile", authHandler.UpdateProfile)
		}

		// Schema routes (to be implemented)
		// schemas := protected.Group("/schemas")
		// {
		//     schemas.GET("", schemaHandler.ListSchemas)
		//     schemas.POST("", schemaHandler.CreateSchema)
		//     schemas.GET("/:id", schemaHandler.GetSchema)
		//     schemas.PUT("/:id", schemaHandler.UpdateProfile)
		//     schemas.DELETE("/:id", schemaHandler.DeleteSchema)
		// }
	}
}
