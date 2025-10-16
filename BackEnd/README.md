# Schema Builder Backend

A professional Go backend service for a database schema design application, built with Gin framework, MongoDB, and AWS Cognito authentication.

## 🚀 Features

- **Clean Architecture**: Modular, maintainable, and scalable code structure
- **AWS Cognito Integration**: Complete authentication flow with email verification
- **MongoDB**: Robust data persistence with optimized indexing
- **Security First**: Rate limiting, CORS, security headers, input validation
- **Docker Support**: Ready for containerized deployment
- **Comprehensive Logging**: Structured logging with different levels
- **Graceful Shutdown**: Proper resource cleanup and shutdown handling

## 📋 Prerequisites

- Go 1.21 or higher
- MongoDB 5.0 or higher
- AWS Account with Cognito User Pool configured
- Docker and Docker Compose (for containerized deployment)

## 🏗️ Project Structure

```
BackEnd/
├── cmd/
│   └── main.go                 # Application entry point
├── internal/
│   ├── config/
│   │   └── config.go          # Configuration management
│   ├── handlers/
│   │   └── auth.go            # HTTP handlers
│   ├── middleware/
│   │   ├── auth.go            # Authentication middleware
│   │   └── security.go        # Security middleware
│   ├── models/
│   │   └── models.go          # Data models and DTOs
│   ├── repository/
│   │   └── repository.go      # Data access layer
│   ├── services/
│   │   ├── cognito.go         # AWS Cognito service
│   │   └── user.go            # User business logic
│   └── utils/
│       └── validation.go      # Input validation utilities
├── pkg/
│   ├── database/
│   │   └── mongodb.go         # Database connection
│   └── logger/
│       └── logger.go          # Logging configuration
├── deployments/
│   ├── mongo-init.js          # MongoDB initialization
│   └── nginx.conf             # Nginx configuration
├── Dockerfile                 # Docker image definition
├── docker-compose.yml         # Multi-container setup
├── go.mod                     # Go module definition
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🔧 Installation & Setup

### 1. Clone and Setup

```bash
git clone <repository-url>
cd BackEnd
```

### 2. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=8080
ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=schema_builder

# AWS Cognito Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
COGNITO_USER_POOL_ID=your_user_pool_id
COGNITO_CLIENT_ID=your_client_id
COGNITO_CLIENT_SECRET=your_client_secret

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Security Configuration
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW=60
BCRYPT_COST=12
```

### 3. Install Dependencies

```bash
go mod download
```

### 4. Run the Application

#### Development Mode
```bash
go run cmd/main.go
```

#### Production Build
```bash
go build -o bin/main cmd/main.go
./bin/main
```

### 5. Docker Deployment

#### Using Docker Compose (Recommended)
```bash
# Start all services (MongoDB, Redis, Backend, Nginx)
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

#### Manual Docker Build
```bash
# Build the image
docker build -t schema-builder-backend .

# Run the container
docker run -p 8080:8080 --env-file .env schema-builder-backend
```

## 🔌 API Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/signup
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email for verification code.",
  "data": {
    "user": {
      "id": "user_id",
      "cognito_sub": "cognito_subject_id",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "is_verified": false
    }
  }
}
```

#### POST /api/v1/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "is_verified": true
    }
  }
}
```

#### POST /api/v1/auth/verify-email
Verify user email with confirmation code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "verification_code": "123456"
}
```

#### POST /api/v1/auth/resend-verification
Resend email verification code.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /api/v1/auth/forgot-password
Initiate password reset flow.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST /api/v1/auth/reset-password
Reset password with verification code.

**Request Body:**
```json
{
  "email": "user@example.com",
  "verification_code": "123456",
  "new_password": "NewSecurePassword123!"
}
```

#### POST /api/v1/auth/refresh-token
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "user@example.com"
}
```

### Protected Endpoints (Require Authentication)

All protected endpoints require the `Authorization` header:
```
Authorization: Bearer <access_token>
```

#### GET /api/v1/user/profile
Get current user profile.

**Response:**
```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": "user_id",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "avatar": "https://example.com/avatar.jpg",
    "is_verified": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### PUT /api/v1/user/profile
