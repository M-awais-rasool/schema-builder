# SchemaBuilder 🚀

**AI-Powered Database Design & Schema Management Platform**

A revolutionary full-stack SaaS platform that transforms database schema design through intelligent visual modeling. Create complex database schemas instantly using AI-powered chat interface, drag-and-drop visual designer, and real-time collaboration features.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Go Version](https://img.shields.io/badge/Go-1.23+-blue.svg)](https://golang.org/)
[![React Version](https://img.shields.io/badge/React-19.1+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue.svg)](https://www.typescriptlang.org/)

## ✨ Features

### 🤖 AI-Powered Schema Generation
- **Natural Language Processing**: Convert plain English descriptions into database schemas
- **Google Gemini AI Integration**: Advanced AI understanding for complex database relationships
- **Smart Field Detection**: Automatically identifies primary keys, foreign keys, and data types
- **Relationship Inference**: AI suggests optimal table relationships and constraints

### 🎨 Visual Database Designer
- **Interactive Canvas**: Drag-and-drop interface powered by ReactFlow
- **Animated Table Nodes**: Beautiful animations and transitions for enhanced UX
- **Real-time Relationship Mapping**: Visual connection between tables with constraint visualization
- **Responsive Design**: Mobile-optimized interface with touch-friendly controls

### 🔄 Real-time Collaboration
- **Multi-user Editing**: Collaborate on schemas with team members in real-time
- **Version Control**: Track schema changes and maintain version history
- **Live Updates**: See changes from other users instantly
- **Schema Sharing**: Public/private schema sharing with access controls

### 🛠️ Advanced Schema Management
- **CRUD Operations**: Full create, read, update, delete operations for schemas
- **SQL Generation**: Auto-generate SQL DDL with proper constraints and indexes
- **Schema Export**: Export to various formats (SQL, JSON, etc.)
- **Schema Import**: Load existing schemas and convert to visual format

### 🔐 Enterprise Authentication
- **Firebase Google OAuth**: Secure Google sign-in integration
- **Email Verification**: Complete email verification workflow
- **JWT Authentication**: Secure token-based session management
- **Password Reset**: Secure password recovery system

## 🏗️ Architecture

### Frontend (React TypeScript)
```
schemaBuilder/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── designer/        # Visual schema designer
│   │   ├── chat/           # AI chat interface
│   │   ├── auth/           # Authentication components
│   │   └── ui/             # Base UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API service layer
│   ├── contexts/           # React context providers
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
```

### Backend (Go)
```
BackEnd/
├── cmd/                    # Application entry points
├── internal/
│   ├── handlers/          # HTTP request handlers
│   ├── services/          # Business logic layer
│   ├── repository/        # Data access layer
│   ├── models/           # Data models
│   ├── middleware/       # HTTP middleware
│   └── config/           # Configuration management
└── pkg/                   # Shared packages
    ├── database/         # Database connections
    └── logger/           # Logging utilities
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ and npm/yarn
- **Go** 1.23+
- **MongoDB** 5.0+
- **Firebase Project** for authentication
- **Google Gemini API Key** for AI features

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/M-awais-rasool/schema-builder.git
   cd schema-builder/schemaBuilder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd ../BackEnd
   ```

2. **Install Go dependencies**
   ```bash
   make install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DATABASE=schema_builder
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USERNAME=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ```

4. **Start the server**
   ```bash
   make dev
   ```

### Using Docker

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **View logs**
   ```bash
   docker-compose logs -f
   ```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/google` - Google OAuth authentication
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### Schema Management
- `GET /api/schemas` - List user schemas
- `POST /api/schemas` - Create new schema
- `GET /api/schemas/:id` - Get schema by ID
- `PUT /api/schemas/:id` - Update schema
- `DELETE /api/schemas/:id` - Delete schema

### AI Integration
- `POST /api/ai/chat` - AI chat for schema generation

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## 🛠️ Development

### Available Scripts

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

#### Backend
```bash
make dev             # Start development server with hot reload
make build           # Build the application
make lint            # Run linter
make format          # Format code
```

### Code Quality

- **ESLint** and **Prettier** for frontend code formatting
- **golangci-lint** for Go code linting
- **Pre-commit hooks** for code quality enforcement
- **Test coverage** reports for both frontend and backend

## 🚢 Deployment

### Production Build

1. **Frontend**
   ```bash
   npm run build
   ```

2. **Backend**
   ```bash
   make build-linux
   ```

### Environment Variables for Production
- Set secure JWT secrets
- Configure production MongoDB URI
- Set up proper CORS origins
- Configure email services
- Set up monitoring and logging

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices for frontend
- Follow Go coding standards for backend
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure responsive design for UI changes

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ReactFlow** for the amazing visual editor capabilities
- **Google Gemini AI** for powerful natural language processing
- **Firebase** for robust authentication services
- **MongoDB** for flexible document storage
- **Gin Framework** for fast HTTP routing in Go

**Built with ❤️ by [M. Awais Rasool](https://github.com/M-awais-rasool)**