#!/bin/bash

# Quick deployment test for Civic India backend

echo "🇮🇳 Testing Civic India Backend Deployment"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "firebase.json" ]; then
    echo "❌ firebase.json not found. Run this from the project root."
    exit 1
fi

# Test Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not installed. Installing..."
    npm install -g firebase-tools
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

echo "📦 Installing Cloud Functions dependencies..."
cd functions
npm install --silent
cd ..

# Check environment
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  GEMINI_API_KEY not set in environment"
    echo "   Set it with: export GEMINI_API_KEY='your_key'"
    echo "   Or configure Firebase: firebase functions:config:set gemini.api_key='your_key'"
fi

# Test local emulator
echo "🧪 Testing local Firebase emulator..."
timeout 10s firebase emulators:start --only functions &
EMULATOR_PID=$!

sleep 5

# Test health endpoint
echo "🔍 Testing health endpoint..."
curl -s http://localhost:5001/netaverse-gdoc/us-central1/healthCheck || echo "❌ Health check failed"

# Kill emulator
kill $EMULATOR_PID 2>/dev/null

echo "✅ Basic setup complete!"
echo ""
echo "🚀 To deploy:"
echo "   1. Set Gemini API key: firebase functions:config:set gemini.api_key='your_key'"
echo "   2. Deploy: firebase deploy"
echo ""
echo "🔧 Available endpoints:"
echo "   - /civicAI (Q&A, law, representative info)"
echo "   - /factCheck (claim verification)"
echo "   - /grievanceDraft (complaint letters)"