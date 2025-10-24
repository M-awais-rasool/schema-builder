package services

import (
	"fmt"

	"github.com/sirupsen/logrus"
	"gopkg.in/gomail.v2"

	"schema-builder-backend/internal/config"
	"schema-builder-backend/pkg/logger"
)

type EmailService struct {
	log    *logrus.Logger
	config *config.EmailConfig
}

func NewEmailService(emailConfig *config.EmailConfig) *EmailService {
	return &EmailService{
		log:    logger.GetLogger(),
		config: emailConfig,
	}
}

func (s *EmailService) SendVerificationEmail(email, code string) error {
	subject := "Verify Your Email - Schema Builder"
	body := fmt.Sprintf(`
<html>
<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Schema Builder</h1>
            <h2 style="color: #666; font-weight: normal;">Email Verification</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Thank you for signing up! Please verify your email address by using the verification code below:
            </p>
            
            <div style="background-color: #007bff; color: white; font-size: 32px; font-weight: bold; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 8px;">
                %s
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
                This code will expire in 15 minutes for security reasons.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 10px;">
                If you didn't create an account with Schema Builder, please ignore this email.
            </p>
        </div>
    </div>
</body>
</html>
    `, code)

	return s.sendEmail(email, subject, body)
}

func (s *EmailService) SendPasswordResetEmail(email, code string) error {
	subject := "Password Reset - Schema Builder"
	body := fmt.Sprintf(`
<html>
<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Schema Builder</h1>
            <h2 style="color: #666; font-weight: normal;">Password Reset</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                You requested to reset your password. Use the code below to reset your password:
            </p>
            
            <div style="background-color: #dc3545; color: white; font-size: 32px; font-weight: bold; padding: 20px; margin: 20px 0; border-radius: 8px; letter-spacing: 8px;">
                %s
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
                This code will expire in 15 minutes for security reasons.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 10px;">
                If you didn't request a password reset, please ignore this email and your password will remain unchanged.
            </p>
        </div>
    </div>
</body>
</html>
    `, code)

	return s.sendEmail(email, subject, body)
}

func (s *EmailService) SendWelcomeEmail(email, firstName string) error {
	subject := "Welcome to Schema Builder!"
	body := fmt.Sprintf(`
<html>
<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Schema Builder</h1>
            <h2 style="color: #28a745; font-weight: normal;">Welcome!</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
                Hi %s,
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Welcome to Schema Builder! Your email has been successfully verified and your account is now active.
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                You can now start designing database schemas, collaborating with others, and exporting your work.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="%s" style="background-color: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                    Get Started
                </a>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
                If you have any questions, feel free to reach out to our support team.
            </p>
        </div>
    </div>
</body>
</html>
    `, firstName, "http://localhost:5173/dashboard")

	return s.sendEmail(email, subject, body)
}

func (s *EmailService) SendAccountLinkingNotification(email, firstName string) error {
	subject := "Google Account Linked - Schema Builder"
	body := fmt.Sprintf(`
<html>
<body>
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #333; margin-bottom: 10px;">Schema Builder</h1>
            <h2 style="color: #007bff; font-weight: normal;">Account Linked</h2>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px;">
            <p style="font-size: 18px; color: #333; margin-bottom: 20px;">
                Hi %s,
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                Your Google account has been successfully linked to your Schema Builder account.
            </p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
                You can now sign in using either your email and password or your Google account for added convenience.
            </p>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 14px; color: #1976d2; margin: 0;">
                    <strong>Security Note:</strong> If you didn't authorize this account linking, please contact our support team immediately.
                </p>
            </div>
            
            <p style="font-size: 14px; color: #666; margin-top: 20px;">
                If you have any questions about this change, feel free to reach out to our support team.
            </p>
        </div>
    </div>
</body>
</html>
    `, firstName)

	return s.sendEmail(email, subject, body)
}

func (s *EmailService) sendEmail(to, subject, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", fmt.Sprintf("%s <%s>", s.config.FromName, s.config.User))
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	d := gomail.NewDialer(s.config.Host, s.config.Port, s.config.User, s.config.Password)

	if err := d.DialAndSend(m); err != nil {
		s.log.Errorf("Failed to send email to %s: %v", to, err)
		s.logEmailToConsole(to, subject, body)
		return fmt.Errorf("failed to send email: %v", err)
	}

	s.log.Infof("Email sent successfully to %s", to)
	return nil
}

func (s *EmailService) logEmailToConsole(to, subject, body string) {
	fmt.Printf("\n===========================================\n")
	fmt.Printf("EMAIL DETAILS (Fallback - SMTP Failed)\n")
	fmt.Printf("To: %s\n", to)
	fmt.Printf("Subject: %s\n", subject)
	fmt.Printf("===========================================\n\n")
}
