#!/bin/bash

echo "🧪 Testing Product Creation API..."
echo "=================================="

# Create a simple test image file
echo "Creating test image..."
echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==" | base64 -d > test-image.png

# Test product creation
echo "Testing product creation..."
curl -X POST http://localhost:8081/api/products \
  -F "title=Test Product" \
  -F "price=99.99" \
  -F "description=Test Description" \
  -F "category=electronics" \
  -F "ratingRate=4.5" \
  -F "ratingCount=10" \
  -F "image=@test-image.png" \
  -v

echo ""
echo "✅ Test completed!"

# Clean up
rm -f test-image.png