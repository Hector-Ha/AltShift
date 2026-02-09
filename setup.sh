#!/bin/bash

# AltShift Deployment Script
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

# Check for a local .env file first, then server/.env
ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ] && [ -f "server/.env" ]; then
  ENV_FILE="server/.env"
fi

# Check for the production env file used in the guide if neither exists
if [ ! -f "$ENV_FILE" ] && [ -f "$HOME/altshift.env" ]; then
    ENV_FILE="$HOME/altshift.env"
fi

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: No environment file found (.env, server/.env, or ~/altshift.env)."
  echo "Please create one with the necessary variables."
  exit 1
fi

echo "==> Using environment file: $ENV_FILE"

source "$ENV_FILE"

# Ensure have credentials to pull the image
if [ -z "${GHCR_USERNAME:-}" ] || [ -z "${GHCR_PAT:-}" ]; then
  echo "ERROR: GHCR_USERNAME and GHCR_PAT must be set in $ENV_FILE for automated deployment."
  exit 1
fi

# Ensure we have app configuration
if [ -z "${MONGODB_URI:-}" ]; then
  echo "ERROR: MONGODB_URI must be set in $ENV_FILE"
  exit 1
fi

# Docker Login
echo "==> Logging in to GitHub Container Registry..."
echo "$GHCR_PAT" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin

# Pull Image
echo "==> Pulling latest server image..."
IMAGE_NAME="ghcr.io/hector-ha/altshift-server:latest"
docker pull "$IMAGE_NAME"

# Restart Container
echo "==> Stopping old container..."
# Prevent script failure if container doesn't exist
docker stop altshift-server || true
docker rm altshift-server || true

echo "==> Starting new container..."

docker run -d \
  --name altshift-server \
  --restart unless-stopped \
  -p 4000:4000 \
  --env-file "$ENV_FILE" \
  "$IMAGE_NAME"

# Verification
echo "==> Deploy complete. Checking health..."
sleep 5
if docker ps | grep -q "altshift-server"; then
    echo "SUCCESS: Container is running."
    docker ps | grep "altshift-server"
else
    echo "ERROR: Container failed to start. Check logs with 'docker logs altshift-server'"
    exit 1
fi
