const { contextBridge, ipcRenderer } = require('electron');

// Expose desktop-exclusive APIs to the renderer process
contextBridge.exposeInMainWorld('omniBlocksDesktop', {
    // File system operations
    createWorkspace: (projectName) => 
        ipcRenderer.invoke('desktop:create-workspace', projectName),
    
    batchImport: () => 
        ipcRenderer.invoke('desktop:batch-import'),
    
    showSaveDialog: (options) => 
        ipcRenderer.invoke('desktop:save-dialog', options),
    
    showOpenDialog: (options) => 
        ipcRenderer.invoke('desktop:open-dialog', options),
    
    // Event listeners
    onOpenFile: (callback) => {
        ipcRenderer.on('desktop:open-file', (event, filePath) => {
            callback(filePath);
        });
    },
    
    // Platform detection
    platform: process.platform,
    
    // Version info
    versions: {
        electron: process.versions.electron,
        node: process.versions.node,
        chrome: process.versions.chrome
    },
    
    // Desktop feature flags
    features: {
        enhancedFileSystem: true,
        batchOperations: true,
        workspaceManagement: true,
        nativeDialogs: true,
        fileAssociations: true,
        hardwareAccess: false, // Will be enabled in Phase 2
        nativeCompilation: false // Will be enabled in Phase 2
    }
});

