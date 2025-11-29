#!/bin/bash

# Test script to verify the Hello World banner implementation
echo "Testing Hello World banner implementation..."

# Check if the CSS class exists
echo "1. Checking CSS class definition..."
if grep -q "hello-world-banner" src/components/gui/gui.css; then
    echo "✅ CSS class .hello-world-banner found"
else
    echo "❌ CSS class .hello-world-banner not found"
    exit 1
fi

# Check if the banner is added to the JSX
echo "2. Checking JSX implementation..."
if grep -q "helloWorldBanner" src/components/gui/gui.jsx; then
    echo "✅ Banner component found in JSX"
else
    echo "❌ Banner component not found in JSX"
    exit 1
fi

# Check if Hello World text is present
echo "3. Checking Hello World text..."
if grep -q "Hello World!" src/components/gui/gui.jsx; then
    echo "✅ Hello World text found"
else
    echo "❌ Hello World text not found"
    exit 1
fi

echo "4. Checking theme variable usage..."
if grep -q "\$motion-primary" src/components/gui/gui.css; then
    echo "✅ Theme variables used for styling"
else
    echo "❌ Theme variables not found"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Hello World banner implementation is complete."
echo ""
echo "To test the implementation:"
echo "1. Run 'npm install' to install dependencies"
echo "2. Run 'npm start' to start the development server"
echo "3. Open the application in your browser"
echo "4. The 'Hello World!' banner should appear at the top of the GUI"