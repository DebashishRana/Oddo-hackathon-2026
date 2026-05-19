#!/bin/bash
# Test script for verification-ingest endpoint

# Configuration
ADMIN_URL="http://localhost:3000"
ENDPOINT="${ADMIN_URL}/api/verification-ingest"
SCANNER_TOKEN="sk_scanner_dectra_2025_prod_veriquick_secure_token_v1_a7f8e9d2c3b4a5f6e7d8c9b0a1f2e3d4"

# Test 1: Valid verification event
echo "=== Test 1: Valid Verification Event ==="
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SCANNER_TOKEN}" \
  -d '{
    "document_type": "Aadhaar",
    "user_name": "John Doe",
    "user_email": "john@example.com",
    "confidence": 0.92,
    "image_url": "https://example.blob.core.windows.net/document.jpg",
    "document_id": "DOC-12345",
    "scanner_version": "2.3.0"
  }' \
  "${ENDPOINT}"

echo -e "\n\n=== Test 2: Low Confidence (Flagged) ==="
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SCANNER_TOKEN}" \
  -d '{
    "document_type": "PAN",
    "user_name": "Jane Smith",
    "user_email": "jane@example.com",
    "confidence": 0.45,
    "image_url": "https://example.blob.core.windows.net/pan.jpg",
    "document_id": "DOC-12346"
  }' \
  "${ENDPOINT}"

echo -e "\n\n=== Test 3: Missing Required Field (Error) ==="
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${SCANNER_TOKEN}" \
  -d '{
    "document_type": "Passport",
    "user_email": "test@example.com"
  }' \
  "${ENDPOINT}"

echo -e "\n\n=== Test 4: Invalid Bearer Token ==="
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid_token" \
  -d '{
    "document_type": "Aadhaar",
    "user_name": "Test User",
    "confidence": 0.88,
    "image_url": "https://example.blob.core.windows.net/test.jpg"
  }' \
  "${ENDPOINT}"

echo -e "\n\n=== Test 5: Get Logs ==="
curl -X GET "${ADMIN_URL}/api/logs?limit=10"

echo -e "\n\nTests completed!"
