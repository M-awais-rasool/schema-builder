package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"schema-builder-backend/internal/middleware"
	"schema-builder-backend/internal/models"
	"schema-builder-backend/internal/services"
	"schema-builder-backend/internal/utils"
	"schema-builder-backend/pkg/logger"
)

type AIHandler struct {
	aiService *services.AIService
	log       *logrus.Logger
}

func NewAIHandler(aiService *services.AIService) *AIHandler {
	return &AIHandler{
		aiService: aiService,
		log:       logger.GetLogger(),
	}
}

func (h *AIHandler) Chat(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		h.log.Error("User not found in context")
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User authentication required",
		})
		return
	}

	var req services.ChatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Errorf("Failed to bind chat request: %v", err)
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request format",
		})
		return
	}

	if validationErrors := utils.ValidateStruct(&req); validationErrors != nil {
		h.log.Errorf("Chat request validation failed: %v", validationErrors)
		details := make(map[string]interface{})
		for k, v := range validationErrors {
			details[k] = v
		}
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "validation_failed",
			Message: "Request validation failed",
			Details: details,
		})
		return
	}

	if req.SessionID == "" {
		req.SessionID = user.ID.Hex()
	}

	response, err := h.aiService.Chat(c.Request.Context(), &req)
	if err != nil {
		h.log.Errorf("AI chat failed: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "internal_error",
			Message: "Failed to process chat request",
		})
		return
	}

	h.log.Infof("AI chat successful for user: %s", user.ID.Hex())

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Chat processed successfully",
		Data:    response,
	})
}
