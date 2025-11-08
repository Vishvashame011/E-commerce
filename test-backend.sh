#!/bin/bash

echo "🧪 Testing E-Commerce Backend APIs..."
echo "======================================"

# Test Products API
echo "1. Testing Products API:"
curl -s http://localhost:8081/api/products | jq length
echo ""

# Test Promo Code Validation
echo "2. Testing Promo Code Validation:"
curl -s http://localhost:8081/api/promo-codes/validate/SAVE10 | jq .
echo ""

# Test Invalid Promo Code
echo "3. Testing Invalid Promo Code:"
curl -s http://localhost:8081/api/promo-codes/validate/INVALID | jq .
echo ""

# Test Orders API (should be empty initially)
echo "4. Testing Orders API:"
curl -s http://localhost:8081/api/orders | jq length
echo ""

echo "✅ Backend API tests completed!"
echo "Now test the frontend with backend integration."