# Auto-Open Feature Documentation

## Overview

This feature implements automatic opening of the most recently saved file when OmniBlocks loads. It uses the File System Access API to remember recently accessed files and allows users to toggle this behavior in Advanced Settings.

## Implementation Details

### State Management

#### Redux State (`src/reducers/tw.js`)
Added to the `tw` reducer:
- `recentFiles`: Array of recently opened files (max 5)
  - Each entry contains: `{name: string, timestamp: number}`
- `autoOpenEnabled`: Boolean flag for the auto-open setting

#### Actions
- `ADD_RECENT_FILE`: Updates the recent files list
- `SET_AUTO_OPEN_ENABLED`: Toggles the auto-open setting

### LocalStorage Management (`src/lib/recent-files-manager.js`)

Manages persistent storage of:
- Recent files list (up to 5 most recent)
- Auto-open enabled/disabled state

**Key Functions:**
- `loadRecentFiles()`: Retrieves recent files from localStorage
- `saveRecentFiles(files)`: Persists recent files to localStorage
- `addRecentFile(fileHandle)`: Adds a new file to the recent list
- `loadAutoOpenSetting()`: Retrieves auto-open setting
- `saveAutoOpenSetting(enabled)`: Persists auto-open setting
- `clearRecentFiles()`: Clears all recent files

### File Tracking

#### On Save (`src/containers/sb3-downloader.jsx`)
When a user saves a file using the File System Access API:
1. File handle is captured
2. File metadata is added to recent files list
3. List is persisted to localStorage
4. Redux state is updated

#### On Load (`src/lib/sb-file-uploader-hoc.jsx`)
When a user opens a file:
1. File handle is captured from the picker
2. File metadata is added to recent files list
3. List is persisted to localStorage
4. Redux state is updated

### Auto-Open Logic (`src/lib/auto-open-hoc.jsx`)

A Higher-Order Component that:
1. Loads recent files and auto-open settings on mount
2. Checks if auto-open is enabled
3. If enabled and File System Access API is supported, prepares to open the most recent file

**Note:** Due to browser security restrictions, the File System Access API requires user interaction to grant file access permissions. The current implementation loads the settings but cannot automatically open files without user permission. A future enhancement could show a banner asking the user if they want to reopen their last file.

### UI Components

#### Settings Modal (`src/components/tw-settings-modal/settings-modal.jsx`)
Added a new "Auto-Open Last File" toggle in the File Management section:

```jsx
<AutoOpen
    value={props.autoOpenEnabled}
    onChange={props.onAutoOpenChange}
/>
```

**Features:**
- Boolean checkbox toggle
- Help text explaining the feature
- Positioned in a new "File Management" section
- Persists setting to localStorage on change

#### Settings Modal Container (`src/containers/tw-settings-modal.jsx`)
- Connects the UI to Redux state
- Handles auto-open toggle changes
- Syncs with localStorage

## Browser Compatibility

This feature requires the **File System Access API**, which is supported in:
- Chrome/Edge 86+
- Opera 72+

**Not supported in:**
- Firefox (as of early 2026)
- Safari (as of early 2026)

The feature gracefully degrades - if the API is not available, the setting is still shown but will have no effect.

## User Experience

### Enabling Auto-Open

1. Click the gear icon to open Advanced Settings
2. Scroll to the "File Management" section
3. Check the "Auto-Open Last File" checkbox
4. Close the settings modal

The setting is immediately saved to localStorage.

### How It Works

1. **First Use:** User saves a project using "Save As" - the file is tracked
2. **Subsequent Saves:** Each save updates the timestamp
3. **On Reload:** If auto-open is enabled, the most recent file is identified
4. **Permission Required:** User must grant permission to access the file (browser security requirement)

## Limitations & Future Enhancements

### Current Limitations

1. **Permission Required:** Browser security prevents automatic file access without user interaction
2. **No UI for File Selection:** Currently tracks up to 5 files but doesn't show them in UI
3. **No Manual Trigger:** No "Open Recent" menu option

### Planned Enhancements

1. **Recent Files Menu:** Show list of 5 most recent files with "Open" buttons
2. **Permission Prompt:** Show a banner on startup asking "Reopen last file?"
3. **File Validation:** Check if files still exist before attempting to open
4. **Keyboard Shortcuts:** Ctrl/Cmd + R to reopen last file
5. **File Thumbnails:** Show project thumbnails in recent files list

