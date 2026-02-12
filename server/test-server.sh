#!/bin/bash

# Simple test script for the chat server

echo "Testing Chat Server..."
echo "====================="

# Test health endpoint
echo ""
echo "1. Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:3001/health)
echo "Response: $HEALTH_RESPONSE"

if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo "✓ Health check passed"
else
    echo "✗ Health check failed"
    exit 1
fi

# Test channels list endpoint
echo ""
echo "2. Testing channels list endpoint..."
CHANNELS_RESPONSE=$(curl -s http://localhost:3001/api/channels)
echo "Response: $CHANNELS_RESPONSE"

if echo "$CHANNELS_RESPONSE" | grep -q "general"; then
    echo "✓ Channels list passed"
else
    echo "✗ Channels list failed"
    exit 1
fi

# Test creating a new channel
echo ""
echo "3. Testing channel creation..."
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3001/api/channels \
  -H "Content-Type: application/json" \
  -d '{"name":"test-channel"}')
echo "Response: $CREATE_RESPONSE"

if echo "$CREATE_RESPONSE" | grep -q "test-channel"; then
    echo "✓ Channel creation passed"
else
    echo "✗ Channel creation failed"
    exit 1
fi

# Verify the new channel appears in the list
echo ""
echo "4. Verifying new channel in list..."
CHANNELS_RESPONSE=$(curl -s http://localhost:3001/api/channels)
echo "Response: $CHANNELS_RESPONSE"

if echo "$CHANNELS_RESPONSE" | grep -q "test-channel"; then
    echo "✓ New channel verification passed"
else
    echo "✗ New channel verification failed"
    exit 1
fi

echo ""
echo "====================="
echo "All tests passed! ✓"
echo "The chat server is working correctly."
