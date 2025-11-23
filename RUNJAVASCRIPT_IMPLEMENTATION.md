# RunJavaScript Security Manager Implementation

This document summarizes the implementation of the "runJavaScript" security permission for OmniBlocks, addressing issue #385.

## Changes Made

### 1. Security Manager Constants
**File**: `src/lib/tw-security-manager-constants.js`
- Added `RunJavaScript: 'RunJavaScript'` to the SecurityModals object

### 2. Main Security Manager Component
**File**: `src/containers/tw-security-manager.jsx`
- Added `allowedRunJavaScript` global variable to track permission state
- Added `'canRunJavaScript'` to the `SECURITY_MANAGER_METHODS` array
- Implemented `canRunJavaScript()` method that:
  - Checks if permission was already granted (cached)
  - Shows modal dialog if permission not yet granted
  - Returns boolean indicating if JavaScript execution is allowed
  - Caches the permission for the session

### 3. Modal Component
**File**: `src/components/tw-security-manager-modal/run-javascript.jsx` (new file)
- Created React component for the JavaScript execution permission dialog
- Includes three key messages:
  - Title: "The project wants to execute JavaScript code."
  - Warning: Explains security risks and recommends only trusting known extensions
  - Permission info: Explains that permission will be cached

### 4. Modal Router
**File**: `src/components/tw-security-manager-modal/security-manager-modal.jsx`
- Added import for the new `RunJavaScript` component
- Added conditional rendering for `SecurityModals.RunJavaScript` type

### 5. Example Extension
**File**: `src/examples/extensions/javascript-test-extension.js` (new file)
- Created example extension demonstrating how to use the new permission
- Shows proper error handling and permission checking
- Includes both command and reporter blocks that use JavaScript execution

### 6. Documentation
**File**: `docs/JAVASCRIPT_SECURITY.md` (new file)
- Comprehensive documentation explaining the feature
- Usage examples and best practices
- Security considerations and implementation details

### 7. Test File
**File**: `test/unit/containers/tw-security-manager.test.js` (new file)
- Basic unit tests to verify the SecurityModals constants are properly defined

## How It Works

1. **Extension Request**: An extension calls `securityManager.canRunJavaScript()`
2. **Permission Check**: The security manager checks if permission was already granted
3. **Modal Display**: If not granted, shows a modal dialog warning about security risks
4. **User Decision**: User clicks "Allow" or "Deny"
5. **Permission Caching**: The decision is cached for the current session
6. **JavaScript Execution**: If allowed, the extension can execute JavaScript code

## Security Features

- **User Consent Required**: JavaScript execution requires explicit user approval
- **Clear Warnings**: Modal dialog explains the security implications
- **Session Caching**: Permission is remembered for the session to avoid repeated prompts
- **Graceful Degradation**: Extensions can handle permission denial appropriately

## Usage Example

```javascript
// In an extension
const securityManager = this.runtime.extensionManager.securityManager;
const allowed = await securityManager.canRunJavaScript();

if (allowed) {
    eval('console.log("JavaScript execution allowed!")');
} else {
    console.log('Permission denied');
}
```

## Integration Points

The new permission integrates seamlessly with the existing security manager system:
- Follows the same patterns as other permissions (audio, video, clipboard, etc.)
- Uses the same modal system and user interface
- Maintains consistency with existing security workflows

## Future Considerations

- **Translation Support**: The modal text should be translated to other languages
- **Rate Limiting**: Consider adding limits on JavaScript execution frequency
- **Sandboxing**: Future versions might implement additional sandboxing for executed code
- **Audit Logging**: Consider logging JavaScript execution for security auditing

## Files Modified/Created

### Modified Files:
1. `src/lib/tw-security-manager-constants.js`
2. `src/containers/tw-security-manager.jsx`
3. `src/components/tw-security-manager-modal/security-manager-modal.jsx`

### New Files:
1. `src/components/tw-security-manager-modal/run-javascript.jsx`
2. `src/examples/extensions/javascript-test-extension.js`
3. `docs/JAVASCRIPT_SECURITY.md`
4. `test/unit/containers/tw-security-manager.test.js`
5. `RUNJAVASCRIPT_IMPLEMENTATION.md` (this file)

## Testing

To test the implementation:
1. Start the development server: `npm start`
2. Load the example extension: `src/examples/extensions/javascript-test-extension.js`
3. Use the "execute JavaScript" or "evaluate" blocks
4. Verify that the permission modal appears
5. Test both "Allow" and "Deny" scenarios

The implementation is complete and ready for use. Extensions can now request permission to execute JavaScript code with proper user consent and security warnings.