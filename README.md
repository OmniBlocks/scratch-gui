# OmniBlocks Sprite Library - Boxy Integration

This implementation adds **Boxy**, the official OmniBlocks mascot, to the sprite library. Boxy is a friendly, box-shaped character that represents the coding spirit of OmniBlocks.

## 🎭 About Boxy

Boxy is the official mascot of OmniBlocks, designed to be a welcoming and approachable character for coders of all ages. The character features:

- **Aqua/Blue color scheme** matching OmniBlocks branding
- **Box-shaped design** representing the "blocks" in block-based programming
- **Friendly expressions** with animated costumes
- **CC BY-SA 4.0 license** for open use

## 📁 File Structure

```
src/lib/libraries/sprites/
├── index.js                    # Main sprite library registry
└── boxy/
    ├── boxy.json              # Sprite metadata and configuration
    ├── boxy.svg               # Icon for sprite library
    ├── boxy-a.svg             # First costume (normal expression)
    └── boxy-b.svg             # Second costume (winking expression)
```

## 🎨 Sprite Features

### Costumes
- **boxy-a**: Normal happy expression with both eyes open
- **boxy-b**: Winking expression with animated arms

### Properties
- **Name**: Boxy
- **Tags**: mascot, character, omniblocks
- **Featured**: Yes (appears prominently in sprite library)
- **Costumes**: 2 animated costumes
- **Sounds**: 1 default sound effect
- **Size**: 96x100 pixels (costumes), 48x48 pixels (icon)

## 🚀 Integration

### Sprite Library Integration
The sprite is automatically available in the sprite library through:

1. **Sprite Registry** (`src/lib/libraries/sprites/index.js`)
2. **Library Component** (`src/components/library/library.jsx`)
3. **Sprite Selector** (`src/components/sprite-selector/sprite-selector.jsx`)

### Usage
Users can add Boxy to their projects by:
1. Clicking "Add Sprite" in the sprite selector
2. Browsing the sprite library
3. Selecting Boxy from the featured sprites
4. Boxy will be added to their project with both costumes

## 🎯 Technical Implementation

### Sprite Definition
```javascript
{
    name: 'Boxy',
    md5: 'boxy.svg',
    type: 'sprite',
    tags: ['mascot', 'character', 'omniblocks'],
    info: [2, 2, 1], // [costume count, sound count, sample count]
    json: boxyData,
    icon: boxyIcon,
    description: 'The official OmniBlocks mascot - a friendly coding companion!',
    featured: true
}
```

### SVG Assets
All Boxy assets are created as scalable SVG files with:
- **Gradient fills** for visual appeal
- **Consistent color scheme** (#4FC3F7, #29B6F6)
- **Proper viewBox** for scaling
- **Accessible design** with clear contrast

## 📜 License

Boxy assets are licensed under **CC BY-SA 4.0**, allowing:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

**Attribution required**: "Boxy mascot by OmniBlocks Team"

## 🎉 Getting Started

To use this implementation:

1. **Install dependencies**: `npm ci`
2. **Start development server**: `npm start`
3. **Open browser**: Navigate to `http://localhost:8601`
4. **Add Boxy**: Click "Add Sprite" and select Boxy from the library

The sprite library will automatically include Boxy as a featured sprite, ready for use in any OmniBlocks project!
