# 🎭 OmniBlocks Playwright Testing Suite

Welcome to the COOCOO WHACK INSANE Playwright testing system! 🎪

This testing suite performs automated chaos testing on OmniBlocks to detect JavaScript errors through:
- 🎯 **Random Click Spam** - Clicks everywhere like a maniac
- 📹 **Recorded Action Playback** - Replays user interactions
- 🚨 **Error Detection** - Monitors console for JS errors (not warnings)
- 📹 **Video Recording** - Records everything for analysis
- 🤖 **Automatic Issue Creation** - Creates GitHub issues with AI summaries

## 🚀 Quick Start

### Installation

1. **Add dependencies to your package.json:**
   ```bash
   # Copy the dependencies from playwright-dependencies.json
   npm install --save-dev @playwright/test @octokit/rest
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install --with-deps
   ```

### Running Tests

```bash
# Run all tests
npm run test:playwright

# Run only random click tests
npm run test:random

# Run only recorded action tests
npm run test:recorded

# Run with UI (interactive mode)
npm run test:ui

# Debug mode (step through tests)
npm run test:debug
```

## 🎪 Test Types

### 1. Random Click Spam Tests (`random-clicks.spec.js`)

**Chaos Mode: 100 Random Clicks 🎪**
- Performs 100 completely random clicks across the interface
- Clicks at random coordinates within the viewport
- Logs every action and monitors for errors

**Focused Spam: UI Components 🎨**
- Targets specific UI components (Menu Bar, Sprite List, etc.)
- Spam clicks within component boundaries
- Tests component-specific error handling

**Rapid Fire: Quick Succession Clicks ⚡**
- Rapid-fire clicks on interactive elements
- Tests race conditions and rapid interaction handling
- 50ms delay between clicks for maximum chaos

### 2. Recorded Action Tests (`recorded-actions.spec.js`)

**Basic Project Creation Workflow 🎨**
- Simulates creating a basic Scratch project
- Drags blocks, clicks green flag, etc.

**Menu Navigation Sequence 🧭**
- Tests all menu interactions
- File, Edit, Tutorials menus

**Sprite Management Workflow 🐱**
- Adding, selecting, and managing sprites
- Context menu interactions

**Block Palette Exploration 🧩**
- Clicks through all block categories
- Tests block loading and rendering

**Stage Interaction Sequence 🎭**
- Stage clicks, fullscreen, start/stop project

**Addon Panel Interaction 🔧**
- Opens addon settings, toggles addons

## 🚨 Error Detection

The error detection system monitors for:

✅ **JavaScript Errors (Detected):**
- Console errors (`console.error()`)
- Uncaught exceptions (`window.onerror`)
- Failed JavaScript file loads
- Runtime errors and exceptions

❌ **Warnings (Ignored):**
- Console warnings (`console.warn()`)
- Deprecation notices
- Non-critical messages

### Error Context Capture

When an error is detected, the system captures:
- **Error details** (message, stack trace, type)
- **Recent actions** (last 10 user interactions)
- **Video recording** of the entire test session
- **Timestamp** and environment info

## 🤖 Automatic Issue Creation

When errors are found, the system automatically:

1. **Copies the video** to `test-results/error-videos/`
2. **Analyzes the error** (if under 8k tokens)
3. **Creates a GitHub issue** with:
   - Error details and stack trace
   - Video link (when possible)
   - Action sequence leading to error
   - AI-generated hypothesis
   - Environment information

### Required Environment Variables

```bash
# For GitHub issue creation
GITHUB_TOKEN=your_github_token_here
```

## 📹 Video Analysis

All tests are recorded as videos and stored in:
- `test-results/` - All test videos
- `test-results/error-videos/` - Videos where errors occurred

Videos are automatically uploaded as GitHub Actions artifacts and retained for 30-90 days.

## 🔧 Configuration

### Playwright Config (`playwright.config.js`)

Key settings:
- **Base URL:** `http://localhost:8601` (OmniBlocks dev server)
- **Video:** Always recorded (`video: 'on'`)
- **Screenshots:** On failure only
- **Timeout:** 30s for actions, 60s for navigation
- **Browsers:** Chrome, Firefox, Safari

### Customizing Tests

**Adjust click count for random tests:**
```javascript
const CLICK_COUNT = 200; // Increase for more chaos!
```

**Add new recorded actions:**
```javascript
const actions = [
  { type: 'click', selector: '.my-button', description: 'Click my button' },
  { type: 'wait', duration: 1000 },
  // ... more actions
];
```

## 🎯 CI/CD Integration

The GitHub Actions workflow (`.github/workflows/playwright-tests.yml`) runs:

- **Daily at 2 AM UTC** (scheduled)
- **Manual trigger** with test type selection
- **On pull requests** (optional)

### Workflow Features:
- Builds OmniBlocks from source
- Runs tests in headless browsers
- Uploads video artifacts
- Creates GitHub issues on errors
- Comments on PRs when errors found

## 🐛 Troubleshooting

**Tests failing to start:**
- Check that OmniBlocks dev server is running on port 8601
- Ensure Playwright browsers are installed

**No videos recorded:**
- Check `playwright.config.js` has `video: 'on'`
- Verify write permissions to `test-results/`

**Issues not being created:**
- Set `GITHUB_TOKEN` environment variable
- Check GitHub API rate limits
- Verify repository permissions

## 🎪 Adding More Chaos

Want to add even MORE insane testing? Here are ideas:

- **Keyboard Spam:** Random key presses
- **Mouse Gestures:** Complex drag patterns
- **Mobile Simulation:** Touch events and gestures
- **Network Chaos:** Simulate connection issues
- **Performance Stress:** Memory and CPU intensive operations

---

**Remember:** The goal is to break things in creative ways so we can fix them before users encounter them! 🎪🚨

*Made with 💥 chaos and 🤖 automation*
