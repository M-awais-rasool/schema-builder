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

type UserService struct {
	userRepo repository.UserRepository
	log      *logrus.Logger
}

func NewUserService(userRepo repository.UserRepository) *UserService {
	return &UserService{
		userRepo: userRepo,
		log:      logger.GetLogger(),
	}
}

func (s *UserService) CreateUser(ctx context.Context, req *models.CreateUserRequest) (*models.User, error) {
	existingUser, err := s.userRepo.GetByCognitoSub(ctx, req.CognitoSub)
	if err == nil && existingUser != nil {
		return existingUser, nil 
	}

	_, err = s.userRepo.GetByEmail(ctx, req.Email)
	if err == nil {
		return nil, fmt.Errorf("email already in use")
	}

	user := &models.User{
		CognitoSub: req.CognitoSub,
		Email:      req.Email,
		FirstName:  req.FirstName,
		LastName:   req.LastName,
		Username:   req.Username,
		IsVerified: false,
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		s.log.Errorf("Failed to create user: %v", err)
		return nil, fmt.Errorf("failed to create user: %v", err)
	}

	s.log.Infof("User created successfully: %s", user.Email)
	return user, nil
}

func (s *UserService) GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("user not found: %v", err)
	}

	return user, nil
}

func (s *UserService) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		return nil, fmt.Errorf("user not found: %v", err)
	}

	return user, nil
}

func (s *UserService) GetUserByCognitoSub(ctx context.Context, cognitoSub string) (*models.User, error) {
	user, err := s.userRepo.GetByCognitoSub(ctx, cognitoSub)
	if err != nil {
		return nil, fmt.Errorf("user not found: %v", err)
	}

	return user, nil
}

func (s *UserService) UpdateUser(ctx context.Context, id primitive.ObjectID, req *models.UpdateUserRequest) (*models.User, error) {
	existingUser, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("user not found: %v", err)
	}

	if err := s.userRepo.Update(ctx, id, req); err != nil {
		s.log.Errorf("Failed to update user: %v", err)
		return nil, fmt.Errorf("failed to update user: %v", err)
	}

	updatedUser, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return existingUser, nil 
	}

	s.log.Infof("User updated successfully: %s", updatedUser.Email)
	return updatedUser, nil
}

func (s *UserService) DeleteUser(ctx context.Context, id primitive.ObjectID) error {
	_, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return fmt.Errorf("user not found: %v", err)
	}

	if err := s.userRepo.Delete(ctx, id); err != nil {
		s.log.Errorf("Failed to delete user: %v", err)
		return fmt.Errorf("failed to delete user: %v", err)
	}

	s.log.Infof("User deleted successfully: %s", id.Hex())
	return nil
}

func (s *UserService) ListUsers(ctx context.Context, page, limit int) ([]*models.User, int64, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 100 {
		limit = 10
	}

	users, total, err := s.userRepo.List(ctx, page, limit)
	if err != nil {
		s.log.Errorf("Failed to list users: %v", err)
		return nil, 0, fmt.Errorf("failed to list users: %v", err)
	}

	return users, total, nil
}

func (s *UserService) MarkUserAsVerified(ctx context.Context, cognitoSub string) error {
	user, err := s.userRepo.GetByCognitoSub(ctx, cognitoSub)
	if err != nil {
		return fmt.Errorf("user not found: %v", err)
	}

	updateReq := &models.UpdateUserRequest{}
	if err := s.userRepo.Update(ctx, user.ID, updateReq); err != nil {
		s.log.Errorf("Failed to mark user as verified: %v", err)
		return fmt.Errorf("failed to mark user as verified: %v", err)
	}

	s.log.Infof("User marked as verified: %s", user.Email)
	return nil
}
