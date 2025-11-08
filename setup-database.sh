#!/bin/bash

echo "🐘 Setting up PostgreSQL Database for E-Commerce..."
echo "=================================================="

# Check if PostgreSQL is running
if ! pgrep -x "postgres" > /dev/null; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL service first:"
    echo "   sudo systemctl start postgresql"
    echo "   sudo systemctl enable postgresql"
    exit 1
fi

# Create database
echo "📊 Creating ecommerce database..."
sudo -u postgres psql -c "DROP DATABASE IF EXISTS ecommerce;"
sudo -u postgres psql -c "CREATE DATABASE ecommerce;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ecommerce TO postgres;"

echo "✅ Database setup completed!"
echo ""
echo "📋 Database Details:"
echo "   Database: ecommerce"
echo "   Host: localhost"
echo "   Port: 5432"
echo "   Username: postgres"
echo "   Password: root"
echo ""
echo "🚀 You can now start the Spring Boot application!"