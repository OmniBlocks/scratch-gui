#!/bin/bash

# Video to GIF Conversion Utility for OmniBlocks
# Converts video files to GIF format for GitHub issue display

set -e

usage() {
    echo "Usage: $0 <input_video> <output_gif> [options]"
    echo ""
    echo "Options:"
    echo "  --fps FPS        Frame rate for GIF (default: 10)"
    echo "  --width WIDTH    Width in pixels (default: 800)"
    echo "  --quality QUAL   Quality level 1-5 (default: 3)"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 test-video.webm test-video.gif"
    echo "  $0 test-video.webm test-video.gif --fps 15 --width 600"
    exit 1
}

# Default values
FPS=10
WIDTH=800
QUALITY=3

# Parse arguments
INPUT_VIDEO=""
OUTPUT_GIF=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --fps)
            FPS="$2"
            shift 2
            ;;
        --width)
            WIDTH="$2"
            shift 2
            ;;
        --quality)
            QUALITY="$2"
            shift 2
            ;;
        --help)
            usage
            ;;
        -*)
            echo "Unknown option: $1"
            usage
            ;;
        *)
            if [ -z "$INPUT_VIDEO" ]; then
                INPUT_VIDEO="$1"
            elif [ -z "$OUTPUT_GIF" ]; then
                OUTPUT_GIF="$1"
            else
                echo "Too many arguments"
                usage
            fi
            shift
            ;;
    esac
done

if [ -z "$INPUT_VIDEO" ] || [ -z "$OUTPUT_GIF" ]; then
    echo "Error: Input video and output GIF paths are required"
    usage
fi

if [ ! -f "$INPUT_VIDEO" ]; then
    echo "Error: Input video file '$INPUT_VIDEO' not found"
    exit 1
fi

echo "🎬 Converting video to GIF..."
echo "  Input: $INPUT_VIDEO"
echo "  Output: $OUTPUT_GIF"
echo "  Settings: ${FPS}fps, ${WIDTH}px width, quality level $QUALITY"

# Convert video to GIF using ffmpeg
ffmpeg -i "$INPUT_VIDEO" \
    -vf "fps=$FPS,scale=$WIDTH:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=256[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" \
    -loop 0 "$OUTPUT_GIF" -y

echo "✅ Conversion complete: $OUTPUT_GIF"
