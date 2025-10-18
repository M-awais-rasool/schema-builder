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

type schemaRepository struct {
	collection *mongo.Collection
}

func NewSchemaRepository(db *database.MongoDB) SchemaRepository {
	return &schemaRepository{
		collection: db.GetCollection("schemas"),
	}
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
	updateOps := bson.M{"$set": updateDoc}

	if update.Name != "" {
		updateDoc["name"] = update.Name
	}
	if update.Description != "" {
		updateDoc["description"] = update.Description
	}
	if update.Tables != nil {
		updateDoc["tables"] = update.Tables
		updateOps["$inc"] = bson.M{"version": 1}
	}
	if update.IsPublic != nil {
		updateDoc["is_public"] = *update.IsPublic
	}

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": id},
		updateOps,
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
