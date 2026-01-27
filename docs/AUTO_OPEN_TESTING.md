# Auto-Open Feature Testing Guide

## Prerequisites

- Chrome 86+ or Edge 86+ (File System Access API required)
- OmniBlocks development build running locally
- Ability to save `.sb3` files to your file system

## Test Scenarios

### Scenario 1: Enable Auto-Open Setting

**Steps:**
1. Open OmniBlocks in Chrome/Edge
2. Click the ⚙️ gear icon in the top-right menu bar
3. Scroll down to the "File Management" section
4. Check the box next to "Auto-Open Last File"
5. Close the settings modal

**Expected Result:**
- Checkbox shows as checked ☑
- Setting is saved to localStorage immediately
- No errors in browser console

**Verification:**
```javascript
// In browser console
localStorage.getItem('tw-auto-open-enabled')
// Should return: "true"
```

---

### Scenario 2: Save a Project and Track It

**Steps:**
1. Create a new project in OmniBlocks
2. Add some blocks or sprites (optional)
3. Click "File" → "Save to your computer" (or use Ctrl+S)
4. Save the file as `test-project.sb3`
5. Check the browser console

**Expected Result:**
- File saves successfully
- Recent files list is updated
- Console may show confirmation message

**Verification:**
```javascript
// In browser console
JSON.parse(localStorage.getItem('tw-recent-files'))
// Should return array with your file:
// [{name: "test-project.sb3", timestamp: 1706381234567}]
```

---

### Scenario 3: Track Multiple Files

**Steps:**
1. Save first project as `project1.sb3`
2. Create/modify and save as `project2.sb3`
3. Create/modify and save as `project3.sb3`
4. Check recent files in localStorage

**Expected Result:**
- Up to 5 most recent files are tracked
- Files are ordered by most recent first
- Older files are automatically removed if > 5

**Verification:**
```javascript
const recent = JSON.parse(localStorage.getItem('tw-recent-files'));
console.log(recent.map(f => f.name));
// Should show: ["project3.sb3", "project2.sb3", "project1.sb3"]
```

---

### Scenario 4: Page Reload with Auto-Open Enabled

**Steps:**
1. Enable auto-open (Scenario 1)
2. Save a project (Scenario 2)
3. Reload the page (F5)
4. Check browser console immediately after load

**Expected Result:**
- Page loads normally
- Console shows auto-open initialization message
- Recent files are loaded from localStorage
- Auto-open setting is restored

**Console Output:**
```
[AutoOpenHOC] Settings loaded from localStorage
[AutoOpenHOC] Auto-open enabled: true
[AutoOpenHOC] Recent files: 1
[AutoOpenHOC] Most recent file: test-project.sb3
```

**Note:** Due to browser security, the file won't actually open automatically. This is expected behavior. A future enhancement will add a prompt asking the user if they want to reopen the file.

---

### Scenario 5: Disable Auto-Open

**Steps:**
1. Open Advanced Settings (⚙️)
2. Scroll to "File Management"
3. Uncheck "Auto-Open Last File"
4. Close settings modal
5. Reload page

**Expected Result:**
- Checkbox shows as unchecked ☐
- Setting is saved as disabled
- On reload, no auto-open attempt is made

**Verification:**
```javascript
localStorage.getItem('tw-auto-open-enabled')
// Should return: "false"
```

---

### Scenario 6: Open a File and Track It

**Steps:**
1. Click "File" → "Load from your computer"
2. Select an existing `.sb3` file
3. File loads successfully
4. Check recent files

**Expected Result:**
- File opens in editor
- File is added to recent files list
- Timestamp is updated if file was already in list

**Verification:**
```javascript
const recent = JSON.parse(localStorage.getItem('tw-recent-files'));
console.log(recent[0].name); // Should be your just-opened file
console.log(recent[0].timestamp); // Should be current timestamp
```

---

### Scenario 7: Recent Files Limit (5 Maximum)

**Steps:**
1. Save 6 different projects with unique names
2. Check recent files list

**Expected Result:**
- Only 5 most recent files are stored
- Oldest file is automatically removed
- No errors occur

**Verification:**
```javascript
const recent = JSON.parse(localStorage.getItem('tw-recent-files'));
console.log(recent.length); // Should be exactly 5
```

---

### Scenario 8: LocalStorage Error Handling

**Steps:**
1. Open browser dev tools
2. Go to Application → Storage → Local Storage
3. Right-click and "Clear"
4. Try to enable auto-open
5. Check for errors

**Expected Result:**
- Feature handles localStorage errors gracefully
- No crashes or console errors
- Settings still function (in-memory only)

---

### Scenario 9: Unsupported Browser (Firefox/Safari)

**Steps:**
1. Open OmniBlocks in Firefox or Safari
2. Open Advanced Settings
3. Check File Management section
4. Try to enable auto-open

