# Schema Builder Backend Makefile

.PHONY: help build run dev test clean docker-build docker-run docker-compose-up docker-compose-down install deps lint format security-check

# Default target
help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
install: ## Install dependencies
	go mod download
	go mod verify

deps: ## Update dependencies
	go mod tidy
	go mod download

dev: ## Run in development mode with hot reload
	go run cmd/main.go

run: ## Run the application
	go run cmd/main.go

build: ## Build the application
	go build -o bin/main cmd/main.go

build-linux: ## Build for Linux
	GOOS=linux GOARCH=amd64 go build -o bin/main-linux cmd/main.go

# Testing
test: ## Run tests
	go test -v ./...

test-coverage: ## Run tests with coverage
	go test -v -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

test-race: ## Run tests with race detection
	go test -v -race ./...

benchmark: ## Run benchmarks
	go test -v -bench=. ./...

# Code quality
lint: ## Run linter
	golangci-lint run

format: ## Format code
	go fmt ./...
	goimports -w .

vet: ## Run go vet
	go vet ./...

security-check: ## Run security checks
	gosec ./...

# Docker commands
docker-build: ## Build Docker image
	docker build -t schema-builder-backend .

docker-run: ## Run Docker container
	docker run -p 8080:8080 --env-file .env schema-builder-backend

docker-push: ## Push Docker image to registry
	docker tag schema-builder-backend your-registry/schema-builder-backend:latest
	docker push your-registry/schema-builder-backend:latest

# Docker Compose
docker-compose-up: ## Start all services with docker-compose
	docker-compose up -d

docker-compose-down: ## Stop all services
	docker-compose down

docker-compose-logs: ## View logs from all services
	docker-compose logs -f

docker-compose-rebuild: ## Rebuild and restart services
	docker-compose down
	docker-compose build
	docker-compose up -d

# Database commands
db-setup: ## Set up database (requires MongoDB running)
	@echo "Setting up database..."
	mongosh $(MONGODB_URI)/$(MONGODB_DATABASE) deployments/mongo-init.js

db-clean: ## Clean database collections and indexes
	@echo "Cleaning database..."
	go run scripts/clean-db.go

db-backup: ## Backup database
	mongodump --uri="$(MONGODB_URI)" --db=$(MONGODB_DATABASE) --out=backup/

db-restore: ## Restore database from backup
	mongorestore --uri="$(MONGODB_URI)" --db=$(MONGODB_DATABASE) backup/$(MONGODB_DATABASE)/

# Cleanup
clean: ## Clean build artifacts
	rm -rf bin/
	rm -rf coverage.out
	rm -rf coverage.html
	go clean

clean-docker: ## Clean Docker images and containers
	docker system prune -a

# Environment setup
setup-env: ## Copy environment template
	cp .env.example .env
	@echo "Environment file created. Please edit .env with your configuration."

# Production deployment
deploy-staging: ## Deploy to staging environment
	@echo "Deploying to staging..."
	docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d

deploy-prod: ## Deploy to production environment
	@echo "Deploying to production..."
	docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d

# Monitoring
logs: ## View application logs
	tail -f logs/app.log

monitor: ## Monitor application health
	watch -n 5 'curl -s http://localhost:8080/health | jq'

# Git hooks
install-hooks: ## Install git hooks
	@echo "Installing git hooks..."
	cp scripts/pre-commit .git/hooks/
	chmod +x .git/hooks/pre-commit

# Release
release-patch: ## Create a patch release
	./scripts/release.sh patch

release-minor: ## Create a minor release
	./scripts/release.sh minor

release-major: ## Create a major release
	./scripts/release.sh major

# Performance testing
load-test: ## Run load tests (requires wrk)
	wrk -t12 -c400 -d30s http://localhost:8080/health

# Documentation
docs-serve: ## Serve documentation locally
	@echo "Documentation available at: http://localhost:8080"
	@echo "API documentation: http://localhost:8080/docs"

# Default environment variables
MONGODB_URI ?= mongodb://localhost:27017
MONGODB_DATABASE ?= schema_builder