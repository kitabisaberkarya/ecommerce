# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM golang:1.25-alpine AS builder

RUN apk add --no-cache git tzdata ca-certificates

WORKDIR /app

# Download dependencies first (layer cache)
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-w -s -X main.Version=$(git describe --tags --always 2>/dev/null || echo 'dev')" \
    -o /app/bin/server ./cmd/server

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM scratch

# Import timezone data and TLS certs from builder
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

COPY --from=builder /app/bin/server /server

EXPOSE 8080

ENTRYPOINT ["/server"]
