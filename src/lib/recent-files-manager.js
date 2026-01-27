/**
 * Manages recent files using localStorage and File System Access API
 */

const RECENT_FILES_KEY = 'tw-recent-files';
const AUTO_OPEN_KEY = 'tw-auto-open-enabled';
const MAX_RECENT_FILES = 5;

/**
 * Load recent files metadata from localStorage
 * @returns {Array} Array of recent file metadata
 */
export const loadRecentFiles = () => {
    try {
        const stored = localStorage.getItem(RECENT_FILES_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.error('Failed to load recent files:', e);
    }
    return [];
};

/**
 * Save recent files metadata to localStorage
 * @param {Array} files Array of file metadata objects
 */
export const saveRecentFiles = files => {
    try {
        localStorage.setItem(RECENT_FILES_KEY, JSON.stringify(files));
    } catch (e) {
        console.error('Failed to save recent files:', e);
    }
};

/**
 * Add a file to recent files list
 * NOTE: This function only stores file metadata (name and timestamp), not the
 * FileSystemFileHandle itself. Due to localStorage limitations, handles cannot
 * be serialized. For actual file reopening functionality, the application would
 * need to use IndexedDB to store handles, or implement a user-triggered prompt
 * to request file access permission when the user wants to reopen a recent file.
 * 
 * @param {FileSystemFileHandle} fileHandle The file handle from File System Access API
 * @returns {Array} Updated array of recent files metadata
 */
export const addRecentFile = fileHandle => {
    const recentFiles = loadRecentFiles();
    
    // Create metadata object (can't serialize FileSystemFileHandle directly)
    const newFile = {
        name: fileHandle.name,
        timestamp: Date.now()
    };
    
    // Remove any existing entry with same name
    const filtered = recentFiles.filter(f => f.name !== fileHandle.name);
    
    // Add to front and limit to MAX_RECENT_FILES
    const updated = [newFile, ...filtered].slice(0, MAX_RECENT_FILES);
    
    saveRecentFiles(updated);
    return updated;
};

/**
 * Load auto-open setting from localStorage
 * @returns {boolean} Whether auto-open is enabled
 */
export const loadAutoOpenSetting = () => {
    try {
        const stored = localStorage.getItem(AUTO_OPEN_KEY);
        return stored === 'true';
    } catch (e) {
        console.error('Failed to load auto-open setting:', e);
    }
    return false;
};

/**
 * Save auto-open setting to localStorage
 * @param {boolean} enabled Whether auto-open should be enabled
 */
export const saveAutoOpenSetting = enabled => {
    try {
        localStorage.setItem(AUTO_OPEN_KEY, String(enabled));
    } catch (e) {
        console.error('Failed to save auto-open setting:', e);
    }
};

/**
 * Clear all recent files from localStorage
 */
export const clearRecentFiles = () => {
    try {
        localStorage.removeItem(RECENT_FILES_KEY);
    } catch (e) {
        console.error('Failed to clear recent files:', e);
    }
};
