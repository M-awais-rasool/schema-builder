package services

import (
	"context"
	"fmt"

	"github.com/sirupsen/logrus"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"schema-builder-backend/internal/models"
	"schema-builder-backend/internal/repository"
	"schema-builder-backend/pkg/logger"
)

type SchemaService struct {
	schemaRepo repository.SchemaRepository
	userRepo   repository.UserRepository
	log        *logrus.Logger
}

func NewSchemaService(schemaRepo repository.SchemaRepository, userRepo repository.UserRepository) *SchemaService {
	return &SchemaService{
		schemaRepo: schemaRepo,
		userRepo:   userRepo,
		log:        logger.GetLogger(),
	}
}

func (s *SchemaService) CreateSchema(ctx context.Context, userID primitive.ObjectID, req *models.CreateSchemaRequest) (*models.Schema, error) {
	_, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, fmt.Errorf("user not found: %v", err)
	}

	schema := &models.Schema{
		UserID:      userID,
		Name:        req.Name,
		Description: req.Description,
		Tables:      req.Tables,
		IsPublic:    req.IsPublic,
	}

	if err := s.schemaRepo.Create(ctx, schema); err != nil {
		s.log.Errorf("Failed to create schema: %v", err)
		return nil, fmt.Errorf("failed to create schema: %v", err)
	}

	s.log.Infof("Schema created successfully: %s for user: %s", schema.ID.Hex(), userID.Hex())
	return schema, nil
}

func (s *SchemaService) GetSchemaByID(ctx context.Context, id primitive.ObjectID, userID primitive.ObjectID) (*models.Schema, error) {
	schema, err := s.schemaRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("schema not found: %v", err)
	}

	if schema.UserID != userID && !schema.IsPublic {
		return nil, fmt.Errorf("access denied: schema is private")
	}

	return schema, nil
}

func (s *SchemaService) GetUserSchemas(ctx context.Context, userID primitive.ObjectID, page, limit int) ([]*models.Schema, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	schemas, total, err := s.schemaRepo.GetByUserID(ctx, userID, page, limit)
	if err != nil {
		s.log.Errorf("Failed to get user schemas: %v", err)
		return nil, 0, fmt.Errorf("failed to get user schemas: %v", err)
	}

	return schemas, total, nil
}

func (s *SchemaService) GetPublicSchemas(ctx context.Context, page, limit int) ([]*models.Schema, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	schemas, total, err := s.schemaRepo.GetPublicSchemas(ctx, page, limit)
	if err != nil {
		s.log.Errorf("Failed to get public schemas: %v", err)
		return nil, 0, fmt.Errorf("failed to get public schemas: %v", err)
	}

	return schemas, total, nil
}

func (s *SchemaService) GetOtherUsersSchemas(ctx context.Context, excludeUserID primitive.ObjectID, page, limit int) ([]*models.Schema, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	schemas, total, err := s.schemaRepo.GetOtherUsersSchemas(ctx, excludeUserID, page, limit)
	if err != nil {
		s.log.Errorf("Failed to get other users' schemas: %v", err)
		return nil, 0, fmt.Errorf("failed to get other users' schemas: %v", err)
	}

	return schemas, total, nil
}

func (s *SchemaService) UpdateSchema(ctx context.Context, id primitive.ObjectID, userID primitive.ObjectID, req *models.UpdateSchemaRequest) (*models.Schema, error) {
	schema, err := s.schemaRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("schema not found: %v", err)
	}

	if schema.UserID != userID {
		return nil, fmt.Errorf("access denied: you can only update your own schemas")
	}

	if err := s.schemaRepo.Update(ctx, id, req); err != nil {
		s.log.Errorf("Failed to update schema: %v", err)
		return nil, fmt.Errorf("failed to update schema: %v", err)
	}

	updatedSchema, err := s.schemaRepo.GetByID(ctx, id)
	if err != nil {
		return schema, nil
	}

	s.log.Infof("Schema updated successfully: %s", id.Hex())
	return updatedSchema, nil
}

func (s *SchemaService) DeleteSchema(ctx context.Context, id primitive.ObjectID, userID primitive.ObjectID) error {
	schema, err := s.schemaRepo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("schema not found: %v", err)
	}

	if schema.UserID != userID {
		return fmt.Errorf("access denied: you can only delete your own schemas")
	}

	if err := s.schemaRepo.Delete(ctx, id); err != nil {
		s.log.Errorf("Failed to delete schema: %v", err)
		return fmt.Errorf("failed to delete schema: %v", err)
	}

	s.log.Infof("Schema deleted successfully: %s", id.Hex())
	return nil
}

func (s *SchemaService) DuplicateSchema(ctx context.Context, id primitive.ObjectID, userID primitive.ObjectID, newName string) (*models.Schema, error) {
	originalSchema, err := s.GetSchemaByID(ctx, id, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get original schema: %v", err)
	}

	duplicateReq := &models.CreateSchemaRequest{
		Name:        newName,
		Description: fmt.Sprintf("Copy of %s", originalSchema.Name),
		Tables:      originalSchema.Tables,
		IsPublic:    false,
	}

	return s.CreateSchema(ctx, userID, duplicateReq)
}

func (s *SchemaService) ToggleSchemaVisibility(ctx context.Context, id primitive.ObjectID, userID primitive.ObjectID) (*models.Schema, error) {
	schema, err := s.schemaRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("schema not found: %v", err)
	}

	if schema.UserID != userID {
		return nil, fmt.Errorf("access denied: you can only modify your own schemas")
	}

	isPublic := !schema.IsPublic
	updateReq := &models.UpdateSchemaRequest{
		IsPublic: &isPublic,
	}

	return s.UpdateSchema(ctx, id, userID, updateReq)
}
