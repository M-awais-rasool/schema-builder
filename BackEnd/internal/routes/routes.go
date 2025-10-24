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

	public := api.Group("/")
	{
		public.POST("/auth/register", authHandler.Register)
		public.POST("/auth/login", authHandler.Login)
		public.POST("/auth/verify", authHandler.Verify)
		public.POST("/auth/resend-code", authHandler.ResendCode)
		public.POST("/auth/forgot-password", authHandler.ForgotPassword)
		public.POST("/auth/reset-password", authHandler.ResetPassword)
		public.POST("/auth/google", authHandler.GoogleAuth)
		public.POST("/auth/check-user", authHandler.CheckUser)

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
			schemas.POST("", schemaHandler.CreateSchema)
			schemas.GET("", schemaHandler.ListUserSchemas)
			schemas.GET("/others", schemaHandler.ListOtherUsersSchemas)
			schemas.GET("/:id", schemaHandler.GetSchema)
			schemas.PUT("/:id", schemaHandler.UpdateSchema)
			schemas.DELETE("/:id", schemaHandler.DeleteSchema)
			schemas.POST("/:id/duplicate", schemaHandler.DuplicateSchema)
			schemas.PATCH("/:id/visibility", schemaHandler.ToggleSchemaVisibility)
		}

		ai := protected.Group("/ai")
		{
			ai.POST("/chat", aiHandler.Chat)
		}
	}
}
