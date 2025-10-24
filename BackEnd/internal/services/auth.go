package services

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/sirupsen/logrus"
	"google.golang.org/api/idtoken"

	"schema-builder-backend/internal/models"
	"schema-builder-backend/internal/repository"
	"schema-builder-backend/pkg/logger"
)

type AuthService struct {
	userRepo        repository.UserRepository
	jwtService      *JWTService
	passwordService *PasswordService
	emailService    *EmailService
	log             *logrus.Logger
}

func NewAuthService(
	userRepo repository.UserRepository,
	jwtService *JWTService,
	passwordService *PasswordService,
	emailService *EmailService,
) *AuthService {
	return &AuthService{
		userRepo:        userRepo,
		jwtService:      jwtService,
		passwordService: passwordService,
		emailService:    emailService,
		log:             logger.GetLogger(),
	}
}

func (s *AuthService) GenerateVerificationCode() (string, error) {
	max := big.NewInt(1000000)
	n, err := rand.Int(rand.Reader, max)
	if err != nil {
		return "", err
	}
	return fmt.Sprintf("%06d", n.Int64()), nil
}

func (s *AuthService) GenerateSecureToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func (s *AuthService) Register(ctx context.Context, req *models.RegisterRequest) error {
	existingUser, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err == nil && existingUser != nil {
		return fmt.Errorf("user with this email already exists")
	}

	hashedPassword, err := s.passwordService.HashPassword(req.Password)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}

	code, err := s.GenerateVerificationCode()
	if err != nil {
		return fmt.Errorf("failed to generate verification code: %v", err)
	}

	user := &models.User{
		Email:              req.Email,
		Password:           hashedPassword,
		FirstName:          req.FirstName,
		LastName:           req.LastName,
		Username:           req.Username,
		IsVerified:         false,
		VerificationCode:   code,
		VerificationExpiry: time.Now().Add(15 * time.Minute),
		Provider:           "email",
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return fmt.Errorf("failed to create user: %v", err)
	}

	if err := s.emailService.SendVerificationEmail(user.Email, code); err != nil {
		s.log.Errorf("Failed to send verification email: %v", err)
	}

	s.log.Infof("User registered successfully: %s", user.Email)
	return nil
}

func (s *AuthService) Login(ctx context.Context, req *models.LoginRequest) (*models.AuthResponse, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		s.log.Warnf("Login attempt for non-existent email: %s", req.Email)
		return nil, fmt.Errorf("invalid email or password")
	}
	
	switch user.Provider {
	case "google":
		if user.Password == "" {
			return nil, fmt.Errorf("this account is registered with Google. Please use Google Sign-In")
		}
	case "linked":
		if user.Password == "" {
			return nil, fmt.Errorf("this account uses Google authentication. Please use Google Sign-In or set a password")
		}
	case "email":
	default:
		s.log.Warnf("Unknown provider type for user %s: %s", user.Email, user.Provider)
	}

	if user.Password != "" {
		if err := s.passwordService.CheckPassword(user.Password, req.Password); err != nil {
			s.log.Warnf("Invalid password attempt for user: %s", user.Email)
			return nil, fmt.Errorf("invalid email or password")
		}
	}

	if !user.IsVerified {
		s.log.Warnf("Login attempt for unverified user: %s", user.Email)
		return nil, fmt.Errorf("please verify your email before logging in")
	}

	token, err := s.jwtService.GenerateToken(user.ID, user.Email)
	if err != nil {
		s.log.Errorf("Failed to generate JWT token for user %s: %v", user.Email, err)
		return nil, fmt.Errorf("authentication failed")
	}

	s.log.Infof("User logged in successfully via email/password: %s (provider: %s)", user.Email, user.Provider)

	return &models.AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

func (s *AuthService) Verify(ctx context.Context, req *models.VerifyRequest) error {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return fmt.Errorf("user not found")
	}

	if user.IsVerified {
		return fmt.Errorf("user already verified")
	}

	if user.VerificationCode != req.Code {
		return fmt.Errorf("invalid verification code")
	}

	if time.Now().After(user.VerificationExpiry) {
		return fmt.Errorf("verification code expired")
	}

	if err := s.userRepo.VerifyUser(ctx, user.Email); err != nil {
		return fmt.Errorf("failed to verify user: %v", err)
	}

	if err := s.emailService.SendWelcomeEmail(user.Email, user.FirstName); err != nil {
		s.log.Errorf("Failed to send welcome email: %v", err)
	}

	s.log.Infof("User verified successfully: %s", user.Email)
	return nil
}

