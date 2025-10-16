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

type AuthHandler struct {
	cognitoService *services.CognitoService
	userService    *services.UserService
	log            *logrus.Logger
}

func NewAuthHandler(cognitoService *services.CognitoService, userService *services.UserService) *AuthHandler {
	return &AuthHandler{
		cognitoService: cognitoService,
		userService:    userService,
		log:            logger.GetLogger(),
	}
}

func (h *AuthHandler) GetProfile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Profile retrieved successfully",
		Data:    user,
	})
}

func (h *AuthHandler) UpdateProfile(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	var req models.UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
		})
		return
	}

	if errors := utils.ValidateStruct(&req); errors != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "validation_error",
			Message: "Validation failed",
			Details: map[string]interface{}{"errors": errors},
		})
		return
	}

	updatedUser, err := h.userService.UpdateUser(c.Request.Context(), user.ID, &req)
	if err != nil {
		h.log.Errorf("Profile update failed: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "update_failed",
			Message: "Failed to update profile",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Profile updated successfully",
		Data:    updatedUser,
	})
}
