package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"

	"schema-builder-backend/internal/models"
	"schema-builder-backend/internal/services"
	"schema-builder-backend/pkg/logger"
)

type AuthMiddleware struct {
	cognitoService *services.CognitoService
	userService    *services.UserService
	log            *logrus.Logger
}

func NewAuthMiddleware(cognitoService *services.CognitoService, userService *services.UserService) *AuthMiddleware {
	return &AuthMiddleware{
		cognitoService: cognitoService,
		userService:    userService,
		log:            logger.GetLogger(),
	}
}

func (m *AuthMiddleware) RequireAuth() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{
				Error:   "unauthorized",
				Message: "Authorization header is required",
			})
			c.Abort()
			return
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{
				Error:   "unauthorized",
				Message: "Invalid authorization header format",
			})
			c.Abort()
			return
		}

		accessToken := tokenParts[1]

		cognitoUser, err := m.cognitoService.ValidateToken(accessToken)
		if err != nil {
			m.log.Errorf("Token validation failed: %v", err)
			c.JSON(http.StatusUnauthorized, models.ErrorResponse{
				Error:   "unauthorized",
				Message: "Invalid or expired token",
			})
			c.Abort()
			return
		}

		user, err := m.userService.GetUserByCognitoSub(c.Request.Context(), cognitoUser.CognitoSub)
		if err != nil {
			userByEmail, emailErr := m.userService.GetUserByEmail(c.Request.Context(), cognitoUser.Email)
			if emailErr == nil && userByEmail != nil {
				linkedUser, linkErr := m.userService.LinkCognitoIdentity(c.Request.Context(), userByEmail.ID, cognitoUser.CognitoSub)
				if linkErr != nil {
					c.JSON(http.StatusInternalServerError, models.ErrorResponse{
						Error:   "internal_error",
						Message: "Failed to link identity",
					})
					c.Abort()
					return
				}
				user = linkedUser
			} else {
				createReq := &models.CreateUserRequest{
					CognitoSub: cognitoUser.CognitoSub,
					Email:      cognitoUser.Email,
					FirstName:  cognitoUser.FirstName,
					LastName:   cognitoUser.LastName,
					Username:   cognitoUser.Username,
				}

				user, err = m.userService.CreateUser(c.Request.Context(), createReq)
				if err != nil {
					m.log.Errorf("Failed to create user: %v", err)
					c.JSON(http.StatusInternalServerError, models.ErrorResponse{
						Error:   "internal_error",
						Message: "Failed to create user",
					})
					c.Abort()
					return
				}
			}
		}

		c.Set("user", user)
		c.Set("cognito_user", cognitoUser)
		c.Set("access_token", accessToken)

		c.Next()
	})
}

func (m *AuthMiddleware) OptionalAuth() gin.HandlerFunc {
	return gin.HandlerFunc(func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			c.Next()
			return
		}

		accessToken := tokenParts[1]

		cognitoUser, err := m.cognitoService.ValidateToken(accessToken)
		if err != nil {
			c.Next()
			return
		}

		user, err := m.userService.GetUserByCognitoSub(c.Request.Context(), cognitoUser.CognitoSub)
		if err != nil {
			c.Next()
			return
		}

		c.Set("user", user)
		c.Set("cognito_user", cognitoUser)
		c.Set("access_token", accessToken)

		c.Next()
	})
}

func GetUserFromContext(c *gin.Context) (*models.User, bool) {
	user, exists := c.Get("user")
	if !exists {
		return nil, false
	}

	userModel, ok := user.(*models.User)
	return userModel, ok
}

func GetCognitoUserFromContext(c *gin.Context) (*models.User, bool) {
	user, exists := c.Get("cognito_user")
	if !exists {
		return nil, false
	}

	userModel, ok := user.(*models.User)
	return userModel, ok
}

func GetAccessTokenFromContext(c *gin.Context) (string, bool) {
	token, exists := c.Get("access_token")
	if !exists {
		return "", false
	}

	accessToken, ok := token.(string)
	return accessToken, ok
}
