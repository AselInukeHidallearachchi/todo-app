#!/bin/bash

# Docker Fix Script for Todo App
# This script helps resolve common Docker issues

echo "🐳 Docker Fix Script for Todo App"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop and try again."
    exit 1
fi

echo "✅ Docker is running"

# Function to clean Docker
clean_docker() {
    echo "🧹 Cleaning Docker cache..."
    docker system prune -f
    docker volume prune -f
    echo "✅ Docker cache cleaned"
}

# Function to build with legacy builder
build_legacy() {
    echo "🔨 Building with legacy builder..."
    export DOCKER_BUILDKIT=0
    docker compose build
    echo "✅ Build completed"
}

# Function to build normally
build_normal() {
    echo "🔨 Building normally..."
    docker compose build
    echo "✅ Build completed"
}

# Function to start services
start_services() {
    echo "🚀 Starting services..."
    docker compose up -d
    echo "✅ Services started"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend:  http://localhost:8000"
    echo "   Database: localhost:3306"
}

# Main menu
echo ""
echo "Select an option:"
echo "1. Clean Docker and build normally"
echo "2. Build with legacy builder (slower but more compatible)"
echo "3. Just start services (if already built)"
echo "4. Clean everything and start fresh"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        clean_docker
        build_normal
        start_services
        ;;
    2)
        build_legacy
        start_services
        ;;
    3)
        start_services
        ;;
    4)
        echo "🧹 Cleaning everything..."
        docker compose down -v --rmi all 2>/dev/null || true
        clean_docker
        build_normal
        start_services
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "📋 Useful commands:"
echo "  View logs: docker compose logs -f"
echo "  Stop app:  docker compose down"
echo "  Restart:   docker compose restart"