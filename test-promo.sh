#!/bin/bash

echo "Testing promo code functionality..."

# Test SAVE10 promo code
echo "Testing SAVE10 promo code:"
curl -X GET "http://localhost:8081/api/promo-codes/validate/SAVE10" \
  -H "Content-Type: application/json" | jq

echo ""

# Test SAVE20 promo code  
echo "Testing SAVE20 promo code:"
curl -X GET "http://localhost:8081/api/promo-codes/validate/SAVE20" \
  -H "Content-Type: application/json" | jq

echo ""

# Test invalid promo code
echo "Testing invalid promo code:"
curl -X GET "http://localhost:8081/api/promo-codes/validate/INVALID" \
  -H "Content-Type: application/json" | jq