func (s *AuthService) ResendVerificationCode(ctx context.Context, req *models.ResendCodeRequest) error {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return fmt.Errorf("user not found")
	}

	if user.IsVerified {
		return fmt.Errorf("user already verified")
	}

	code, err := s.GenerateVerificationCode()
	if err != nil {
		return fmt.Errorf("failed to generate verification code: %v", err)
	}

	expiry := time.Now().Add(15 * time.Minute)
	if err := s.userRepo.UpdateVerificationCode(ctx, user.Email, code, expiry); err != nil {
		return fmt.Errorf("failed to update verification code: %v", err)
	}

	if err := s.emailService.SendVerificationEmail(user.Email, code); err != nil {
		return fmt.Errorf("failed to send verification email: %v", err)
	}

	s.log.Infof("Verification code resent: %s", user.Email)
	return nil
}

func (s *AuthService) ForgotPassword(ctx context.Context, req *models.ForgotPasswordRequest) error {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		s.log.Warnf("Password reset requested for non-existent email: %s", req.Email)
		return nil
	}

	if user.Provider == "google" && user.Password == "" {
		return fmt.Errorf("this account is registered with Google and doesn't have a password")
	}

	code, err := s.GenerateVerificationCode()
	if err != nil {
		return fmt.Errorf("failed to generate reset code: %v", err)
	}

	expiry := time.Now().Add(15 * time.Minute)
	if err := s.userRepo.UpdateResetCode(ctx, user.Email, code, expiry); err != nil {
		return fmt.Errorf("failed to update reset code: %v", err)
	}

	if err := s.emailService.SendPasswordResetEmail(user.Email, code); err != nil {
		return fmt.Errorf("failed to send reset email: %v", err)
	}

	s.log.Infof("Password reset initiated: %s", user.Email)
	return nil
}

func (s *AuthService) ResetPassword(ctx context.Context, req *models.ResetPasswordRequest) error {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return fmt.Errorf("user not found")
	}

	if user.ResetCode != req.Code {
		return fmt.Errorf("invalid reset code")
	}

	if time.Now().After(user.ResetExpiry) {
		return fmt.Errorf("reset code expired")
	}

	hashedPassword, err := s.passwordService.HashPassword(req.NewPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password: %v", err)
	}

	if err := s.userRepo.UpdatePassword(ctx, user.Email, hashedPassword); err != nil {
		return fmt.Errorf("failed to update password: %v", err)
	}

	s.log.Infof("Password reset successfully: %s", user.Email)
	return nil
}

func (s *AuthService) GoogleAuth(ctx context.Context, req *models.GoogleAuthRequest) (*models.AuthResponse, error) {
	var payload *idtoken.Payload
	var err error

	payload, err = s.validateFirebaseToken(ctx, req.IDToken)
	if err != nil {
		s.log.Warnf("Firebase token validation failed, attempting standard Google validation: %v", err)
		payload, err = idtoken.Validate(ctx, req.IDToken, "")
		if err != nil {
			s.log.Errorf("Both Firebase and standard token validation failed: %v", err)
			return nil, fmt.Errorf("invalid Google ID token")
		}
		s.log.Infof("Successfully validated standard Google token")
	} else {
		s.log.Infof("Successfully validated Firebase token")
	}

	email, emailOk := payload.Claims["email"].(string)
	googleID, googleIDOk := payload.Claims["sub"].(string)
	emailVerified, _ := payload.Claims["email_verified"].(bool)

	if !emailOk || !googleIDOk || email == "" || googleID == "" {
		s.log.Error("Missing required fields in Google token")
		return nil, fmt.Errorf("invalid token: missing required user information")
	}

	if !emailVerified {
		s.log.Warnf("Google email not verified for user: %s", email)
		return nil, fmt.Errorf("google account email is not verified")
	}

	firstName, _ := payload.Claims["given_name"].(string)
	lastName, _ := payload.Claims["family_name"].(string)
	picture, _ := payload.Claims["picture"].(string)

	user, err := s.userRepo.GetByGoogleID(ctx, googleID)
	if err == nil {
		s.log.Infof("Existing Google user logged in: %s", user.Email)
		return s.generateAuthResponse(ctx, user)
	}

	existingUser, err := s.userRepo.GetByEmail(ctx, email)
	if err == nil {
		return s.linkGoogleToExistingAccount(ctx, existingUser, googleID, firstName, lastName, picture)
	}

	return s.createNewGoogleUser(ctx, email, googleID, firstName, lastName, picture)
}

