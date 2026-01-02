# OmniBlocks Desktop Implementation Guide

This guide explains how to implement and extend the desktop-exclusive features for OmniBlocks.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Desktop Icons
Copy appropriate icon files to `electron/assets/`:
- `icon.png` (512x512)
- `icon.ico` (Windows)
- `icon.icns` (macOS)
- `sb3-icon.*` (file association icons)

### 3. Development Mode
```bash
# Start both web server and Electron
npm run electron-dev
```

### 4. Build Desktop App
```bash
# Create production build
npm run electron-build
```

## Key Desktop Features Implemented

### Enhanced File System Access

**Project Workspaces**: Organized project folders with assets, backups, and metadata
```javascript
// Usage in renderer process
import desktopIntegration from '../lib/desktop-integration.js';

if (desktopIntegration.isDesktopEnvironment()) {
    const workspace = await desktopIntegration.createProjectWorkspace('MyProject');
    console.log('Workspace created at:', workspace.path);
}
```

**Batch Import**: Import multiple .sb3 files simultaneously
```javascript
const results = await desktopIntegration.batchImportProjects();
results.forEach(result => {
    if (result.success) {
        console.log('Imported:', result.projectName);
    }
});
```

**Native Dialogs**: System file dialogs instead of web file picker
```javascript
const saveResult = await desktopIntegration.showSaveDialog({
    title: 'Export Project',
    filters: [{ name: 'Scratch Projects', extensions: ['sb3'] }]
});
```

### File Association Handling
- Double-click .sb3 files opens OmniBlocks Desktop
- System "Open with" integration
- Protocol handler for `omniblocks://` URLs

## Architecture Overview

### Main Process (`electron/main.js`)
- Creates application window
- Handles file system operations
- Manages IPC communication
- Implements desktop-exclusive features

### Preload Script (`electron/preload.js`)
- Secure bridge between main and renderer processes
- Exposes desktop APIs via `window.omniBlocksDesktop`
- Maintains security through context isolation

### Desktop Integration (`src/lib/desktop-integration.js`)
- Wrapper for desktop APIs
- Feature detection and graceful fallbacks
- Consistent interface for renderer process

## Adding New Desktop Features

### 1. Add IPC Handler (Main Process)
```javascript
// In electron/main.js
ipcMain.handle('desktop:new-feature', async (event, ...args) => {
    // Implement desktop-exclusive functionality
    return result;
});
```

### 2. Expose API (Preload Script)
```javascript
// In electron/preload.js
contextBridge.exposeInMainWorld('omniBlocksDesktop', {
    newFeature: (...args) => ipcRenderer.invoke('desktop:new-feature', ...args)
});
```

### 3. Add Integration Method
```javascript
// In src/lib/desktop-integration.js
async newFeature(...args) {
    if (!this.isDesktop) {
        throw new Error('Feature only available in desktop version');
    }
    return await window.omniBlocksDesktop.newFeature(...args);
}
```

## Security Considerations

- **Context Isolation**: Renderer process cannot directly access Node.js
- **Preload Script**: Only approved APIs exposed to renderer
- **IPC Validation**: All inputs validated in main process
- **Principle of Least Privilege**: Minimal permissions for each operation

## Future Enhancements

### Phase 2: Hardware Integration
- USB device communication
- Serial port access
- Enhanced hardware permissions

### Phase 3: Professional Tools
- Native code compilation
- Multi-window support
- Plugin system
- Advanced debugging tools

## Troubleshooting

### Common Issues
1. **Icons not showing**: Ensure icon files exist in `electron/assets/`
2. **File associations not working**: Check platform-specific setup
3. **IPC errors**: Verify preload script is loaded correctly
4. **Build failures**: Check Electron and electron-builder versions

### Debug Mode
```bash
# Enable Electron debug output
DEBUG=electron* npm run electron-dev
```

This implementation provides a solid foundation for desktop-exclusive features while maintaining compatibility with the existing PWA version.

