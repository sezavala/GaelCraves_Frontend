#!/bin/bash

# Heroku Environment Variables Setup Script
# This script helps you set up all required environment variables for Heroku deployment

echo "🚀 Gael's Craves - Heroku Environment Setup"
echo "============================================"
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed."
    echo "Please install it from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

echo "✅ Heroku CLI is installed"
echo ""

# Get app name
read -p "Enter your Heroku app name: " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "❌ App name cannot be empty"
    exit 1
fi

echo ""
echo "📝 Setting environment variables for app: $APP_NAME"
echo ""

# Read from .env file
if [ -f .env ]; then
    echo "📄 Reading values from .env file..."
    source .env
else
    echo "⚠️  .env file not found. You'll need to enter values manually."
fi

# Set GOOGLE_WEB_CLIENT_ID
if [ -z "$GOOGLE_WEB_CLIENT_ID" ]; then
    read -p "Enter GOOGLE_WEB_CLIENT_ID: " GOOGLE_WEB_CLIENT_ID
fi
echo "Setting GOOGLE_WEB_CLIENT_ID..."
heroku config:set GOOGLE_WEB_CLIENT_ID="$GOOGLE_WEB_CLIENT_ID" --app "$APP_NAME"

# Set GOOGLE_ANDROID_CLIENT_ID
if [ -z "$GOOGLE_ANDROID_CLIENT_ID" ]; then
    read -p "Enter GOOGLE_ANDROID_CLIENT_ID: " GOOGLE_ANDROID_CLIENT_ID
fi
echo "Setting GOOGLE_ANDROID_CLIENT_ID..."
heroku config:set GOOGLE_ANDROID_CLIENT_ID="$GOOGLE_ANDROID_CLIENT_ID" --app "$APP_NAME"

# Set GOOGLE_IOS_CLIENT_ID
if [ -z "$GOOGLE_IOS_CLIENT_ID" ]; then
    read -p "Enter GOOGLE_IOS_CLIENT_ID: " GOOGLE_IOS_CLIENT_ID
fi
echo "Setting GOOGLE_IOS_CLIENT_ID..."
heroku config:set GOOGLE_IOS_CLIENT_ID="$GOOGLE_IOS_CLIENT_ID" --app "$APP_NAME"

# Set API_BASE
read -p "Enter your backend API URL (e.g., https://your-backend.herokuapp.com): " API_BASE
if [ -z "$API_BASE" ]; then
    API_BASE="http://localhost:8080"
    echo "⚠️  Using default: $API_BASE"
fi
echo "Setting API_BASE..."
heroku config:set API_BASE="$API_BASE" --app "$APP_NAME"

echo ""
echo "✅ All environment variables have been set!"
echo ""
echo "📋 Current configuration:"
heroku config --app "$APP_NAME"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify the configuration above"
echo "2. Update Google OAuth settings to include your Heroku URL"
echo "3. Deploy your app: git push heroku main"
echo "4. Check logs: heroku logs --tail --app $APP_NAME"
