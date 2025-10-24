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
	authService *services.AuthService
	userService *services.UserService
	log         *logrus.Logger
}

func NewAuthHandler(authService *services.AuthService, userService *services.UserService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
		userService: userService,
		log:         logger.GetLogger(),
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Errorf("Failed to bind register request: %v", err)
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

	if err := h.authService.Register(c.Request.Context(), &req); err != nil {
		h.log.Errorf("Registration failed: %v", err)
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "registration_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.SuccessResponse{
		Message: "Registration successful. Please check your email for verification code.",
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Errorf("Failed to bind login request: %v", err)
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

	response, err := h.authService.Login(c.Request.Context(), &req)
	if err != nil {
		h.log.Errorf("Login failed: %v", err)
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "login_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Login successful",
		Data:    response,
	})
}

func (h *AuthHandler) Verify(c *gin.Context) {
	var req models.VerifyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Errorf("Failed to bind verify request: %v", err)
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

	if err := h.authService.Verify(c.Request.Context(), &req); err != nil {
		h.log.Errorf("Verification failed: %v", err)
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "verification_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Email verified successfully. You can now login.",
	})
}

func (h *AuthHandler) ResendVerificationCode(c *gin.Context) {
	var req models.ResendCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Errorf("Failed to bind resend request: %v", err)
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

	if err := h.authService.ResendVerificationCode(c.Request.Context(), &req); err != nil {
		h.log.Errorf("Resend verification code failed: %v", err)
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "resend_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Verification code resent successfully.",
	})
}

func (h *AuthHandler) ForgotPassword(c *gin.Context) {
	var req models.ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Errorf("Failed to bind forgot password request: %v", err)
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

	if err := h.authService.ForgotPassword(c.Request.Context(), &req); err != nil {
		h.log.Errorf("Forgot password failed: %v", err)
		c.JSON(http.StatusOK, models.SuccessResponse{
			Message: "If the email exists, a password reset code has been sent.",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "If the email exists, a password reset code has been sent.",
	})
}

func (h *AuthHandler) ResetPassword(c *gin.Context) {
	var req models.ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Errorf("Failed to bind reset password request: %v", err)
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

	if err := h.authService.ResetPassword(c.Request.Context(), &req); err != nil {
		h.log.Errorf("Reset password failed: %v", err)
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "reset_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Password reset successfully. You can now login with your new password.",
	})
}

func (h *AuthHandler) GoogleAuth(c *gin.Context) {
	var req models.GoogleAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Errorf("Failed to bind Google auth request: %v", err)
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
	h.log.Infof("Google auth request: %+v", req)
	response, err := h.authService.GoogleAuth(c.Request.Context(), &req)
	if err != nil {
		h.log.Errorf("Google auth failed: %v", err)
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "google_auth_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Google authentication successful",
		Data:    response,
	})
}

func (h *AuthHandler) ResendCode(c *gin.Context) {
	var req models.ResendCodeRequest
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

	if err := h.authService.ResendVerificationCode(c.Request.Context(), &req); err != nil {
		h.log.Errorf("Resend code failed: %v", err)
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "resend_failed",
			Message: err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Verification code sent successfully",
	})
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

func (h *AuthHandler) CheckUser(c *gin.Context) {
	var req models.CheckUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.log.Errorf("Invalid request body: %v", err)
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "invalid_request",
			Message: "Invalid request body",
		})
		return
	}

	if errors := utils.ValidateStruct(&req); errors != nil {
		h.log.Errorf("Validation failed: %v", errors)
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "validation_failed",
			Message: "Invalid input data",
			Details: map[string]interface{}{"errors": errors},
		})
		return
	}

	response, err := h.authService.CheckUser(c.Request.Context(), &req)
	if err != nil {
		h.log.Errorf("Check user failed: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "check_failed",
			Message: "Failed to check user",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "User check completed",
		Data:    response,
	})
}