**Expected Result:**
- Toggle is visible and functional
- Setting can be enabled/disabled
- No errors occur
- Feature simply has no effect (graceful degradation)

**Optional Enhancement:** Show browser compatibility warning

---

### Scenario 10: Help Text Display

**Steps:**
1. Open Advanced Settings
2. Find "Auto-Open Last File" toggle
3. Click the ❓ help icon next to it

**Expected Result:**
- Help text expands smoothly below the toggle
- Text is readable and well-formatted
- Click icon again to collapse help text

---

## Redux State Verification

At any time during testing, you can check the Redux state:

```javascript
// In browser console
const store = require('./src/index.js').default;
const state = store.getState();

// Check auto-open settings
console.log('Auto-open enabled:', state.scratchGui.tw.autoOpenEnabled);
console.log('Recent files:', state.scratchGui.tw.recentFiles);
```

---

## Common Issues and Solutions

### Issue: localStorage is full
**Solution:** Clear old data or increase browser storage quota

### Issue: File System Access API not supported
**Solution:** Use Chrome 86+ or Edge 86+

### Issue: Files not being tracked
**Solution:** 
- Make sure you're using "Save As" not "Download"
- Check that File System Access API is enabled
- Verify no browser extensions are blocking it

### Issue: Settings don't persist
**Solution:**
- Check if browser is in private/incognito mode
- Verify localStorage is not disabled
- Check browser storage quota

---

## Performance Testing

### localStorage Size Check
```javascript
// Check size of stored data
const recentFiles = localStorage.getItem('tw-recent-files');
console.log('Recent files size:', new Blob([recentFiles]).size, 'bytes');
// Should be < 500 bytes for 5 files
```

### Memory Leak Check
1. Enable auto-open
2. Save 20 projects sequentially
3. Check that only 5 are stored
4. Verify no memory growth in dev tools

---

## Browser Console Commands Reference

```javascript
// View all auto-open related data
console.table(JSON.parse(localStorage.getItem('tw-recent-files')));

// Clear all recent files
localStorage.removeItem('tw-recent-files');

// Toggle auto-open manually
localStorage.setItem('tw-auto-open-enabled', 'true'); // or 'false'

// Check feature availability
console.log('File System Access API:', 'showOpenFilePicker' in window);

// Manually add a test file (for debugging)
const testFiles = [
  {name: 'test1.sb3', timestamp: Date.now()},
  {name: 'test2.sb3', timestamp: Date.now() - 60000}
];
localStorage.setItem('tw-recent-files', JSON.stringify(testFiles));
```

---

## Acceptance Criteria

✅ **Must Have:**
- [ ] Toggle appears in Advanced Settings under "File Management"
- [ ] Toggle can be checked/unchecked
- [ ] Setting persists after page reload
- [ ] Files are tracked when saving via "Save As"
- [ ] Files are tracked when opening via "Load from computer"
- [ ] Maximum of 5 files stored
- [ ] No console errors in supported browsers
- [ ] Help text displays correctly

✅ **Should Have:**
- [ ] Graceful handling of localStorage errors
- [ ] Works in Chrome/Edge 86+
- [ ] Graceful degradation in unsupported browsers
- [ ] Recent files ordered by timestamp (newest first)
- [ ] Duplicate files update timestamp instead of creating new entry

✅ **Nice to Have:**
- [ ] Browser compatibility warning in unsupported browsers
- [ ] Visual indicator when file is tracked
- [ ] Keyboard shortcuts (future)
- [ ] Recent files UI list (future)

---

## Reporting Issues

When reporting issues, please include:

1. **Browser & Version** (e.g., Chrome 120.0.6099.129)
2. **Steps to Reproduce** (detailed sequence)
3. **Expected Behavior** (what should happen)
4. **Actual Behavior** (what actually happened)
5. **Console Output** (any errors or warnings)
6. **localStorage State** (result of verification commands)
7. **Screenshots** (if applicable)

Example issue report:
```
Browser: Chrome 121.0.0.0
Steps:
1. Enabled auto-open in settings
2. Saved project as "test.sb3"
3. Reloaded page
Expected: File should be tracked in recent files
Actual: Recent files array is empty
Console: No errors
localStorage: tw-recent-files = "[]"
```

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Verify all acceptance criteria met
2. 📸 Take screenshots of the UI
3. 📝 Document any edge cases found
4. 🐛 File issues for any bugs discovered
5. ✨ Suggest enhancements based on user experience
6. 🎉 Approve PR for merge!

---

## Future Enhancements to Test

When these features are added:

- **Recent Files Menu:** Test file selection UI
- **Auto-Open Prompt:** Test user permission flow
- **Keyboard Shortcuts:** Test Ctrl/Cmd+R to reopen
- **File Thumbnails:** Test thumbnail generation/display
- **Cross-tab Sync:** Test settings sync across multiple tabs