Update current user profile.

**Request Body:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "username": "janesmith",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

### Health Check

#### GET /health
Check service health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## 🔒 Security Features

### Authentication & Authorization
- **AWS Cognito Integration**: Secure user authentication and management
- **JWT Tokens**: Stateless authentication with access and refresh tokens
- **Email Verification**: Required email verification for new accounts
- **Password Policies**: Enforced through AWS Cognito configuration

### Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'self'`

### Rate Limiting
- Global rate limiting: 100 requests per minute per IP
- Auth endpoints: 5 requests per minute per IP for authentication routes
- Configurable through environment variables

### Input Validation
- Request body validation using struct tags
- Content-Type validation for POST/PUT requests
- Request size limiting (10MB default)

### CORS
- Configurable allowed origins
- Secure CORS headers for cross-origin requests

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  cognito_sub: String (unique),
  email: String (unique),
  first_name: String,
  last_name: String,
  username: String,
  avatar: String (optional),
  is_verified: Boolean,
  created_at: Date,
  updated_at: Date
}
```

### Schemas Collection (Future Implementation)
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  name: String,
  description: String (optional),
  tables: Array,
  version: Number,
  is_public: Boolean,
  created_at: Date,
  updated_at: Date
}
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `8080` | No |
| `ENV` | Environment (development/production) | `development` | No |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` | No |
| `MONGODB_DATABASE` | Database name | `schema_builder` | No |
| `AWS_REGION` | AWS region | `us-east-1` | No |
| `AWS_ACCESS_KEY_ID` | AWS access key | - | Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - | Yes |
| `COGNITO_USER_POOL_ID` | Cognito User Pool ID | - | Yes |
| `COGNITO_CLIENT_ID` | Cognito Client ID | - | Yes |
| `COGNITO_CLIENT_SECRET` | Cognito Client Secret | - | No |
| `JWT_SECRET` | JWT signing secret | Default secret (change in production) | No |
| `JWT_EXPIRES_IN` | JWT expiration time | `24h` | No |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,http://localhost:5173` | No |
| `RATE_LIMIT_MAX_REQUESTS` | Rate limit max requests | `100` | No |
| `RATE_LIMIT_WINDOW` | Rate limit window (seconds) | `60` | No |
| `BCRYPT_COST` | Bcrypt hashing cost | `12` | No |

## 🚀 Deployment

### Production Checklist

1. **Environment Variables**
   - Set secure `JWT_SECRET`
   - Configure production AWS credentials
   - Set `ENV=production`
   - Update `ALLOWED_ORIGINS` for your frontend domain

2. **Database**
   - Use MongoDB Atlas or a managed MongoDB instance
   - Enable authentication and SSL
   - Set up database backups

3. **Security**
   - Enable HTTPS with SSL certificates
   - Configure firewall rules
   - Set up monitoring and alerting

4. **Docker Deployment**
   ```bash
   # Production deployment with docker-compose
   ENV=production docker-compose -f docker-compose.yml up -d
   ```

5. **Health Monitoring**
   - Monitor `/health` endpoint
   - Set up log aggregation
   - Configure automated backups

## 🧪 Testing

### Running Tests (Future Implementation)
```bash
# Run unit tests
go test ./...

# Run tests with coverage
go test -cover ./...

# Run integration tests
go test -tags=integration ./...
```

### API Testing with curl

```bash
# Health check
curl http://localhost:8080/health

# Sign up
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "first_name": "Test",
    "last_name": "User",
    "username": "testuser"
  }'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the logs for error details

## 🔄 Future Enhancements

- [ ] Schema management endpoints
- [ ] Real-time collaboration features
- [ ] Export to various database formats
- [ ] Schema version control
- [ ] Team collaboration features
- [ ] Advanced validation rules
- [ ] Schema templates
- [ ] Integration with popular databases