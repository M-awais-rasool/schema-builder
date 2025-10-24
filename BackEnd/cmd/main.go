package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"

	"schema-builder-backend/internal/config"
	"schema-builder-backend/internal/handlers"
	"schema-builder-backend/internal/middleware"
	"schema-builder-backend/internal/repository"
	"schema-builder-backend/internal/routes"
	"schema-builder-backend/internal/services"
	"schema-builder-backend/internal/utils"
	"schema-builder-backend/pkg/database"
	"schema-builder-backend/pkg/logger"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	logger.Init(cfg.Server.Env)
	loggerInstance := logger.GetLogger()

	loggerInstance.Info("Starting Schema Builder Backend...")

	utils.InitValidator()

	db, err := database.New(cfg.Database.URI, cfg.Database.Database)
	if err != nil {
		loggerInstance.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	repos := repository.NewRepositories(db)

	jwtService := services.NewJWTService(cfg.JWT.Secret, cfg.JWT.ExpiresIn)
	passwordService := services.NewPasswordService(cfg.Security.BcryptCost)
	emailService := services.NewEmailService(&cfg.Email)

	userService := services.NewUserService(repos.User)
	authService := services.NewAuthService(repos.User, jwtService, passwordService, emailService)
	schemaService := services.NewSchemaService(repos.Schema, repos.User)

	aiService, err := services.NewAIService(cfg)
	if err != nil {
		loggerInstance.Fatalf("Failed to initialize AI service: %v", err)
	}
	defer aiService.Close()

	authMiddleware := middleware.NewAuthMiddleware(jwtService, userService)
	securityMiddleware := middleware.NewSecurityMiddleware(cfg)

	authHandler := handlers.NewAuthHandler(authService, userService)
	schemaHandler := handlers.NewSchemaHandler(schemaService)
	aiHandler := handlers.NewAIHandler(aiService)

	if cfg.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.New()

	routes.SetupRoutes(r, authHandler, schemaHandler, aiHandler, authMiddleware, securityMiddleware)

	server := &http.Server{
		Addr:    ":" + cfg.Server.Port,
		Handler: r,
	}

	go func() {
		loggerInstance.Infof("Server starting on port %s", cfg.Server.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			loggerInstance.Fatalf("Failed to start server: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	loggerInstance.Info("Server shutting down...")

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		loggerInstance.Errorf("Server forced to shutdown: %v", err)
	}

	loggerInstance.Info("Server exited")
}
