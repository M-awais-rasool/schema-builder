# Schema Builder Backend API Documentation

## Base URL
```
http://localhost:8080/api/v1
```

## Authentication
The API uses Bearer token authentication for protected endpoints. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

### Success Response
```json
{
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "error_code",
  "message": "Human readable error message",
  "details": {
    // Additional error details (optional)
  }
}
```

## Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `invalid_request` | Invalid request body or parameters | 400 |
| `validation_error` | Request validation failed | 400 |
| `unauthorized` | Authentication required or invalid token | 401 |
| `forbidden` | Access denied | 403 |
| `not_found` | Resource not found | 404 |
| `rate_limit_exceeded` | Too many requests | 429 |
| `internal_server_error` | Internal server error | 500 |

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe"
}
```

**Validation Rules:**
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters
- `first_name`: Required, 2-50 characters
- `last_name`: Required, 2-50 characters
- `username`: Required, 3-30 characters

**Response (201):**
```json
{
  "message": "User registered successfully. Please check your email for verification code.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "cognito_sub": "us-east-1_ABC123456",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "is_verified": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /auth/login
Authenticate user and receive access token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "cognito_sub": "us-east-1_ABC123456",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "avatar": "",
      "is_verified": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

#### POST /auth/verify-email
Verify user email with confirmation code.

**Request:**
```json
{
  "email": "user@example.com",
  "verification_code": "123456"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully"
}
```

#### POST /auth/resend-verification
Resend email verification code.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Verification code sent successfully"
}
```

#### POST /auth/forgot-password
Initiate password reset process.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Password reset code sent to your email"
}
```

#### POST /auth/reset-password
Reset password using verification code.

**Request:**
```json
{
  "email": "user@example.com",
  "verification_code": "123456",
  "new_password": "NewSecurePassword123!"
}
```

**Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

#### POST /auth/refresh-token
Refresh access token using refresh token.

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "username": "johndoe",
      "is_verified": true
    }
  }
}
```

### User Management (Protected)

#### GET /user/profile
Get current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "message": "Profile retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "cognito_sub": "us-east-1_ABC123456",
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

#### PUT /user/profile
Update current user profile.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request:**
```json
{
  "first_name": "Jane",
  "last_name": "Smith",
  "username": "janesmith",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

**Validation Rules:**
- `first_name`: Optional, 2-50 characters if provided
- `last_name`: Optional, 2-50 characters if provided
- `username`: Optional, 3-30 characters if provided
- `avatar`: Optional, valid URL if provided

**Response (200):**
```json
{
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "cognito_sub": "us-east-1_ABC123456",
    "email": "user@example.com",
    "first_name": "Jane",
    "last_name": "Smith",
    "username": "janesmith",
    "avatar": "https://example.com/new-avatar.jpg",
    "is_verified": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T12:30:00Z"
  }
}
```

### Health Check

#### GET /health
Check service health status.

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

## Rate Limiting

The API implements rate limiting to protect against abuse:

- **General endpoints**: 100 requests per minute per IP
- **Authentication endpoints**: 5 requests per minute per IP

When rate limit is exceeded, the API returns:

**Response (429):**
```json
{
  "error": "rate_limit_exceeded",
  "message": "Rate limit exceeded. Please try again later."
}
```

## CORS

The API supports Cross-Origin Resource Sharing (CORS) with the following configuration:

- **Allowed Origins**: Configurable via `ALLOWED_ORIGINS` environment variable
- **Allowed Methods**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`
- **Allowed Headers**: `Origin`, `Content-Length`, `Content-Type`, `Authorization`, `X-Request-ID`
- **Credentials**: Supported

## Request/Response Examples

### Using curl

#### Sign Up
```bash
curl -X POST http://localhost:8080/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!",
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePassword123!"
  }'
```

#### Get Profile
```bash
curl -X GET http://localhost:8080/api/v1/user/profile \
  -H "Authorization: Bearer <access_token>"
```

#### Update Profile
```bash
curl -X PUT http://localhost:8080/api/v1/user/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith"
  }'
```

### Using JavaScript (fetch)

#### Login
```javascript
const response = await fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'SecurePassword123!'
  })
});

const data = await response.json();
const accessToken = data.data.access_token;
```

#### Get Profile
```javascript
const response = await fetch('http://localhost:8080/api/v1/user/profile', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});

const profile = await response.json();
```

## Security Considerations

1. **Always use HTTPS in production**
2. **Store access tokens securely** (not in localStorage for sensitive applications)
3. **Implement proper token refresh logic** to handle expired tokens
4. **Validate all user inputs** on the client side as well
5. **Monitor rate limiting** and implement exponential backoff for retries
6. **Keep dependencies updated** to avoid security vulnerabilities

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Support

For API support:
1. Check the error message and status code
2. Verify your request format matches the documentation
3. Ensure proper authentication headers are included
4. Check rate limiting if receiving 429 errors
5. Review server logs for 500 errors