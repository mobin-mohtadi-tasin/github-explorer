#!/bin/bash
echo "🔭 Starting DevScope - GitHub Explorer"
echo ""

# Start server in background
echo "Starting backend (port 3001)..."
cd server && node index.js &
SERVER_PID=$!

sleep 1

# Start client
echo "Starting frontend (port 5173)..."
cd ../client && npm run dev

# Kill server on exit
trap "kill $SERVER_PID" EXIT