func (s *AuthService) linkGoogleToExistingAccount(ctx context.Context, existingUser *models.User, googleID, firstName, lastName, picture string) (*models.AuthResponse, error) {
	if existingUser.GoogleID != "" && existingUser.GoogleID != googleID {
		s.log.Warnf("Account linking conflict: email %s already linked to different Google account", existingUser.Email)
		return nil, fmt.Errorf("this email is already linked to a different Google account")
	}

	updates := map[string]interface{}{
		"google_id":   googleID,
		"is_verified": true, 
		"updated_at":  time.Now(),
	}

	if existingUser.FirstName == "" && firstName != "" {
		updates["first_name"] = firstName
	}
	if existingUser.LastName == "" && lastName != "" {
		updates["last_name"] = lastName
	}
	if existingUser.Avatar == "" && picture != "" {
		updates["avatar"] = picture
	}

	if existingUser.Provider == "email" {
		updates["provider"] = "linked"
	}

	if err := s.userRepo.LinkGoogleAccount(ctx, existingUser.Email, googleID); err != nil {
		s.log.Errorf("Failed to link Google account for %s: %v", existingUser.Email, err)
		return nil, fmt.Errorf("failed to link Google account")
	}

	if len(updates) > 3 { 
		if err := s.userRepo.UpdateGoogleLinkInfo(ctx, existingUser.Email, updates); err != nil {
			s.log.Errorf("Failed to update user info during Google linking for %s: %v", existingUser.Email, err)
		}
	}

	updatedUser, err := s.userRepo.GetByEmail(ctx, existingUser.Email)
	if err != nil {
		s.log.Errorf("Failed to fetch updated user after Google linking: %v", err)
		updatedUser = existingUser
		updatedUser.GoogleID = googleID
		updatedUser.IsVerified = true
	}

	s.log.Infof("Successfully linked Google account to existing email account: %s", existingUser.Email)

	if err := s.emailService.SendAccountLinkingNotification(existingUser.Email, existingUser.FirstName); err != nil {
		s.log.Errorf("Failed to send account linking notification: %v", err)
	}

	return s.generateAuthResponse(ctx, updatedUser)
}

func (s *AuthService) createNewGoogleUser(ctx context.Context, email, googleID, firstName, lastName, picture string) (*models.AuthResponse, error) {
	username := s.generateUsernameFromEmail(email)

	uniqueUsername, err := s.ensureUniqueUsername(ctx, username)
	if err != nil {
		s.log.Errorf("Failed to generate unique username for %s: %v", email, err)
		return nil, fmt.Errorf("failed to create user account")
	}

	newUser := &models.User{
		Email:      email,
		FirstName:  firstName,
		LastName:   lastName,
		Username:   uniqueUsername,
		Avatar:     picture,
		GoogleID:   googleID,
		IsVerified: true,
		Provider:   "google",
		CreatedAt:  time.Now(),
		UpdatedAt:  time.Now(),
	}

	if err := s.userRepo.Create(ctx, newUser); err != nil {
		s.log.Errorf("Failed to create new Google user %s: %v", email, err)
		return nil, fmt.Errorf("failed to create user account")
	}

	s.log.Infof("New user created via Google authentication: %s", email)

	if err := s.emailService.SendWelcomeEmail(newUser.Email, newUser.FirstName); err != nil {
		s.log.Errorf("Failed to send welcome email to new Google user: %v", err)
	}

	return s.generateAuthResponse(ctx, newUser)
}

func (s *AuthService) generateAuthResponse(ctx context.Context, user *models.User) (*models.AuthResponse, error) {
	token, err := s.jwtService.GenerateToken(user.ID, user.Email)
	if err != nil {
		s.log.Errorf("Failed to generate JWT token for user %s: %v", user.Email, err)
		return nil, fmt.Errorf("authentication failed")
	}

	return &models.AuthResponse{
		Token: token,
		User:  user,
	}, nil
}

