/**
 * Recent files manager using File System Access API and localStorage
 */

import {verifyFileHandle, getStorableFileInfo} from './tw-file-system-api';

// Constants
export const RECENT_FILES_KEY = 'tw:recent-files';
export const AUTO_OPEN_KEY = 'tw:auto-open';
export const MAX_RECENT_FILES = 5;

/**
 * Class to manage recent files
 */
export class RecentFilesManager {
    constructor () {
        this.recentFiles = [];
        this.load();
    }

    /**
     * Load recent files from localStorage
     */
    load () {
        try {
            const stored = window.localStorage.getItem(RECENT_FILES_KEY);
            if (stored) {
                this.recentFiles = JSON.parse(stored);
                // Clean up any files that can't be accessed
                this.cleanupInaccessibleFiles();
            }
        } catch {
            this.recentFiles = [];
        }
    }

    /**
     * Save recent files to localStorage
     */
    save () {
        try {
            window.localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(this.recentFiles));
        } catch {
            // Ignore storage errors
        }
    }

    /**
     * Add a file to recent files list
     * @param {File|FileSystemFileHandle} fileOrHandle - File or file handle to add
     */
    async add (fileOrHandle) {
        try {
            // Remove existing entry for this file if it exists
            const normalizedName = fileOrHandle.name?.toLowerCase() || '';
            this.recentFiles = this.recentFiles.filter(
                file => file.name?.toLowerCase() !== normalizedName
            );

            // Get storable info
            const storableInfo = await getStorableFileInfo(fileOrHandle);
            if (storableInfo) {
                // Add to beginning of array (most recent first)
                this.recentFiles.unshift({
                    ...storableInfo,
                    openedAt: Date.now()
                });

                // Limit to MAX_RECENT_FILES
                this.recentFiles = this.recentFiles.slice(0, MAX_RECENT_FILES);

                this.save();
            }
        } catch (error) {
            console.error('Failed to add recent file:', error);
        }
    }

    /**
     * Get recent files list
     * @returns {Array} Array of recent file info
     */
    getFiles () {
        return this.recentFiles;
    }

    /**
     * Clear recent files list
     */
    clear () {
        this.recentFiles = [];
        this.save();
    }

    /**
     * Clean up files that are no longer accessible
     */
    async cleanupInaccessibleFiles () {
        const validFiles = [];
        
        for (const file of this.recentFiles) {
            let isValid = false;

            // Check File System Access API handles
            if (file.type === 'file-system-access' && file.handle) {
                try {
                    const verification = await verifyFileHandle(file.handle);
                    isValid = verification.isValid;
                } catch {
                    isValid = false;
                }
            // Regular files are valid (though we may not have full access)
            } else if (file.type === 'file') {
                isValid = true;
            }

            if (isValid) {
                validFiles.push(file);
            }
        }

        if (validFiles.length !== this.recentFiles.length) {
            this.recentFiles = validFiles;
            this.save();
        }
    }
}

// Global instance
const recentFilesManager = new RecentFilesManager();

/**
 * Add a file to recent files
 * @param {File|FileSystemFileHandle} fileOrHandle - File or file handle to add
 */
export const addRecentFile = async fileOrHandle => {
    await recentFilesManager.add(fileOrHandle);
};

/**
 * Get recent files list
 * @returns {Array} Array of recent file info
 */
export const getRecentFiles = () => recentFilesManager.getFiles();

/**
 * Clear recent files list
 */
export const clearRecentFiles = () => {
    recentFilesManager.clear();
};

// eslint-disable-next-line valid-jsdoc
/**
 * Get storable file info
 * @param {File|FileSystemFileHandle} fileOrHandle - File or file handle
 * @returns {Promise<object|null>} Storable file info
 */
export const getStorableInfo = fileOrHandle => getStorableFileInfo(fileOrHandle);

/**
 * Check if auto-open is enabled
 * @returns {boolean} True if auto-open is enabled
 */
export const isAutoOpenEnabled = () => {
    try {
        const value = window.localStorage.getItem(AUTO_OPEN_KEY);
        return value === 'true';
    } catch {
        return false;
    }
};

/**
 * Set auto-open enabled state
 * @param {boolean} enabled - Whether to enable auto-open
 */
export const setAutoOpenEnabled = enabled => {
    try {
        window.localStorage.setItem(AUTO_OPEN_KEY, String(enabled));
    } catch {
        // Ignore storage errors
    }
};

/**
 * Try to open the most recent file automatically
 * @param {Function} openFile - Function to open a file (receives {name, handle} or File)
 * @returns {Promise<object>} Result with success and file info
 */
export const autoOpenMostRecent = async openFile => {
    try {
        if (!isAutoOpenEnabled()) {
            return {success: false, reason: 'auto-open-disabled'};
        }

        const recentFiles = getRecentFiles();
        if (recentFiles.length === 0) {
            return {success: false, reason: 'no-recent-files'};
        }

        const mostRecent = recentFiles[0];
        
        // Try to open using File System Access API handle
        if (mostRecent.type === 'file-system-access' && mostRecent.handle) {
            const verification = await verifyFileHandle(mostRecent.handle);
            if (verification.isValid) {
                const file = await mostRecent.handle.getFile();
                await openFile(file);
                return {
                    success: true,
                    file: {
                        name: mostRecent.name,
                        handle: mostRecent.handle
                    }
                };
            }
        }

        return {success: false, reason: 'file-not-accessible'};
    } catch (error) {
        console.error('Auto-open failed:', error);
        return {success: false, reason: 'error', error: error.message};
    }
};

// eslint-disable-next-line valid-jsdoc
/**
 * Create a dialog to choose from recent files
 * @param {Function} onFileSelected - Callback when a file is selected
 * @returns {Promise<void>}
 */
export const showRecentFilesDialog = async onFileSelected => {
    try {
        const recentFiles = getRecentFiles();
        if (recentFiles.length === 0) {
            // eslint-disable-next-line no-alert
            window.alert('No recent files available.');
            return;
        }

        // Show dialog in a way that works with React
        const fileList = recentFiles.map((file, index) => `${index + 1}. ${file.name}`).join('\n');
        // eslint-disable-next-line no-alert
        const choice = window.prompt(
            `Select a file to open (1-${MAX_RECENT_FILES}):\n\n${fileList}\n\nEnter the number of the file to open:`
        );
        
        if (!choice) return;

        const fileIndex = parseInt(choice, 10) - 1;
        if (isNaN(fileIndex) || fileIndex < 0 || fileIndex >= recentFiles.length) {
            // eslint-disable-next-line no-alert
            window.alert('Invalid selection.');
            return;
        }

        const selectedFile = recentFiles[fileIndex];
        
        // If it's a file system access handle, verify it first
        if (selectedFile.type === 'file-system-access' && selectedFile.handle) {
            const verification = await verifyFileHandle(selectedFile.handle);
            if (!verification.isValid) {
                // eslint-disable-next-line no-alert
                window.alert(
                    `Cannot access '${selectedFile.name}'. The file may have been moved or ` +
                    'permissions revoked.'
                );
                return;
            }
        }

        onFileSelected(selectedFile);
    } catch (error) {
        console.error('Failed to show recent files dialog:', error);
        // eslint-disable-next-line no-alert
        window.alert('Failed to select recent file. See console for details.');
    }
};

export default recentFilesManager;
