package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"schema-builder-backend/internal/models"
	"schema-builder-backend/pkg/database"
)

type UserRepository interface {
	Create(ctx context.Context, user *models.User) error
	GetByID(ctx context.Context, id primitive.ObjectID) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	GetByCognitoSub(ctx context.Context, cognitoSub string) (*models.User, error)
	Update(ctx context.Context, id primitive.ObjectID, update *models.UpdateUserRequest) error
	UpdateCognitoSub(ctx context.Context, id primitive.ObjectID, cognitoSub string) error
	Delete(ctx context.Context, id primitive.ObjectID) error
	List(ctx context.Context, page, limit int) ([]*models.User, int64, error)
}

type SchemaRepository interface {
	Create(ctx context.Context, schema *models.Schema) error
	GetByID(ctx context.Context, id primitive.ObjectID) (*models.Schema, error)
	GetByUserID(ctx context.Context, userID primitive.ObjectID, page, limit int) ([]*models.Schema, int64, error)
	Update(ctx context.Context, id primitive.ObjectID, update *models.UpdateSchemaRequest) error
	Delete(ctx context.Context, id primitive.ObjectID) error
	GetPublicSchemas(ctx context.Context, page, limit int) ([]*models.Schema, int64, error)
}

type Repositories struct {
	User   UserRepository
	Schema SchemaRepository
}

func NewRepositories(db *database.MongoDB) *Repositories {
	return &Repositories{
		User:   NewUserRepository(db),
		Schema: NewSchemaRepository(db),
	}
}
