# Boxy AI Assistant - Quick Start Guide

## Enabling Boxy

1. **Open OmniBlocks** in your browser
2. Click the **Settings** icon (⚙️ gear icon) in the top-right corner
3. Look for **"Boxy AI Assistant"** in the addons list
   - It should be in the "Featured" or "New" section
4. **Toggle the switch** to enable it
5. Return to the editor

## Using Boxy

### First Interaction
When you enable Boxy for the first time, you'll see:
- A small robot character appear in the bottom-right corner
- A speech bubble saying "Hi! I'm Boxy, your AI assistant!"

### Moving Boxy Around
- **Click and drag** Boxy to move him anywhere on screen
- Release to place him in a new position
- Boxy has a subtle glow effect when you hover over him

### Current Features (v1.0)
- ✅ Draggable character
- ✅ Welcome message
- ✅ Smooth animations
- ✅ Text bubble system

### Upcoming Features
- 🚧 AI-powered assistance
- 🚧 Block suggestions
- 🚧 Code explanations
- 🚧 Local AI model (no internet required!)
- 🚧 Optional API key support

## Technical Details

### Browser Compatibility
- **Chrome/Edge**: Full support ✅
- **Firefox**: Basic support ✅
- **Safari**: Basic support ✅

### Performance
- **Lightweight**: Adds minimal overhead
- **Hardware Accelerated**: Uses CSS transforms for smooth animations
- **No External Dependencies**: Works completely offline

### Privacy
- **Local First**: All data stays on your device
- **No Tracking**: Boxy doesn't send any information anywhere
- **Open Source**: You can review all the code

## API for Developers

If you want to interact with Boxy programmatically, use the global API:

```javascript
// Show a custom message
window.boxyAPI.showMessage("Great job!", 3000);

// Move Boxy to a specific position
window.boxyAPI.moveTo(150, 200);

// Trigger an animation
window.boxyAPI.playAnimation("wave");
```

## Troubleshooting

### Boxy doesn't appear
1. Make sure the addon is enabled in settings
2. Refresh the page
3. Check browser console for errors (F12)

### Boxy is in the way
- Just drag him to a different corner!
- Or disable the addon temporarily in settings

### Animation issues
- Make sure your browser supports CSS animations
- Try disabling hardware acceleration if animations are choppy

## Feedback

Found a bug or have a suggestion? Open an issue on our GitHub!

## What's Next?

The Boxy AI Assistant is just getting started. Future updates will include:
- **Smart Suggestions**: Context-aware help
- **Code Review**: Boxy can review your code and suggest improvements
- **Interactive Tutorials**: Step-by-step guidance with visual cues
- **Voice Support**: Boxy can speak (optional)
- **Customization**: Change Boxy's appearance and personality

Stay tuned! 🎉
