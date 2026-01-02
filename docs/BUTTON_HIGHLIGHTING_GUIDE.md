# Button Highlighting Guide - Driver.js Integration

OmniBlocks now includes **driver.js** for highlighting buttons and creating guided tours throughout the interface. This feature helps users discover functionality and provides interactive onboarding experiences.

## 🎯 Quick Start

Once OmniBlocks loads, you can immediately start highlighting buttons:

```javascript
// Highlight the File menu
window.OmniBlocks.highlight.fileMenu();

// Start a guided tour of the menu bar
window.OmniBlocks.highlight.menuBarTour();

// Show demo with usage examples
window.OmniBlocks.highlight.demo();
```

## 📚 API Reference

### Global API Access

The highlighting API is available globally at `window.OmniBlocks.highlight`:

```javascript
const highlightAPI = window.OmniBlocks.highlight;
```

### Core Methods

#### `highlight(selector, options)`
Highlight any element by CSS selector.

```javascript
window.OmniBlocks.highlight.highlight('[data-driver="file-menu"]', {
    title: 'File Menu',
    description: 'Access project management functions here.',
    position: 'bottom'
});
```

**Parameters:**
- `selector` (string): CSS selector for the element to highlight
- `options` (object): Highlight configuration
  - `title` (string): Popup title
  - `description` (string): Popup description
  - `position` (string): Popup position ('top', 'bottom', 'left', 'right')
  - `showButtons` (array): Which buttons to show (['next', 'previous', 'close'])

#### `tour(steps)`
Start a multi-step guided tour.

```javascript
window.OmniBlocks.highlight.tour([
    {
        element: '[data-driver="file-menu"]',
        popover: {
            title: 'Step 1: File Menu',
            description: 'This is where you manage your projects.',
            position: 'bottom'
        }
    },
    {
        element: '[data-driver="addons-button"]',
        popover: {
            title: 'Step 2: Addons',
            description: 'Customize OmniBlocks with addons.',
            position: 'bottom'
        }
    }
]);
```

#### `clear()`
Clear any active highlights or tours.

```javascript
window.OmniBlocks.highlight.clear();
```

### Predefined Button Highlights

#### Menu Bar Buttons
```javascript
window.OmniBlocks.highlight.fileMenu();     // Highlight File menu
window.OmniBlocks.highlight.editMenu();     // Highlight Edit menu
window.OmniBlocks.highlight.addons();       // Highlight Addons button
window.OmniBlocks.highlight.advanced();     // Highlight Advanced Settings
window.OmniBlocks.highlight.feedback();     // Highlight Feedback button
```

#### Interface Elements
```javascript
window.OmniBlocks.highlight.playButton();   // Highlight Play/Stop button
```

#### Guided Tours
```javascript
window.OmniBlocks.highlight.menuBarTour();  // Complete menu bar tour
```

## 🎨 Available Data Attributes

The following elements have `data-driver` attributes for easy targeting:

| Element | Selector | Description |
|---------|----------|-------------|
| File Menu | `[data-driver="file-menu"]` | File operations menu |
| Edit Menu | `[data-driver="edit-menu"]` | Edit operations menu |
| Addons Button | `[data-driver="addons-button"]` | Addons settings |
| Advanced Button | `[data-driver="advanced-button"]` | Advanced settings |
| Feedback Button | `[data-driver="feedback-button"]` | Feedback link |
| Play Button | `[data-driver="play-button"]` | Play/Stop button |

## 🎭 Customization

### Custom Styling

Driver.js highlights use custom CSS classes that match OmniBlocks theming:

- `.omniblocks-driver-popover` - Main popover container
- Custom colors use CSS variables like `var(--ui-primary)` and `var(--text-primary)`

### Creating Custom Tours

```javascript
// Define your own tour steps
const customTour = [
    {
        element: '.my-custom-button',
        popover: {
            title: 'Custom Feature',
            description: 'This is a custom feature explanation.',
            position: 'right'
        }
    }
];

// Start the tour
window.OmniBlocks.highlight.tour(customTour);
```

## 🔧 Development

### Adding New Highlightable Elements

1. Add a `data-driver` attribute to your component:
```jsx
<button data-driver="my-new-button" onClick={handleClick}>
    My Button
</button>
```

2. Create a highlight function in `src/lib/button-tours.js`:
```javascript
export const highlightMyButton = () => {
    driverService.highlightButton('[data-driver="my-new-button"]', {
        title: 'My Button',
        description: 'This button does something awesome.',
        position: 'bottom'
    });
};
```

3. Export it in `src/lib/highlight-api.js`:
```javascript
myButton() { return highlightMyButton(); }
```

## 🎪 Demo Mode

Run the demo to see highlighting in action:

```javascript
window.OmniBlocks.highlight.demo();
```

This will:
- Log usage examples to the console
- Automatically highlight the File menu after 1 second
- Show you how to use the API

## 🚀 Integration Examples

### Onboarding New Users
```javascript
// Welcome new users with a tour
if (isFirstTimeUser) {
    setTimeout(() => {
        window.OmniBlocks.highlight.menuBarTour();
    }, 2000);
}
```

### Context-Sensitive Help
```javascript
// Highlight relevant buttons based on user action
function showHelp(context) {
    switch(context) {
        case 'file-operations':
            window.OmniBlocks.highlight.fileMenu();
            break;
        case 'customization':
            window.OmniBlocks.highlight.addons();
            break;
    }
}
```

### Feature Announcements
```javascript
// Announce new features
window.OmniBlocks.highlight.highlight('[data-driver="new-feature"]', {
    title: '🎉 New Feature!',
    description: 'Check out this awesome new functionality we just added.',
    position: 'bottom'
});
```

---

**Note**: This feature uses [driver.js](https://driverjs.com/) v1.3.1 for the underlying highlighting functionality. All driver.js options and configurations are supported through the OmniBlocks API.
