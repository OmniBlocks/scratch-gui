const { app, BrowserWindow, Menu, dialog, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs').promises;

let mainWindow;
const isDev = process.env.NODE_ENV === 'development';

// Enhanced file operations for desktop version
class DesktopFileManager {
    async createWorkspaceFolder(projectName) {
        const workspacePath = path.join(app.getPath('documents'), 'OmniBlocks-Projects', projectName);
        
        try {
            await fs.mkdir(workspacePath, { recursive: true });
            await fs.mkdir(path.join(workspacePath, 'assets'), { recursive: true });
            await fs.mkdir(path.join(workspacePath, 'backups'), { recursive: true });
            
            const metadata = {
                name: projectName,
                created: new Date().toISOString(),
                type: 'omniblocks-workspace'
            };
            
            await fs.writeFile(
                path.join(workspacePath, 'project-info.json'),
                JSON.stringify(metadata, null, 2)
            );
            
            return workspacePath;
        } catch (error) {
            throw new Error(`Failed to create workspace: ${error.message}`);
        }
    }

    async importMultipleProjects(filePaths) {
        const results = [];
        
        for (const filePath of filePaths) {
            try {
                const projectName = path.basename(filePath, '.sb3');
                const workspacePath = await this.createWorkspaceFolder(projectName);
                
                const projectData = await fs.readFile(filePath);
                await fs.writeFile(
                    path.join(workspacePath, `${projectName}.sb3`),
                    projectData
                );
                
                results.push({
                    success: true,
                    projectName,
                    workspacePath
                });
            } catch (error) {
                results.push({
                    success: false,
                    error: error.message,
                    filePath
                });
            }
        }
        
        return results;
    }
}

const fileManager = new DesktopFileManager();

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets', 'icon.png'),
        title: 'OmniBlocks Desktop - Enhanced IDE',
        show: false
    });

    // Load the application
    const startUrl = isDev 
        ? 'http://localhost:8601/editor.html'
        : `file://${path.join(__dirname, '..', 'build', 'editor.html')}`;
    
    mainWindow.loadURL(startUrl);

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

// Application lifecycle
app.whenReady().then(() => {
    createMainWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});

// Desktop-exclusive IPC handlers
ipcMain.handle('desktop:create-workspace', async (event, projectName) => {
    try {
        const workspacePath = await fileManager.createWorkspaceFolder(projectName);
        return { success: true, path: workspacePath };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('desktop:batch-import', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openFile', 'multiSelections'],
        filters: [
            { name: 'Scratch Projects', extensions: ['sb3', 'sb2'] }
        ],
        title: 'Import Multiple Projects'
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
        return await fileManager.importMultipleProjects(result.filePaths);
    }
    
    return [];
});

ipcMain.handle('desktop:save-dialog', async (event, options) => {
    return await dialog.showSaveDialog(mainWindow, options);
});

ipcMain.handle('desktop:open-dialog', async (event, options) => {
    return await dialog.showOpenDialog(mainWindow, options);
});

// File association handling
app.on('open-file', (event, filePath) => {
    event.preventDefault();
    if (mainWindow && filePath.endsWith('.sb3')) {
        mainWindow.webContents.send('desktop:open-file', filePath);
    }
});

