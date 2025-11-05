#!/bin/bash

DOCKER_BIN="/usr/local/bin/docker"

echo "🔄 Resetting Docker environment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Stop and remove all containers
echo "🛑 Stopping and removing containers..."
$DOCKER_BIN compose down -v 2>/dev/null || true

# Remove dangling images
echo "🧹 Cleaning up old images..."
$DOCKER_BIN system prune -f 2>/dev/null || true

echo ""
echo "✅ Docker environment reset complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Now run: ./docker-start.sh"
