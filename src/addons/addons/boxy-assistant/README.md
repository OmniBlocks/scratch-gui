# Boxy AI Assistant Addon

An AI-powered assistant addon for OmniBlocks that provides helpful guidance and feedback through an interactive character.

## Overview

Boxy is an animated AI assistant mascot that appears in the OmniBlocks editor. Unlike traditional chatbots, Boxy is designed to be:
- **Visual and Interactive**: Appears as a draggable character with animations
- **Educational**: Focuses on teaching concepts rather than just generating code
- **Privacy-First**: Runs locally using WebGPU or user-provided API keys
- **Non-Intrusive**: Tucked away like Clippy, not taking over the interface

## Current Status

### ✅ Implemented
- Basic addon scaffolding and registration
- Draggable Boxy character with smooth animations
- Text bubble system for displaying messages
- CSS animations (wave, bounce, thinking)
- API exposed for future AI integration
- Responsive design with proper positioning

### 🚧 In Progress
- Animation system for pointing and gesturing
- 48-frame star eyes animation sequence
- Arm growing animation for block manipulation

### 📋 Planned
- ONNX Runtime WebGPU integration
- Local AI model loading with progress indicator
- Tool calling system for precise UI interactions
- Chat interface with context awareness
- Code editing capabilities with visual feedback
- Optional API key support (with strong warnings)

## Features

### Draggable Character
Boxy can be moved anywhere on the screen by clicking and dragging. Position is maintained across sessions (planned).

### Smart Text Bubbles
Messages appear in styled speech bubbles with:
- Gradient background matching OmniBlocks theme
- Auto-hide after 5 seconds (configurable)
- Proper positioning relative to Boxy
- Smooth appear/disappear animations

### Animation System
Pre-built CSS animations include:
- **Wave**: Friendly greeting animation
- **Bounce**: Excitement or success indicator
- **Thinking**: Shows processing/loading state
- **Excited**: Eye color change for enthusiasm

### API Interface
Exposed via `window.boxyAPI`:
```javascript
// Show a message
window.boxyAPI.showMessage("Hello!", 5000);

// Move Boxy to a specific position
window.boxyAPI.moveTo(100, 200);

// Play an animation
window.boxyAPI.playAnimation("wave");
```

## File Structure

```
boxy-assistant/
├── _manifest_entry.js    # Addon metadata and configuration
├── _runtime_entry.js     # Resource imports for webpack
├── userscript.js         # Main addon logic
└── style.css             # Styling and animations
```

## How It Works

1. **Initialization**: Addon waits for the editor to be ready
2. **DOM Injection**: Creates overlay container with Boxy character
3. **Event Handlers**: Sets up drag-and-drop functionality
4. **Welcome Message**: Shows greeting after 1 second
5. **API Exposure**: Makes boxyAPI available globally

## Design Philosophy

### Why Not a Traditional Chatbot?
- **For Kids**: Anthropomorphized characters are more engaging
- **Context Focused**: Small, specific feedback is better than long responses
- **Visual Learning**: Pointing and gesturing > text explanations
- **Reduced Context**: Less AI processing = works on slower devices

### Why Local AI?
- **Privacy**: Kids' code shouldn't be sent to corporations
- **Education**: Teaches about local vs. cloud computing
- **Accessibility**: Works without internet connection
- **Performance**: WebGPU acceleration on modern devices

### Why Animations?
- **Teaching**: Shows *how* to do things, not just *what* to do
- **Engagement**: Movement keeps attention
- **Feedback**: Visual confirmation of actions
- **Personality**: Makes the assistant feel alive

## Future Development

### Animation Improvements
- Implement frame-by-frame animation system
- Add sprite sheet support for complex animations
- Create library of gestures and expressions
- Add blinking and idle animations

### AI Integration
1. **Model Selection**: Small, efficient models (< 1GB)
2. **WebGPU Acceleration**: Use ONNX Runtime Web
3. **Tool Calling**: Enable Boxy to:
   - Point at specific blocks
   - Navigate to categories
   - Highlight UI elements
   - Demonstrate actions

### User Experience
- Settings panel for customization
- Animation speed controls
- Voice toggle (text-to-speech)
- Personality options
- Theme integration

## Technical Details

### Dependencies
- OmniBlocks addon system
- Scratch GUI framework
- Future: ONNX Runtime Web + WebGPU

### Browser Compatibility
- Chrome/Edge: Full support (WebGPU available)
- Firefox: Basic support (CSS animations only)
- Safari: Basic support (limited WebGPU)

### Performance
- Lightweight: < 10KB minified
- No runtime dependencies
- CSS-based animations (hardware accelerated)
- Future AI: GPU-accelerated inference

## Contributing

When adding features to Boxy:
1. Keep the code clean and documented
2. Test animations on slow devices
3. Consider accessibility (screen readers, etc.)
4. Maintain the friendly, helpful personality
5. Respect user privacy always

## Philosophy Quote

> "Sorry, buddy. I can suggest things to you, help you learn a concept, or brainstorm fun things, but if you're here to vibe code, this ain't the place for you, pal." 
> — Boxy, on being asked to write code for users

## Credits

- Created by: @supervoidcoder
- OmniBlocks Team
- Boxy character design: OmniBlocks (CC BY-SA 4.0)

## License

Part of OmniBlocks, licensed under GNU GPLv3.
Boxy character is licensed under CC BY-SA 4.0.
