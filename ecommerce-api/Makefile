
.PHONY: run dev test build migrate swagger lint fmt vet docker-build docker-up docker-down help

APP_NAME    := ecommerce-api
APP_CMD     := ./cmd/server
BIN_DIR     := ./bin
VERSION     := $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
LDFLAGS     := -ldflags "-w -s -X main.Version=$(VERSION)"
COMPOSE_FILE := deployments/docker/docker-compose.yml

# ─────────────────────────────────────────────────────────────────────────────

## help: show available commands
help:
	@echo "Usage: make <target>"
	@grep -h '##' $(MAKEFILE_LIST) | grep -v grep | sed 's/## //'

## run: run the API server directly (requires .env)
run:
	@go run $(APP_CMD)/main.go

## dev: run with live reload (requires air: go install github.com/air-verse/air@latest)
dev:
	@air -c .air.toml 2>/dev/null || go run $(APP_CMD)/main.go

## build: compile a production binary
build:
	@mkdir -p $(BIN_DIR)
	@go build $(LDFLAGS) -o $(BIN_DIR)/$(APP_NAME) $(APP_CMD)/main.go
	@echo "✅ Binary built: $(BIN_DIR)/$(APP_NAME)"

## test: run all tests with race detector
test:
	@go test -race -coverprofile=coverage.out ./...

## test-coverage: show HTML coverage report
test-coverage: test
	@go tool cover -html=coverage.out

## migrate: apply SQL migrations (requires psql)
migrate:
	@psql "$(shell grep DB_HOST .env | cut -d= -f2)" -U \
		"$(shell grep DB_USER .env | cut -d= -f2)" \
		-d "$(shell grep DB_NAME .env | cut -d= -f2)" \
		-f db/migrations/000001_init_schema.sql

## swagger: generate OpenAPI docs (requires swag: go install github.com/swaggo/swag/cmd/swag@latest)
swagger:
	@swag init -g cmd/server/main.go --output ./docs/swagger --parseDependency

## lint: run golangci-lint
lint:
	@golangci-lint run ./...

## vet: run go vet
vet:
	@go vet ./...

## fmt: format all Go files
fmt:
	@go fmt ./...
	@gofmt -w -s .

## tidy: clean up go.mod / go.sum
tidy:
	@go mod tidy

## docker-build: build the Docker image
docker-build:
	@docker build -f deployments/docker/Dockerfile -t $(APP_NAME):$(VERSION) -t $(APP_NAME):latest .
	@echo "✅ Docker image built: $(APP_NAME):$(VERSION)"

## docker-up: start all services with docker-compose
docker-up:
	@docker-compose -f $(COMPOSE_FILE) up -d
	@echo "✅ Services started. API: http://localhost:8080"

## docker-up-dev: start all services + pgAdmin
docker-up-dev:
	@docker-compose -f $(COMPOSE_FILE) --profile dev up -d

## docker-down: stop all services
docker-down:
	@docker-compose -f $(COMPOSE_FILE) down

## docker-logs: stream API server logs
docker-logs:
	@docker-compose -f $(COMPOSE_FILE) logs -f api
