#!/bin/bash

# Civic India - Deployment Script
# Automates Firebase deployment with proper configuration

echo "🇮🇳 Civic India - Firebase Deployment"
echo "======================================"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Check if logged in to Firebase
echo "🔐 Checking Firebase authentication..."
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "🔑 Please login to Firebase:"
    firebase login
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "📦 Installing Cloud Functions dependencies..."
cd functions
npm install
cd ..

# Set Gemini API key if provided
if [ ! -z "$GEMINI_API_KEY" ]; then
    echo "🔑 Setting Gemini API key..."
    firebase functions:config:set gemini.api_key="$GEMINI_API_KEY"
else
    echo "⚠️  GEMINI_API_KEY not set. Please set it manually:"
    echo "   firebase functions:config:set gemini.api_key=\"your_key\""
fi

# Build React app
echo "🏗️  Building React application..."
npm run build

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

echo "✅ Deployment complete!"
echo ""
echo "📊 Your Civic India app is now live!"
echo "🔗 Check your Firebase console for the hosting URL"
echo ""
echo "🛠️  Available endpoints:"
echo "   - /civicQA - General civic questions"
echo "   - /policySummarizer - Policy document summaries"
echo "   - /factCheck - News and claim verification"
echo "   - /grievanceDrafter - Formal complaint letters"
echo "   - /representativeFinder - Find your representatives"
echo "   - /schemeInfo - Government scheme information"
echo "   - /healthCheck - System status"
echo "   - /analytics - Usage statistics"
echo ""
echo "🔒 Remember: This is for civic education, not political campaigning!"