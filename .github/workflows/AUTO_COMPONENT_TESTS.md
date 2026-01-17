# Auto Component Tests Documentation

## Overview

The auto component tests workflow automatically detects new UI components (buttons, menus, etc.) in pull requests and generates Playwright tests to verify they're accessible and interactive.

## How It Works

### 1. Component Detection (`detect-components.js`)

Scans changed files for:
- `<button>` and `<Button>` elements
- Elements with `onClick` handlers
- `<MenuItem>` components

Outputs: `detected-components.json` with component metadata:
```json
{
  "type": "button",
  "file": "src/components/tw-security-manager-modal/security-manager-modal.jsx",
  "label": "Deny",
  "line": 68
}
```

### 2. Test Generation (`generate-tests.js`)

Generates Playwright tests with intelligent navigation strategies to find and test components.

## Navigation Strategies

The test generator implements a 5-strategy search system to handle hidden UI elements:

### Strategy 1: Direct Text Search
```javascript
let locator = page.getByText(targetText, { exact: false });
```
- Simplest approach - searches for visible text
- Works for immediately visible components

### Strategy 2: Container Search
```javascript
const containers = [
  '[role="menuitem"]',
  '[role="dialog"]',
  '[class*="modal"]',
  '[class*="button"]',
  'button',
  ...
];
```
- Searches within common UI containers
- Handles components with complex DOM structures

### Strategy 3: Modal Trigger (NEW!)
```javascript
if (componentFile.includes('modal')) {
  await tryTriggerModal(page, componentFile);
}
```
**Intelligent modal detection:**
- Analyzes component file path
- Automatically triggers appropriate actions to open modals

**For Security Manager Modals:**
1. Detects `security-manager` in file path
2. Clicks extension button
3. Loads first extension
4. Waits for security prompt to appear

**For Other Modals:**
- Clicks common modal triggers (Settings, Library buttons)
- Uses aria-labels and class names

### Strategy 4: Menu Opening
```javascript
if (comp.type === 'menu-item' || componentFile.includes('menu')) {
  await tryOpenMenus(page);
}
```
- Clicks menu bar items to reveal menu dropdowns
- Tries up to 5 menu items
- Waits for menu animations

### Strategy 5: Expand UI Elements
```javascript
const expandables = [
  '[aria-expanded="false"]',
  '[class*="dropdown"]',
  '[class*="accordion"]',
  'details:not([open])',
  ...
];
```
- Clicks expandable/collapsible elements
- Opens dropdowns and accordions
- Handles progressive disclosure UI patterns

## Screenshot Handling

### Always Take Screenshots
Unlike the previous version, screenshots are **ALWAYS** taken:

| Scenario | Filename | Content |
|----------|----------|---------|
| Component found | `component-X.png` | Highlighted component with blue border |
| Component not found | `component-X-not-found.png` | Full page showing current state |
| Element screenshot failed | `component-X-fallback.png` | Page screenshot with element in view |
| Test error | `component-X-error.png` | Full page at error time |

### Visual Highlighting
When components are found, they're highlighted with:
- 3px solid blue border (`#3b82f6`)
- Semi-transparent blue background
- Box shadow for emphasis
- Positioned as absolute overlay

## Helper Functions

### `tryTriggerModal(page, componentFile)`
Opens modals based on file path intelligence.

**Parameters:**
- `page` - Playwright page object
- `componentFile` - Path to the component file

**Logic:**
```javascript
if (componentFile.includes('security-manager')) {
  // Trigger security prompt via extensions
  await extensionButton.click();
  await extensionTiles.first().click();
}
else if (componentFile.includes('modal')) {
  // Try common modal triggers
  // Settings, Library, etc.
}
```

### `tryOpenMenus(page)`
Opens menu bar items to reveal hidden menu items.

**Algorithm:**
1. Locate menu bar buttons
2. Try up to 5 buttons
3. Click each visible button
4. Wait for menu animation
5. Return after first successful click

