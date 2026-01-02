# OmniBlocks Desktop - Enhanced Features Guide

This document outlines the desktop-exclusive features that justify creating an Electron app alongside the existing PWA version of OmniBlocks.

## Why Desktop App?

While OmniBlocks PWA already provides excellent offline functionality, service workers, and file handlers, the desktop version offers capabilities that are impossible or severely limited in web browsers:

### 🚀 **Desktop-Exclusive Features**

#### 1. **Enhanced File System Access**
- **Project Workspaces**: Create dedicated folders with organized asset management
- **Batch Operations**: Import/export multiple projects simultaneously  
- **Deep File Access**: Read/write anywhere on the system (not just Downloads folder)
- **File Watching**: Auto-reload projects when external files change
- **Native File Associations**: Double-click .sb3 files to open in OmniBlocks

#### 2. **Hardware Integration** (Planned Phase 2)
- **USB Device Communication**: Direct access to Arduino, micro:bit, Raspberry Pi
- **Serial Port Access**: Full robotics and IoT project integration
- **Enhanced Hardware Permissions**: Unrestricted camera/microphone access

#### 3. **Professional Development Tools** (Planned Phase 3)
- **Native Code Compilation**: Export Scratch projects as standalone executables
- **Advanced Debugging**: Memory profiling, performance analysis
- **Multi-window Support**: Separate windows for code, stage, debugger
- **Plugin System**: Load native Node.js modules as extensions

## Current Implementation (Phase 1)

### File System Enhancements

#### Project Workspaces
```javascript
// Create organized project workspace
const workspace = await desktopIntegration.createProjectWorkspace('MyProject');
// Creates: ~/Documents/OmniBlocks-Projects/MyProject/
//   ├── assets/     (sprites, sounds, backdrops)
//   ├── backups/    (automatic project backups)
//   └── project-info.json (metadata)
```

#### Batch Import
```javascript
// Import multiple .sb3 files at once
const results = await desktopIntegration.batchImportProjects();
// Each project gets its own workspace automatically
```

#### Native Dialogs
```javascript
// Use system file dialogs instead of web file picker
const saveResult = await desktopIntegration.showSaveDialog({
    title: 'Export Project',
    defaultPath: 'my-project.sb3',
    filters: [{ name: 'Scratch Projects', extensions: ['sb3'] }]
});
```

### File Association Handling
- Double-click .sb3 files to open directly in OmniBlocks Desktop
- System integration for "Open with OmniBlocks"
- Protocol handler for `omniblocks://` URLs

## Installation & Usage

### Development Setup
```bash
# Install desktop dependencies
npm install

# Run in development mode (starts web server + Electron)
npm run electron-dev

# Build desktop app
npm run electron-build
```

### Production Build
```bash
# Create distributable desktop app
npm run electron-dist

# Output: dist-electron/
#   ├── OmniBlocks Desktop-1.0.0.exe     (Windows)
#   ├── OmniBlocks Desktop-1.0.0.dmg     (macOS)
#   └── OmniBlocks Desktop-1.0.0.AppImage (Linux)
```

## Feature Comparison: PWA vs Desktop

| Feature | PWA Version | Desktop Version |
|---------|-------------|-----------------|
| **Offline Support** | ✅ Full | ✅ Full |
| **File Handlers** | ✅ Basic | ✅ Enhanced |
| **Project Import** | ✅ Single file | ✅ Batch import |
| **File System Access** | ⚠️ Downloads only | ✅ System-wide |
| **Project Workspaces** | ❌ | ✅ Organized folders |
| **Hardware Access** | ⚠️ Limited | ✅ Full USB/Serial |
| **Native Dialogs** | ❌ | ✅ System dialogs |
| **Multi-window** | ❌ | ✅ Planned |
| **Plugin System** | ❌ | ✅ Planned |
| **Native Compilation** | ❌ | ✅ Planned |

## Roadmap

### Phase 1: Enhanced File System ✅
- [x] Project workspace management
- [x] Batch import/export operations
- [x] Native file dialogs
- [x] File association handling

### Phase 2: Hardware Integration (Next)
- [ ] USB device communication
- [ ] Serial port access for robotics
- [ ] Enhanced camera/microphone permissions
- [ ] Device discovery and management

### Phase 3: Professional Tools (Future)
- [ ] Native code compilation (export as .exe/.app)
- [ ] Multi-window interface
- [ ] Plugin system for Node.js modules
- [ ] Advanced debugging and profiling
- [ ] Git integration for version control

## Technical Architecture

### Electron Structure
```
electron/
├── main.js          # Main Electron process
├── preload.js       # Secure IPC bridge
└── assets/          # Desktop app icons

src/
└── lib/
    └── desktop-integration.js  # Desktop API wrapper
```

### Security Model
- **Context Isolation**: Renderer process isolated from Node.js
- **Preload Script**: Secure API exposure via `contextBridge`
- **No Node Integration**: Renderer cannot directly access Node.js APIs
- **IPC Communication**: All desktop features via secure IPC channels

## Value Proposition

The desktop version provides compelling features that justify its existence alongside the PWA:

1. **Professional Workflow**: Project workspaces and batch operations for serious development
2. **Hardware Integration**: Full access to USB devices and serial ports for robotics/IoT
3. **System Integration**: Native file associations and system dialogs
4. **Future Extensibility**: Foundation for advanced features like native compilation and plugins

This creates a clear distinction: **PWA for casual use, Desktop for professional development**.

