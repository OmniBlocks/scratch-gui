# JavaScript Execution Security

This document explains the `runJavaScript` security permission added to OmniBlocks.

## Overview

The `runJavaScript` permission allows extensions to execute arbitrary JavaScript code with user consent. This is a security-sensitive operation that requires explicit user approval.

## Usage

Extensions can request JavaScript execution permission through the security manager:

```javascript
const securityManager = this.runtime.extensionManager.securityManager;
const allowed = await securityManager.canRunJavaScript();

if (allowed) {
    // Execute JavaScript code
    eval(someJavaScriptCode);
} else {
    // Handle permission denied
    console.log('JavaScript execution not permitted');
}
```

## Security Considerations

- **User Consent**: The user must explicitly allow JavaScript execution through a modal dialog
- **Session Persistence**: Permission is cached for the current session to avoid repeated prompts
- **Trust Warning**: The modal clearly warns users about the security implications
- **Extension Responsibility**: Extensions should handle permission denial gracefully

## Modal Dialog

When an extension requests JavaScript execution permission, users see a modal with:

1. **Title**: "The project wants to execute JavaScript code."
2. **Warning**: Explanation of security risks and recommendation to only allow trusted extensions
3. **Permission Info**: Information that permission will be cached for the session
4. **Allow/Deny Buttons**: User choice to grant or deny permission

## Implementation Details

### Files Modified

- `src/lib/tw-security-manager-constants.js`: Added `RunJavaScript` constant
- `src/containers/tw-security-manager.jsx`: Added `canRunJavaScript` method
- `src/components/tw-security-manager-modal/run-javascript.jsx`: New modal component
- `src/components/tw-security-manager-modal/security-manager-modal.jsx`: Updated router

### Security Manager Method

```javascript
async canRunJavaScript() {
    if (!allowedRunJavaScript) {
        const {showModal} = await this.acquireModalLock();
        allowedRunJavaScript = await showModal(SecurityModals.RunJavaScript);
    }
    return allowedRunJavaScript;
}
```

## Example Extension

See `src/examples/extensions/javascript-test-extension.js` for a complete example of how to use the JavaScript execution permission in an extension.

## Best Practices

1. **Check Permission First**: Always check if permission is granted before executing JavaScript
2. **Handle Errors**: Wrap JavaScript execution in try-catch blocks
3. **User Feedback**: Provide clear feedback when permission is denied
4. **Minimal Scope**: Only request permission when actually needed
5. **Security Awareness**: Document any JavaScript execution in your extension's description

## Related Issues

- Issue #385: Add "runJavaScript" to security manager