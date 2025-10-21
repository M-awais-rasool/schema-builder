package services

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/cognitoidentityprovider"

	"schema-builder-backend/internal/config"
	"schema-builder-backend/internal/models"
	"schema-builder-backend/pkg/logger"

	"github.com/sirupsen/logrus"
)

type CognitoService struct {
	client       *cognitoidentityprovider.CognitoIdentityProvider
	userPoolID   string
	clientID     string
	log          *logrus.Logger
}

func NewCognitoService(cfg *config.Config) (*CognitoService, error) {
	log := logger.GetLogger()

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(cfg.AWS.Region),
		Credentials: credentials.NewStaticCredentials(
			cfg.AWS.AccessKeyID,
			cfg.AWS.SecretAccessKey,
			"",
		),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create AWS session: %v", err)
	}

	client := cognitoidentityprovider.New(sess)

	return &CognitoService{
		client:       client,
		userPoolID:   cfg.AWS.CognitoUserPoolID,
		clientID:     cfg.AWS.CognitoClientID,
		log:          log,
	}, nil
}

func (s *CognitoService) GetUser(accessToken string) (*models.User, error) {
	input := &cognitoidentityprovider.GetUserInput{
		AccessToken: aws.String(accessToken),
	}

	result, err := s.client.GetUser(input)
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %v", err)
	}

	user := &models.User{
		CognitoSub: *result.Username,
		IsVerified: true,
	}

	for _, attr := range result.UserAttributes {
		switch *attr.Name {
		case "email":
			user.Email = *attr.Value
		case "given_name":
			user.FirstName = *attr.Value
		case "family_name":
			user.LastName = *attr.Value
		case "preferred_username":
			user.Username = *attr.Value
		case "email_verified":
			user.IsVerified = *attr.Value == "true"
		}
	}

	return user, nil
}

func (s *CognitoService) ValidateToken(accessToken string) (*models.User, error) {
	return s.GetUser(accessToken)
}