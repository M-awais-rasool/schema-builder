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

type userRepository struct {
	collection *mongo.Collection
}

func NewUserRepository(db *database.MongoDB) UserRepository {
	return &userRepository{
		collection: db.GetCollection("users"),
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

func (r *userRepository) GetByGoogleID(ctx context.Context, googleID string) (*models.User, error) {
	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"google_id": googleID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %v", err)
	}

	return &user, nil
}

func (r *userRepository) GetByUsername(ctx context.Context, username string) (*models.User, error) {
	var user models.User
	err := r.collection.FindOne(ctx, bson.M{"username": username}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, fmt.Errorf("user not found")
		}
		return nil, fmt.Errorf("failed to get user: %v", err)
	}

	return &user, nil
}

func (r *userRepository) UpdateVerificationCode(ctx context.Context, email, code string, expiry time.Time) error {
	updateDoc := bson.M{
		"verification_code":   code,
		"verification_expiry": expiry,
		"updated_at":          time.Now(),
	}

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"email": email},
		bson.M{"$set": updateDoc},
	)
	if err != nil {
		return fmt.Errorf("failed to update verification code: %v", err)
	}

	return nil
}

func (r *userRepository) UpdateResetCode(ctx context.Context, email, code string, expiry time.Time) error {
	updateDoc := bson.M{
		"reset_code":   code,
		"reset_expiry": expiry,
		"updated_at":   time.Now(),
	}

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"email": email},
		bson.M{"$set": updateDoc},
	)
	if err != nil {
		return fmt.Errorf("failed to update reset code: %v", err)
	}

	return nil
}

func (r *userRepository) VerifyUser(ctx context.Context, email string) error {
	updateDoc := bson.M{
		"is_verified":       true,
		"verification_code": "",
		"updated_at":        time.Now(),
	}

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"email": email},
		bson.M{"$set": updateDoc},
	)
	if err != nil {
		return fmt.Errorf("failed to verify user: %v", err)
	}

	return nil
}

func (r *userRepository) UpdatePassword(ctx context.Context, email, hashedPassword string) error {
	updateDoc := bson.M{
		"password":   hashedPassword,
		"reset_code": "",
		"updated_at": time.Now(),
	}

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"email": email},
		bson.M{"$set": updateDoc},
	)
	if err != nil {
		return fmt.Errorf("failed to update password: %v", err)
	}

	return nil
}

func (r *userRepository) LinkGoogleAccount(ctx context.Context, email, googleID string) error {
	updateDoc := bson.M{
		"google_id":  googleID,
		"updated_at": time.Now(),
	}

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"email": email},
		bson.M{"$set": updateDoc},
	)
	if err != nil {
		return fmt.Errorf("failed to link google account: %v", err)
	}

	return nil
}

func (r *userRepository) UpdateGoogleLinkInfo(ctx context.Context, email string, updates map[string]interface{}) error {
	if len(updates) == 0 {
		return nil
	}

	updates["updated_at"] = time.Now()

	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"email": email},
		bson.M{"$set": updates},
	)
	if err != nil {
		return fmt.Errorf("failed to update google link info: %v", err)
	}

	return nil
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
