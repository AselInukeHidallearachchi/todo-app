#!/bin/bash

DOCKER_BIN="/Applications/Docker.app/Contents/Resources/bin/docker"

echo "🐳 Starting Todo App with Docker..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Step 1: Start database first
echo "📦 Step 1/3: Starting database..."
$DOCKER_BIN compose up -d db

echo "⏳ Waiting for database to be healthy..."
sleep 5

# Step 2: Build and start API
echo "� Step 2/3: Building and starting API..."
$DOCKER_BIN compose up -d --build api

echo "⏳ Waiting for API to be ready..."
sleep 10

# Step 3: Start web
echo "📦 Step 3/3: Starting web frontend..."
$DOCKER_BIN compose up -d --build web

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Docker containers started!"
echo ""
echo "📦 Services:"
echo "  • Database:  localhost:3307"
echo "  • Backend:   http://localhost:8000"
echo "  • Frontend:  http://localhost:3000"
echo ""
echo "� Check status:"
echo "  $DOCKER_BIN compose ps"
echo ""
echo "📝 View logs:"
echo "  $DOCKER_BIN compose logs -f api"
echo "  $DOCKER_BIN compose logs -f web"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
