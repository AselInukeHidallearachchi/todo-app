#!/bin/bash
set -e

echo "====================================="
echo "Starting Todo App API Container"
echo "====================================="

# Install composer dependencies - always install
echo "Installing Composer dependencies..."
COMPOSER_MEMORY_LIMIT=-1 composer install --no-interaction --no-progress --prefer-dist

# Wait for database to be ready
echo "Waiting for database connection..."
MAX_TRIES=30
COUNT=0

until MYSQL_PWD="${DB_PASSWORD}" mysql -h "${DB_HOST}" -P "${DB_PORT}" -u "${DB_USERNAME}" -e "SELECT 1" >/dev/null 2>&1; do
    COUNT=$((COUNT + 1))
    if [ ${COUNT} -ge ${MAX_TRIES} ]; then
        echo "❌ Database connection failed after ${MAX_TRIES} attempts"
        exit 1
    fi
    echo "⏳ Waiting for database... (${COUNT}/${MAX_TRIES})"
    sleep 2
done

echo "✅ Database connection successful!"

# Run migrations
echo "Running database migrations..."
php artisan migrate --force || echo "⚠️  Migration warning (may already be up to date)"

# Clear and optimize Laravel
echo "Optimizing Laravel..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo "====================================="
echo "🚀 Starting Apache Server"
echo "====================================="

# Start Apache in foreground
exec apache2-foreground