#!/bin/bash

# 🎭 OmniBlocks Playwright Setup Script
# Sets up the COOCOO WHACK INSANE testing environment!

echo "🎪 Setting up OmniBlocks Playwright Testing Suite..."
echo "   COOCOO WHACK INSANE AND WE WANT MORE CI WOOHOOOOOO!"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install Playwright dependencies
echo "📦 Installing Playwright dependencies..."
npm install --save-dev @playwright/test @octokit/rest

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

if [ $? -ne 0 ]; then
    echo "❌ Failed to install Playwright browsers"
    exit 1
fi

# Create test results directory
echo "📁 Creating test directories..."
mkdir -p test-results/error-videos

# Make the script executable
chmod +x setup-playwright.sh

echo ""
echo "🎉 Playwright setup complete!"
echo ""
echo "🚀 Ready to run tests:"
echo "   npm run test:playwright    # Run all tests"
echo "   npm run test:random        # Random click spam"
echo "   npm run test:recorded      # Recorded actions"
echo "   npm run test:ui            # Interactive mode"
echo ""
echo "🎪 Let the chaos begin! WOOHOOOOOO!"
