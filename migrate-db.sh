#!/bin/bash

# Database Migration Script
# Migrates data from local MySQL to Dockerized MySQL

echo "========================================"
echo "Database Migration Script"
echo "========================================"
echo ""

# Configuration
LOCAL_DB_HOST="127.0.0.1"
LOCAL_DB_PORT="3306"
LOCAL_DB_NAME="todo"
LOCAL_DB_USER="root"
LOCAL_DB_PASS="root"

BACKUP_FILE="./backup-$(date +%Y%m%d-%H%M%S).sql"

echo "Step 1: Exporting data from local database..."
echo "----------------------------------------"

# Export local database
mysqldump -h "$LOCAL_DB_HOST" \
  -P "$LOCAL_DB_PORT" \
  -u "$LOCAL_DB_USER" \
  -p"$LOCAL_DB_PASS" \
  "$LOCAL_DB_NAME" > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Local database exported successfully to: $BACKUP_FILE"
    echo ""
else
    echo "❌ Failed to export local database"
    echo "Please check:"
    echo "  - Local MySQL is running"
    echo "  - Database credentials are correct"
    echo "  - Database 'todo' exists"
    exit 1
fi

echo "Step 2: Stopping Docker containers..."
echo "----------------------------------------"
/usr/local/bin/docker compose down

echo ""
echo "Step 3: Removing Docker database volume..."
echo "----------------------------------------"
/usr/local/bin/docker volume rm todo-app_db_data

echo ""
echo "Step 4: Starting Docker containers..."
echo "----------------------------------------"
/usr/local/bin/docker compose up -d db

echo ""
echo "Step 5: Waiting for database to be ready..."
echo "----------------------------------------"
sleep 10

echo ""
echo "Step 6: Importing data to Docker database..."
echo "----------------------------------------"

# Import to Docker database
/usr/local/bin/docker exec -i todo-db mysql -uroot -proot todo < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Data imported successfully to Docker database"
    echo ""
else
    echo "❌ Failed to import data to Docker database"
    exit 1
fi

echo "Step 7: Starting all Docker containers..."
echo "----------------------------------------"
/usr/local/bin/docker compose up -d

echo ""
echo "========================================"
echo "✅ Migration completed successfully!"
echo "========================================"
echo ""
echo "Backup file saved at: $BACKUP_FILE"
echo ""
echo "Verifying data..."
echo "----------------------------------------"

sleep 5

# Verify users
echo ""
echo "Users in database:"
/usr/local/bin/docker exec todo-db mysql -uroot -proot -D todo -e "SELECT id, name, email, role FROM users;"

echo ""
echo "Tasks in database:"
/usr/local/bin/docker exec todo-db mysql -uroot -proot -D todo -e "SELECT id, title, user_id, status FROM tasks;"

echo ""
echo "========================================"
echo "Next steps:"
echo "  1. Access your app at http://localhost:3000"
echo "  2. Login with your existing credentials"
echo "  3. Keep the backup file: $BACKUP_FILE"
echo "========================================"