## Example: Security Manager Modal

**Problem:** "Deny" and "Allow" buttons are in a modal that only appears when extensions request permissions.

**Solution:**
```javascript
// Test detects: security-manager-modal.jsx
// Strategy 3 triggers:
await tryTriggerModal(page, 'security-manager-modal.jsx');

// Inside tryTriggerModal:
// 1. Clicks extension button
// 2. Loads first extension
// 3. Security modal appears!
// 4. Test finds "Deny" button
// 5. Screenshots + clicks it
```

**Output Log:**
```
🧪 Testing component: Deny
📁 Component file: src/components/tw-security-manager-modal/security-manager-modal.jsx
🔍 Strategy 2: Searching in common containers...
🪟 Strategy 3: Attempting to trigger modal...
🔐 Attempting to trigger security manager modal...
✅ Component found!
📸 Taking screenshot: component-1.png
📊 Screenshot saved: component-1.png
🖱️  Clicking element: Deny
✅ Successfully interacted with: Deny
```

## Adding Support for New Component Types

To add support for new hidden component types:

1. **Detect the pattern** in file paths or component types
2. **Add detection logic** in the strategy checks:
   ```javascript
   if (componentFile.includes('your-pattern')) {
     // Trigger logic
   }
   ```
3. **Add trigger function** if complex:
   ```javascript
   async function tryTriggerYourPattern(page) {
     // Implementation
   }
   ```

## Debugging

### Component Not Found
1. Check `component-X-not-found.png` screenshot
2. Review console logs for attempted strategies
3. Verify file path patterns match detection logic
4. Manually test if component is accessible in browser

### Test Failures
- Review `component-X-error.png`
- Check if server started correctly
- Verify build artifacts exist
- Look for JavaScript errors in console

### No Screenshots Generated
- Verify `test-results/` directory exists
- Check Playwright installation
- Ensure server is running on correct port
- Review workflow logs for server errors

## Configuration

### Timeouts
```javascript
timeout: 20000,           // Test timeout
waitForTimeout: 3000,     // Editor load wait
modalTimeout: 2000,       // Modal trigger timeout
menuTimeout: 1000,        // Menu open timeout
```

### Selectors
Common selectors are defined in strategy arrays. To add new patterns:
```javascript
const containers = [
  // Add your selectors here
  '[your-selector]',
  ...
];
```

## Best Practices

1. **Always check file paths** - Use file path analysis to determine component context
2. **Progressive navigation** - Try simple strategies first, complex ones later
3. **Wait appropriately** - Give UI time to animate and render
4. **Take screenshots** - Always capture state for debugging
5. **Log verbosely** - Help future developers understand what happened
6. **Fail gracefully** - Don't fail tests just because components are hard to find

## Future Improvements

- [ ] Support for custom component annotations (e.g., `@testable-modal`)
- [ ] AI-powered strategy selection
- [ ] Component dependency graph to determine navigation order
- [ ] Screenshot diffing for visual regression
- [ ] Accessibility testing (ARIA, keyboard navigation)
- [ ] Performance metrics (time to interactive)

## Contributing

When adding new navigation strategies:
1. Add strategy description in this document
2. Implement in `generate-tests.js`
3. Test with real components
4. Update strategy numbering if needed
5. Add logging for debugging

## Related Files

- `.github/workflows/tests.yml` - Main workflow file
- `detect-components.js` - Component detection script (inline in workflow)
- `generate-tests.js` - Test generation script (inline in workflow)
- `auto-generated.test.js` - Generated test file (created at runtime)
- `detected-components.json` - Detected components (created at runtime)
- `test-results/` - Screenshots and artifacts (created at runtime)

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Locators](https://playwright.dev/docs/locators)
- [Playwright Screenshots](https://playwright.dev/docs/screenshots)
- [OmniBlocks Component Guidelines](../../docs/COMPONENTS.md) (if exists)
