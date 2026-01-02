#!/bin/bash

OUTPUT_DIR="$1"

if [ -z "$OUTPUT_DIR" ]; then
    echo "Usage: $0 <output_directory>"
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

COMMIT_SHA="${COMMIT_SHA:-unknown}"
BUILD_STATUS="${BUILD_STATUS:-unknown}"
SCREENSHOT_STATUS="${SCREENSHOT_STATUS:-unknown}"
CHAOS_STATUS="${CHAOS_STATUS:-unknown}"
DURATION="${DURATION:-unknown}"
RUN_ID="${RUN_ID:-unknown}"

# Count screenshots
SCREENSHOT_COUNT=0
if [ -d "dashboard" ]; then
    SCREENSHOT_COUNT=$(find dashboard -name "*.png" | wc -l)
fi

# Generate HTML
cat > "$OUTPUT_DIR/index.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>OmniBlocks Test Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .status { padding: 10px; margin: 10px 0; border-radius: 5px; }
        .success { background-color: #d4edda; }
        .failure { background-color: #f8d7da; }
        img { max-width: 300px; margin: 10px; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>🚀 OmniBlocks Test Dashboard</h1>
    <p><strong>Commit:</strong> ${COMMIT_SHA:0:8}</p>
    <p><strong>Duration:</strong> $DURATION</p>
    <p><strong>Run ID:</strong> $RUN_ID</p>
    
    <h2>Test Results</h2>
    <div class="status ${BUILD_STATUS}">Build: $BUILD_STATUS</div>
    <div class="status ${SCREENSHOT_STATUS}">Screenshots: $SCREENSHOT_STATUS ($SCREENSHOT_COUNT images)</div>
    <div class="status ${CHAOS_STATUS}">Chaos Tests: $CHAOS_STATUS</div>
    
    <h2>Screenshots</h2>
EOF

# Add screenshots to HTML
if [ -d "dashboard" ]; then
    find dashboard -name "*.png" | while read -r img; do
        rel_path="${img#dashboard/}"
        echo "    <img src=\"$rel_path\" alt=\"Screenshot\">" >> "$OUTPUT_DIR/index.html"
    done
fi

echo "</body></html>" >> "$OUTPUT_DIR/index.html"

echo "✅ Dashboard generated: $OUTPUT_DIR/index.html"
echo "📸 Screenshots included: $SCREENSHOT_COUNT"