func (s *AuthService) generateUsernameFromEmail(email string) string {
	if atIndex := len(email); atIndex > 0 {
		for i, c := range email {
			if c == '@' {
				return email[:i]
			}
		}
	}
	return email
}

func (s *AuthService) ensureUniqueUsername(ctx context.Context, baseUsername string) (string, error) {
	username := baseUsername
	counter := 1

	for {
		_, err := s.userRepo.GetByUsername(ctx, username)
		if err != nil {
			return username, nil
		}

		username = fmt.Sprintf("%s%d", baseUsername, counter)
		counter++

		if counter > 1000 {
			return "", fmt.Errorf("unable to generate unique username")
		}
	}
}

func (s *AuthService) validateFirebaseToken(ctx context.Context, tokenString string) (*idtoken.Payload, error) {
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return nil, fmt.Errorf("invalid token format: expected 3 parts, got %d", len(parts))
	}

	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, fmt.Errorf("failed to decode token payload: %v", err)
	}

	var claims map[string]interface{}
	if err := json.Unmarshal(payloadBytes, &claims); err != nil {
		return nil, fmt.Errorf("failed to parse token claims: %v", err)
	}

	if err := s.validateFirebaseClaims(claims); err != nil {
		return nil, fmt.Errorf("token validation failed: %v", err)
	}

	payload := &idtoken.Payload{
		Claims: claims,
	}

	if aud, ok := claims["aud"].(string); ok {
		payload.Audience = aud
	}
	if sub, ok := claims["sub"].(string); ok {
		payload.Subject = sub
	}
	if iss, ok := claims["iss"].(string); ok {
		payload.Issuer = iss
	}

	s.log.Infof("Successfully validated Firebase token for user: %v", claims["email"])
	return payload, nil
}

func (s *AuthService) validateFirebaseClaims(claims map[string]interface{}) error {
	iss, ok := claims["iss"].(string)
	if !ok {
		return fmt.Errorf("missing issuer in token")
	}

	if !strings.HasPrefix(iss, "https://securetoken.google.com/") {
		return fmt.Errorf("invalid issuer: expected Firebase token, got %s", iss)
	}
	aud, ok := claims["aud"].(string)
	if !ok {
		return fmt.Errorf("missing audience in token")
	}

	projectID := strings.TrimPrefix(iss, "https://securetoken.google.com/")
	if aud != projectID {
		return fmt.Errorf("invalid audience: expected %s, got %s", projectID, aud)
	}

	exp, ok := claims["exp"].(float64)
	if !ok {
		return fmt.Errorf("missing expiration in token")
	}
	if time.Now().Unix() > int64(exp) {
		return fmt.Errorf("token has expired")
	}

	iat, ok := claims["iat"].(float64)
	if !ok {
		return fmt.Errorf("missing issued at time in token")
	}
	if time.Now().Unix() < int64(iat)-300 { 
		return fmt.Errorf("token issued in the future")
	}

	authTime, ok := claims["auth_time"].(float64)
	if !ok {
		return fmt.Errorf("missing auth time in token")
	}
	if int64(authTime) > time.Now().Unix() {
		return fmt.Errorf("auth time is in the future")
	}

	sub, ok := claims["sub"].(string)
	if !ok || sub == "" {
		return fmt.Errorf("missing or empty subject in token")
	}
	if len(sub) > 128 {
		return fmt.Errorf("subject too long")
	}

	if email, ok := claims["email"].(string); ok {
		if email == "" {
			return fmt.Errorf("empty email in token")
		}
		if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
			return fmt.Errorf("invalid email format in token")
		}
	}

	return nil
}

func (s *AuthService) CheckUser(ctx context.Context, req *models.CheckUserRequest) (*models.CheckUserResponse, error) {
	user, err := s.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return &models.CheckUserResponse{
			Exists: false,
		}, nil
	}

	return &models.CheckUserResponse{
		Exists:      true,
		Provider:    user.Provider,
		HasPassword: user.Password != "",
		IsVerified:  user.IsVerified,
	}, nil
}
