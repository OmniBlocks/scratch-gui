# Boxy AI Assistant - Visual Preview

## What You'll See

When you enable the Boxy AI Assistant addon, here's what appears:

```
┌─────────────────────────────────────────────────────────────────┐
│  OmniBlocks Editor                                     [⚙️ Settings] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │ Code Blocks │                                                │
│  │             │                                                │
│  │ • Motion    │                                                │
│  │ • Looks     │        [Stage Preview Area]                   │
│  │ • Sound     │                                                │
│  │ ...         │                                                │
│  └─────────────┘                                                │
│                                                                 │
│                                                                 │
│                                     ┌─────────────────────┐    │
│                                     │  Hi! I'm Boxy,      │    │
│                                     │  your AI assistant! │    │
│                                     │  Click and drag me  │    │
│                                     │  to move me around! │    │
│                                     └─────┬───────────────┘    │
│                                           │                     │
│                                        ╔═══▼══╗                 │
│                                        ║ 👀   ║  ← Boxy         │
│                                        ║      ║                 │
│                                        ║ 😊   ║                 │
│                                        ╚══════╝                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Boxy Character Details

```
     Antennae
        │ │
    ╔═══╧═╧═══╗
    ║ [●] [●] ║  ← Eyes (can animate!)
    ║         ║
    ║    _    ║  ← Mouth (smile)
    ╚═════════╝
    ║█████████║  ← Body with display
    ║ ●  |||  ●║
    ╚═════════╝
```

### Boxy Specifications:
- **Size**: 150px × 156px (adjustable)
- **Position**: Bottom-right corner (default)
- **Colors**: OmniBlocks gradient (blue to teal)
- **Features**: 
  - Draggable anywhere on screen
  - Glow effect on hover
  - Animated eyes and expressions
  - Speech bubble for messages

## States & Animations

### 1. Idle State
```
╔═════════╗
║ •  •    ║  Regular eyes, slight breathing animation
║    _    ║  
╚═════════╝
```

### 2. Excited State (Star Eyes)
```
╔═════════╗
║ ★  ★    ║  Star eyes when celebrating or excited
║    ◡    ║  Big smile
╚═════════╝
```

### 3. Thinking State
```
╔═════════╗
║ •  •    ║  Regular eyes
║    ~    ║  
╚═════════╝
     ...      ← Floating dots above head
```

### 4. Waving Animation
```
Frame 1:          Frame 2:          Frame 3:
╔═════════╗      ╔═════════╗      ╔═════════╗
║ •  •    ║      ║ •  •    ║      ║ •  •    ║
║    _    ║  →   ║    _    ║  →   ║    _    ║
╚═════════╝      ╚═════════╝      ╚═════════╝
    \o               |o               o|
```

## Text Bubble Examples

### Welcome Message
```
    ┌──────────────────────────────┐
    │  Hi! I'm Boxy, your AI       │
    │  assistant! Drag me around!  │
    └──────────┬───────────────────┘
               │
            ╔══▼═╗
            ║ • • ║
            ╚════╝
```

### Help Message
```
    ┌──────────────────────────────┐
    │  Great job! That block       │
    │  makes your sprite move.     │
    │  Try adding a sound!         │
    └──────────┬───────────────────┘
               │
            ╔══▼═╗
            ║ ★ ★ ║  (Excited!)
            ╚════╝
```

### Error/Tip Message
```
    ┌──────────────────────────────┐
    │  Hmm, that loop might run    │
    │  forever. Want to add a      │
    │  condition?                  │
    └──────────┬───────────────────┘
               │
            ╔══▼═╗
            ║ ~  ~║  (Concerned)
            ╚════╝
```

## Interaction Patterns

### Dragging Boxy
```
1. Hover over Boxy
   ╔═════════╗
   ║ •  •    ║  ← Cursor: move (grab hand)
   ║    _    ║     Glow appears
   ╚═════════╝

2. Click and hold
   ╔═════════╗
   ║ •  •    ║  ← Cursor: grabbing (closed hand)
   ║    _    ║     Slightly larger
   ╚═════════╝

3. Drag to new position
   ╔═════════╗
   ║ •  •    ║ → → → → New position!
   ║    _    ║
   ╚═════════╝
```

## Settings Panel Appearance

```
┌──────────────────────────────────────────────┐
│  Addons Settings                             │
├──────────────────────────────────────────────┤
│                                              │
│  ★ Featured                                  │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  🤖 Boxy AI Assistant          [OFF]   │  │
│  │                                         │  │
│  │  An AI-powered assistant to help       │  │
│  │  you learn and code better.            │  │
│  │                                         │  │
│  │  Tags: featured, new                   │  │
│  └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘
```

## Real-World Screenshot Placeholder

```
[When you build and run OmniBlocks, take a screenshot here!]

Expected location for screenshot:
/docs/images/boxy-assistant-screenshot.png

To capture:
1. Enable the addon
2. Let Boxy appear with welcome message
3. Take screenshot showing:
   - Boxy character
   - Speech bubble
   - OmniBlocks interface
```

## Color Scheme

- **Primary**: #0067bb to #00ba87 (gradient)
- **Eyes**: #ffcd00 (yellow/gold)
- **Mouth**: #00ff2a (green - happy)
- **Body**: #032500 (dark green)
- **Speech Bubble**: Same gradient as primary
- **Text**: White (#ffffff)

## Responsive Behavior

### Desktop (> 768px)
- Boxy: 150px × 156px
- Speech bubble: Max 300px wide
- Font: 14px

### Mobile/Tablet (< 768px)
- Boxy: 100px × 104px
- Speech bubble: Max 200px wide
- Font: 12px

## Z-Index Layering

```
Layer Stack (bottom to top):
━━━━━━━━━━━━━━━━━━━━━━━
10000 - Speech Bubble
 9999 - Boxy Character
   -- - Boxy Container
    1 - Editor UI
    0 - Base elements
```

## Future Visual Enhancements

- [ ] Blinking animation for eyes
- [ ] Arm/hand animations for gestures
- [ ] Particle effects for celebrations
- [ ] Customizable colors/themes
- [ ] Multiple expressions/emotions
- [ ] Shadow effects for depth
- [ ] Smooth position interpolation

---

## For Developers

To modify Boxy's appearance, edit:
- **SVG Structure**: `userscript.js` (inline SVG)
- **Styling**: `style.css`
- **Animations**: `style.css` (@keyframes)
- **Positioning**: `userscript.js` (JavaScript)

For color changes, update the gradient stops in the SVG's `<linearGradient>` elements.
