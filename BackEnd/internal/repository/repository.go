package repository

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"schema-builder-backend/internal/models"
	"schema-builder-backend/pkg/database"
)

type UserRepository interface {
	Create(ctx context.Context, user *models.User) error
	GetByID(ctx context.Context, id primitive.ObjectID) (*models.User, error)
	GetByEmail(ctx context.Context, email string) (*models.User, error)
	GetByCognitoSub(ctx context.Context, cognitoSub string) (*models.User, error)
	Update(ctx context.Context, id primitive.ObjectID, update *models.UpdateUserRequest) error
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

type userRepository struct {
	collection *mongo.Collection
}

type schemaRepository struct {
	collection *mongo.Collection
}

func NewRepositories(db *database.MongoDB) *Repositories {
	return &Repositories{
		User:   NewUserRepository(db),
		Schema: NewSchemaRepository(db),
	}
}

func NewUserRepository(db *database.MongoDB) UserRepository {
	return &userRepository{
		collection: db.GetCollection("users"),
	}
}

func NewSchemaRepository(db *database.MongoDB) SchemaRepository {
	return &schemaRepository{
		collection: db.GetCollection("schemas"),
	}
}

func (r *userRepository) Create(ctx context.Context, user *models.User) error {
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	result, err := r.collection.InsertOne(ctx, user)
	if err != nil {
		return fmt.Errorf("failed to create user: %v", err)
	}

	user.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *userRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %v", err)
	}

	return &user, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %v", err)
	}

	return &user, nil
}

func (r *userRepository) GetByCognitoSub(ctx context.Context, cognitoSub string) (*models.User, error) {
	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"cognito_sub": cognitoSub}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %v", err)
	}

	return &user, nil
}

func (r *userRepository) Update(ctx context.Context, id primitive.ObjectID, update *models.UpdateUserRequest) error {
	updateDoc := bson.M{"updated_at": time.Now()}

	if update.FirstName != "" {
		updateDoc["first_name"] = update.FirstName
	}
	if update.LastName != "" {
		updateDoc["last_name"] = update.LastName
	}
	if update.Username != "" {
		updateDoc["username"] = update.Username
	}
	if update.Avatar != "" {
		updateDoc["avatar"] = update.Avatar
	}

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": updateDoc},
	)
	if err != nil {
		return fmt.Errorf("failed to update user: %v", err)
	}

	return nil
}

func (r *userRepository) Delete(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("failed to delete user: %v", err)
	}

	return nil
}

func (r *userRepository) List(ctx context.Context, page, limit int) ([]*models.User, int64, error) {
	skip := (page - 1) * limit

	opts := options.Find().
		SetSort(bson.D{{Key: "created_at", Value: -1}}).
		SetSkip(int64(skip)).
		SetLimit(int64(limit))

	cursor, err := r.collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to find users: %v", err)
	}
	defer cursor.Close(ctx)

	var users []*models.User
	if err := cursor.All(ctx, &users); err != nil {
		return nil, 0, fmt.Errorf("failed to decode users: %v", err)
	}

	total, err := r.collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count users: %v", err)
	}

	return users, total, nil
}

func (r *schemaRepository) Create(ctx context.Context, schema *models.Schema) error {
	schema.CreatedAt = time.Now()
	schema.UpdatedAt = time.Now()
	schema.Version = 1

	result, err := r.collection.InsertOne(ctx, schema)
	if err != nil {
		return fmt.Errorf("failed to create schema: %v", err)
	}

	schema.ID = result.InsertedID.(primitive.ObjectID)
	return nil
}

func (r *schemaRepository) GetByID(ctx context.Context, id primitive.ObjectID) (*models.Schema, error) {
	var schema models.Schema
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&schema)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("schema not found")
		}
		return nil, fmt.Errorf("failed to get schema: %v", err)
	}

	return &schema, nil
}

func (r *schemaRepository) GetByUserID(ctx context.Context, userID primitive.ObjectID, page, limit int) ([]*models.Schema, int64, error) {
	skip := (page - 1) * limit

	opts := options.Find().
		SetSort(bson.D{{Key: "updated_at", Value: -1}}).
		SetSkip(int64(skip)).
		SetLimit(int64(limit))

	filter := bson.M{"user_id": userID}

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to find schemas: %v", err)
	}
	defer cursor.Close(ctx)

	var schemas []*models.Schema
	if err := cursor.All(ctx, &schemas); err != nil {
		return nil, 0, fmt.Errorf("failed to decode schemas: %v", err)
	}

	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count schemas: %v", err)
	}

	return schemas, total, nil
}

func (r *schemaRepository) Update(ctx context.Context, id primitive.ObjectID, update *models.UpdateSchemaRequest) error {
	updateDoc := bson.M{"updated_at": time.Now()}

	if update.Name != "" {
		updateDoc["name"] = update.Name
	}
	if update.Description != "" {
		updateDoc["description"] = update.Description
	}
	if update.Tables != nil {
		updateDoc["tables"] = update.Tables
		updateDoc["$inc"] = bson.M{"version": 1}
	}
	if update.IsPublic != nil {
		updateDoc["is_public"] = *update.IsPublic
	}

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		bson.M{"$set": updateDoc},
	)
	if err != nil {
		return fmt.Errorf("failed to update schema: %v", err)
	}

	return nil
}

func (r *schemaRepository) Delete(ctx context.Context, id primitive.ObjectID) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return fmt.Errorf("failed to delete schema: %v", err)
	}

	return nil
}

func (r *schemaRepository) GetPublicSchemas(ctx context.Context, page, limit int) ([]*models.Schema, int64, error) {
	skip := (page - 1) * limit

	opts := options.Find().
		SetSort(bson.D{{Key: "updated_at", Value: -1}}).
		SetSkip(int64(skip)).
		SetLimit(int64(limit))

	filter := bson.M{"is_public": true}

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to find public schemas: %v", err)
	}
	defer cursor.Close(ctx)

	var schemas []*models.Schema
	if err := cursor.All(ctx, &schemas); err != nil {
		return nil, 0, fmt.Errorf("failed to decode schemas: %v", err)
	}

	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count public schemas: %v", err)
	}

	return schemas, total, nil
}
