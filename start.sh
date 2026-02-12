#!/bin/bash

# Startup script for the chat application

echo "====================================="
echo "   Chat Application Startup Script   "
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo ""

# Function to check if dependencies are installed
check_dependencies() {
    local dir=$1
    if [ ! -d "$dir/node_modules" ]; then
        echo "📦 Installing dependencies in $dir..."
        cd "$dir" && npm install
        cd - > /dev/null
    else
        echo "✓ Dependencies already installed in $dir"
    fi
}

# Check and install server dependencies
echo "Checking server dependencies..."
check_dependencies "server"
echo ""

# Check and install client dependencies
echo "Checking client dependencies..."
check_dependencies "client"
echo ""

echo "====================================="
echo "Starting servers..."
echo "====================================="
echo ""

# Start the backend server
echo "🚀 Starting backend server on port 3001..."
cd server
npm start > ../server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait a bit for server to start
sleep 3

# Check if server is running
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✓ Backend server started successfully (PID: $SERVER_PID)"
else
    echo "❌ Backend server failed to start. Check server.log for details."
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🚀 Starting frontend development server..."
cd client
npm start > ../client.log 2>&1 &
CLIENT_PID=$!
cd ..

echo "✓ Frontend server starting (PID: $CLIENT_PID)"
echo ""

echo "====================================="
echo "   Application Started Successfully   "
echo "====================================="
echo ""
echo "Backend Server:  http://localhost:3001"
echo "Frontend Client: http://localhost:3000"
echo ""
echo "Server PID: $SERVER_PID"
echo "Client PID: $CLIENT_PID"
echo ""
echo "To stop the servers, run:"
echo "  kill $SERVER_PID $CLIENT_PID"
echo ""
echo "Logs are available in:"
echo "  - server.log"
echo "  - client.log"
echo ""
echo "Press Ctrl+C to view logs in real-time"
echo "====================================="

# Follow logs
tail -f server.log client.log
