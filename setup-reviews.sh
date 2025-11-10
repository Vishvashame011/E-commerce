#!/bin/bash

echo "Setting up Reviews functionality..."

# Create reviews table
echo "Creating reviews table..."
psql -U postgres -d ecommerce -f create-reviews-table.sql

# Rebuild backend
echo "Rebuilding backend..."
cd e-commerce-backend
./mvnw clean compile
cd ..

echo "Reviews setup complete!"
echo "Now restart your backend server to use the new review functionality."