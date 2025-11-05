#!/bin/bash
set -e

echo "🚀 Setting up scratch-gui..."

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js 18+ recommended"
fi

npm ci

echo "✅ Setup complete!"
echo "Run: npm start"