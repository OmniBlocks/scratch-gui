#!/bin/bash
set -e

echo "🔍 Checking code quality..."

if rg "console\.log" src/ -g '*.js' -g '*.jsx' 2>/dev/null; then
    echo "⚠️  Found console.log statements"
else
    echo "✅ No console.log found"
fi

if rg "^\s*debugger;" src/ -g '*.js' -g '*.jsx' 2>/dev/null; then
    echo "❌ Found debugger statements"
    exit 1
fi

echo "✅ Quality check passed"