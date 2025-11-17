#!/bin/bash

echo "Setting up Role-Based Access Control (RBAC) for E-Commerce Project..."

# Check if PostgreSQL is running
if ! pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "Error: PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Run the SQL script to add role column
echo "Adding role column to users table..."
psql -h localhost -p 5432 -U postgres -d ecommerce -f add-role-column.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema updated successfully!"
    echo ""
    echo "📋 RBAC Setup Complete!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Create admin user: psql -h localhost -p 5432 -U postgres -d ecommerce -f create-admin.sql"
    echo "2. Start the backend server: cd e-commerce-backend && ./mvnw spring-boot:run"
    echo "3. Start the frontend server: cd e-commerce-ui && npm start"
    echo "4. Login as admin to access the admin panel"
    echo ""
    echo ""
    echo "🔐 To create admin user:"
    echo "   Run: psql -h localhost -p 5432 -U postgres -d ecommerce -f create-admin.sql"
    echo "   Username: admin, Password: admin123"
    echo ""
    echo "🌐 Access URLs:"
    echo "   User Interface: http://localhost:3000"
    echo "   Admin Panel: http://localhost:3000/admin/dashboard (after login as admin)"
    echo ""
else
    echo "❌ Error updating database schema. Please check your PostgreSQL connection."
    exit 1
fi