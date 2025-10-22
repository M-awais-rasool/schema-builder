package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"schema-builder-backend/internal/middleware"
	"schema-builder-backend/internal/models"
	"schema-builder-backend/internal/services"
	"schema-builder-backend/internal/utils"
	"schema-builder-backend/pkg/logger"
)

type SchemaHandler struct {
	schemaService *services.SchemaService
	log           *logrus.Logger
}

func NewSchemaHandler(schemaService *services.SchemaService) *SchemaHandler {
	return &SchemaHandler{
		schemaService: schemaService,
		log:           logger.GetLogger(),
	}
}

func (h *SchemaHandler) CreateSchema(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	var req models.CreateSchemaRequest
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

	schema, err := h.schemaService.CreateSchema(c.Request.Context(), user.ID, &req)
	if err != nil {
		h.log.Errorf("Schema creation failed: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "creation_failed",
			Message: "Failed to create schema",
		})
		return
	}

	c.JSON(http.StatusCreated, models.SuccessResponse{
		Message: "Schema created successfully",
		Data:    schema,
	})
}

func (h *SchemaHandler) GetSchema(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "invalid_id",
			Message: "Invalid schema ID format",
		})
		return
	}

	schema, err := h.schemaService.GetSchemaByID(c.Request.Context(), id, user.ID)
	if err != nil {
		if err.Error() == "access denied: schema is private" {
			c.JSON(http.StatusForbidden, models.ErrorResponse{
				Error:   "access_denied",
				Message: "You don't have permission to view this schema",
			})
			return
		}
		c.JSON(http.StatusNotFound, models.ErrorResponse{
			Error:   "not_found",
			Message: "Schema not found",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Schema retrieved successfully",
		Data:    schema,
	})
}

func (h *SchemaHandler) ListUserSchemas(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	schemas, total, err := h.schemaService.GetUserSchemas(c.Request.Context(), user.ID, page, limit)
	if err != nil {
		h.log.Errorf("Failed to list user schemas: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "fetch_failed",
			Message: "Failed to fetch schemas",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Schemas retrieved successfully",
		Data: map[string]interface{}{
			"schemas": schemas,
			"pagination": map[string]interface{}{
				"page":       page,
				"limit":      limit,
				"total":      total,
				"totalPages": (total + int64(limit) - 1) / int64(limit),
			},
		},
	})
}

func (h *SchemaHandler) ListPublicSchemas(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	schemas, total, err := h.schemaService.GetPublicSchemas(c.Request.Context(), page, limit)
	if err != nil {
		h.log.Errorf("Failed to list public schemas: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "fetch_failed",
			Message: "Failed to fetch public schemas",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Public schemas retrieved successfully",
		Data: map[string]interface{}{
			"schemas": schemas,
			"pagination": map[string]interface{}{
				"page":       page,
				"limit":      limit,
				"total":      total,
				"totalPages": (total + int64(limit) - 1) / int64(limit),
			},
		},
	})
}

func (h *SchemaHandler) ListOtherUsersSchemas(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	schemas, total, err := h.schemaService.GetOtherUsersSchemas(c.Request.Context(), user.ID, page, limit)
	if err != nil {
		h.log.Errorf("Failed to list other users' schemas: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "fetch_failed",
			Message: "Failed to fetch other users' schemas",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Other users' schemas retrieved successfully",
		Data: map[string]interface{}{
			"schemas": schemas,
			"pagination": map[string]interface{}{
				"page":       page,
				"limit":      limit,
				"total":      total,
				"totalPages": (total + int64(limit) - 1) / int64(limit),
			},
		},
	})
}

func (h *SchemaHandler) UpdateSchema(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "invalid_id",
			Message: "Invalid schema ID format",
		})
		return
	}

	var req models.UpdateSchemaRequest
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

	schema, err := h.schemaService.UpdateSchema(c.Request.Context(), id, user.ID, &req)
	if err != nil {
		if err.Error() == "access denied: you can only update your own schemas" {
			c.JSON(http.StatusForbidden, models.ErrorResponse{
				Error:   "access_denied",
				Message: "You don't have permission to update this schema",
			})
			return
		}
		if err.Error() == "schema not found: schema not found" {
			c.JSON(http.StatusNotFound, models.ErrorResponse{
				Error:   "not_found",
				Message: "Schema not found",
			})
			return
		}
		h.log.Errorf("Schema update failed: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "update_failed",
			Message: "Failed to update schema",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Schema updated successfully",
		Data:    schema,
	})
}

func (h *SchemaHandler) DeleteSchema(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "invalid_id",
			Message: "Invalid schema ID format",
		})
		return
	}

	err = h.schemaService.DeleteSchema(c.Request.Context(), id, user.ID)
	if err != nil {
		if err.Error() == "access denied: you can only delete your own schemas" {
			c.JSON(http.StatusForbidden, models.ErrorResponse{
				Error:   "access_denied",
				Message: "You don't have permission to delete this schema",
			})
			return
		}
		if err.Error() == "schema not found: schema not found" {
			c.JSON(http.StatusNotFound, models.ErrorResponse{
				Error:   "not_found",
				Message: "Schema not found",
			})
			return
		}
		h.log.Errorf("Schema deletion failed: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "deletion_failed",
			Message: "Failed to delete schema",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Schema deleted successfully",
	})
}

func (h *SchemaHandler) DuplicateSchema(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "invalid_id",
			Message: "Invalid schema ID format",
		})
		return
	}

	var req struct {
		Name string `json:"name" validate:"required,min=1,max=100"`
	}
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

	schema, err := h.schemaService.DuplicateSchema(c.Request.Context(), id, user.ID, req.Name)
	if err != nil {
		h.log.Errorf("Schema duplication failed: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "duplication_failed",
			Message: "Failed to duplicate schema",
		})
		return
	}

	c.JSON(http.StatusCreated, models.SuccessResponse{
		Message: "Schema duplicated successfully",
		Data:    schema,
	})
}

func (h *SchemaHandler) ToggleSchemaVisibility(c *gin.Context) {
	user, exists := middleware.GetUserFromContext(c)
	if !exists {
		c.JSON(http.StatusUnauthorized, models.ErrorResponse{
			Error:   "unauthorized",
			Message: "User not found in context",
		})
		return
	}

	idParam := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error:   "invalid_id",
			Message: "Invalid schema ID format",
		})
		return
	}

	schema, err := h.schemaService.ToggleSchemaVisibility(c.Request.Context(), id, user.ID)
	if err != nil {
		if err.Error() == "access denied: you can only modify your own schemas" {
			c.JSON(http.StatusForbidden, models.ErrorResponse{
				Error:   "access_denied",
				Message: "You don't have permission to modify this schema",
			})
			return
		}
		h.log.Errorf("Schema visibility toggle failed: %v", err)
		c.JSON(http.StatusInternalServerError, models.ErrorResponse{
			Error:   "toggle_failed",
			Message: "Failed to toggle schema visibility",
		})
		return
	}

	c.JSON(http.StatusOK, models.SuccessResponse{
		Message: "Schema visibility updated successfully",
		Data:    schema,
	})
}