## Testing

### Manual Testing Steps

1. **Enable Feature:**
   - Open Advanced Settings
   - Enable "Auto-Open Last File"
   - Verify checkbox is checked

2. **Save a Project:**
   - Create a new project
   - Click "Save As"
   - Save as "test-project.sb3"
   - Check browser console for confirmation

3. **Reload Page:**
   - Refresh the page
   - Check browser console for auto-open attempt
   - Verify localStorage contains recent files

4. **Check LocalStorage:**
   ```javascript
   // In browser console
   localStorage.getItem('tw-recent-files')
   localStorage.getItem('tw-auto-open-enabled')
   ```

5. **Disable Feature:**
   - Open Advanced Settings
   - Disable "Auto-Open Last File"
   - Reload page
   - Verify auto-open doesn't trigger

### Developer Testing

```javascript
// Check Redux state
store.getState().scratchGui.tw.recentFiles
store.getState().scratchGui.tw.autoOpenEnabled

// Manually add a recent file
import {addRecentFile} from './src/lib/recent-files-manager.js';
const mockHandle = {name: 'test.sb3'};
addRecentFile(mockHandle);

// Check localStorage
localStorage.getItem('tw-recent-files');
```

## Security Considerations

1. **No Direct File Access:** The implementation never stores file contents, only metadata
2. **User Permission Required:** Browser enforces permission checks for file access
3. **No Remote Tracking:** All data stored locally in browser's localStorage
4. **Privacy-First:** File names and timestamps only - no project content stored

## Code Structure

```
src/
├── reducers/
│   └── tw.js                          # Redux state and actions
├── lib/
│   ├── recent-files-manager.js        # localStorage utilities
│   ├── auto-open-hoc.jsx              # Auto-open initialization
│   └── sb-file-uploader-hoc.jsx       # File loading with tracking
├── containers/
│   ├── tw-settings-modal.jsx          # Settings modal container
│   ├── sb3-downloader.jsx             # File saving with tracking
│   └── gui.jsx                        # Main GUI with AutoOpenHOC
└── components/
    └── tw-settings-modal/
        └── settings-modal.jsx         # Settings UI component
```

## Configuration

No configuration files needed. All settings are user-controlled through the UI.

## Troubleshooting

### Issue: Auto-open doesn't work
- **Check:** Is File System Access API supported? (Check browser)
- **Check:** Is the setting enabled in Advanced Settings?
- **Check:** Are there recent files in localStorage?
- **Solution:** Try in Chrome/Edge 86+

### Issue: Recent files not being tracked
- **Check:** Are you using the "Save As" feature?
- **Check:** Browser console for errors
- **Check:** localStorage for `tw-recent-files` key
- **Solution:** Ensure localStorage is not full or disabled

### Issue: Settings don't persist
- **Check:** Is localStorage enabled in browser?
- **Check:** Is the site in private/incognito mode?
- **Solution:** Use regular browsing mode, check localStorage quota

## API Reference

### `recent-files-manager.js`

```javascript
// Load recent files from localStorage
loadRecentFiles(): Array<{name: string, timestamp: number}>

// Save recent files to localStorage
saveRecentFiles(files: Array): void

// Add a file to recent list (max 5)
addRecentFile(fileHandle: FileSystemFileHandle): Array

// Load auto-open setting
loadAutoOpenSetting(): boolean

// Save auto-open setting
saveAutoOpenSetting(enabled: boolean): void

// Clear all recent files
clearRecentFiles(): void
```

### Redux Actions

```javascript
// Add/update recent files
addRecentFile(recentFiles: Array): Action

// Toggle auto-open
setAutoOpenEnabled(enabled: boolean): Action
```

## Contributing

When modifying this feature:

1. **Maintain backward compatibility** with localStorage structure
2. **Test in multiple browsers** (Chrome, Edge, Firefox)
3. **Handle errors gracefully** - never crash on localStorage failures
4. **Document any new settings** in this file
5. **Follow existing code style** in the codebase

## License

This feature is part of OmniBlocks and licensed under AGPLv3.
