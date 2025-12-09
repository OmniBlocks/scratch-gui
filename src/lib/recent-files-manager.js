import log from './log';

/**
 * Recent Files Manager
 * Handles persistence and management of recently opened files using localStorage
 * and File System Access API file handles
 */

const RECENT_FILES_STORAGE_KEY = 'omniblocks_recent_files';
const MAX_RECENT_FILES = 5;

/**
 * Recent file metadata structure:
 * {
 *   name: string,           // File name
 *   lastOpened: number,     // Timestamp when file was last opened
 *   handle: FileSystemFileHandle | null  // File handle (not persisted)
 * }
 */

/**
 * Check if we're running in a test environment
 * @returns {boolean} True if running in test environment
 */
const isTestEnvironment = () => {
    // Check for common test environment indicators
    if (typeof navigator !== 'undefined') {
        // Playwright/Selenium detection
        if (navigator.webdriver) return true;
        
        // Check for test-specific user agents
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('playwright') || userAgent.includes('selenium') || userAgent.includes('headless')) {
            return true;
        }
    }
    
    // Check for CI environment variables
    if (typeof process !== 'undefined' && process.env) {
        if (process.env.CI || process.env.NODE_ENV === 'test') return true;
    }
    
    // Check for test-specific URLs
    if (typeof window !== 'undefined' && window.location) {
        const hostname = window.location.hostname;
        const port = window.location.port;
        // Common test ports
        if (hostname === 'localhost' && (port === '8080' || port === '3000' || port === '8601')) {
            // Additional check for test-specific paths or query parameters
            if (window.location.search.includes('test') || window.location.pathname.includes('test')) {
                return true;
            }
        }
    }
    
    return false;
};

/**
 * Load recent files from localStorage
 * Note: File handles cannot be persisted, so they will be null
 * @returns {Array} Array of recent file metadata objects
 */
export const loadRecentFiles = () => {
    // Don't load recent files in test environment
    if (isTestEnvironment()) {
        return [];
    }
    
    try {
        const stored = localStorage.getItem(RECENT_FILES_STORAGE_KEY);
        if (!stored) return [];
        
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return [];
        
        // Ensure all items have required properties
        return parsed.filter(item => 
            item && 
            typeof item.name === 'string' && 
            typeof item.lastOpened === 'number'
        ).map(item => ({
            ...item,
            handle: null // File handles cannot be persisted
        }));
    } catch (error) {
        log.warn('Failed to load recent files from localStorage:', error);
        return [];
    }
};

/**
 * Save recent files to localStorage
 * @param {Array} recentFiles Array of recent file metadata objects
 */
export const saveRecentFiles = (recentFiles) => {
    // Don't save recent files in test environment
    if (isTestEnvironment()) {
        return;
    }
    
    try {
        // Remove file handles before saving (they cannot be serialized)
        const serializable = recentFiles.map(({handle, ...rest}) => rest);
        localStorage.setItem(RECENT_FILES_STORAGE_KEY, JSON.stringify(serializable));
    } catch (error) {
        log.warn('Failed to save recent files to localStorage:', error);
    }
};

/**
 * Add a file to the recent files list
 * @param {Array} currentRecentFiles Current recent files array
 * @param {string} fileName Name of the file
 * @param {FileSystemFileHandle} fileHandle File handle (optional)
 * @returns {Array} Updated recent files array
 */
export const addToRecentFiles = (currentRecentFiles, fileName, fileHandle = null) => {
    // Don't add files in test environment
    if (isTestEnvironment()) {
        return currentRecentFiles;
    }
    
    const newFile = {
        name: fileName,
        lastOpened: Date.now(),
        handle: fileHandle
    };
    
    // Remove any existing entry with the same name
    const filtered = currentRecentFiles.filter(file => file.name !== fileName);
    
    // Add new file at the beginning and limit to MAX_RECENT_FILES
    const updated = [newFile, ...filtered].slice(0, MAX_RECENT_FILES);
    
    // Save to localStorage
    saveRecentFiles(updated);
    
    return updated;
};

/**
 * Update file handle for an existing recent file
 * @param {Array} currentRecentFiles Current recent files array
 * @param {string} fileName Name of the file to update
 * @param {FileSystemFileHandle} fileHandle New file handle
 * @returns {Array} Updated recent files array
 */
export const updateRecentFileHandle = (currentRecentFiles, fileName, fileHandle) => {
    // Don't update files in test environment
    if (isTestEnvironment()) {
        return currentRecentFiles;
    }
    
    const updated = currentRecentFiles.map(file => 
        file.name === fileName 
            ? { ...file, handle: fileHandle, lastOpened: Date.now() }
            : file
    );
    
    // Save to localStorage (handles will be stripped)
    saveRecentFiles(updated);
    
    return updated;
};

/**
 * Remove a file from the recent files list
 * @param {Array} currentRecentFiles Current recent files array
 * @param {string} fileName Name of the file to remove
 * @returns {Array} Updated recent files array
 */
export const removeFromRecentFiles = (currentRecentFiles, fileName) => {
    // Don't modify files in test environment
    if (isTestEnvironment()) {
        return currentRecentFiles;
    }
    
    const updated = currentRecentFiles.filter(file => file.name !== fileName);
    saveRecentFiles(updated);
    return updated;
};

/**
 * Clear all recent files
 * @returns {Array} Empty array
 */
export const clearRecentFiles = () => {
    // Don't clear files in test environment
    if (isTestEnvironment()) {
        return [];
    }
    
    try {
        localStorage.removeItem(RECENT_FILES_STORAGE_KEY);
    } catch (error) {
        log.warn('Failed to clear recent files from localStorage:', error);
    }
    return [];
};

/**
 * Check if a file handle is still valid and accessible
 * @param {FileSystemFileHandle} fileHandle File handle to check
 * @returns {Promise<boolean>} True if file is accessible, false otherwise
 */
export const isFileHandleValid = async (fileHandle) => {
    // Always return false in test environment
    if (isTestEnvironment()) {
        return false;
    }
    
    if (!fileHandle) return false;
    
    try {
        // Try to get file info to check if handle is still valid
        await fileHandle.getFile();
        return true;
    } catch (error) {
        log.info('File handle is no longer valid:', error.message);
        return false;
    }
};

/**
 * Get the most recent file that has a valid file handle
 * @param {Array} recentFiles Array of recent files
 * @returns {Promise<Object|null>} Most recent valid file or null
 */
export const getMostRecentValidFile = async (recentFiles) => {
    // Always return null in test environment
    if (isTestEnvironment()) {
        return null;
    }
    
    for (const file of recentFiles) {
        if (file.handle && await isFileHandleValid(file.handle)) {
            return file;
        }
    }
    return null;
};

/**
 * Get file at specific index if it has a valid file handle
 * @param {Array} recentFiles Array of recent files
 * @param {number} index Index of file to get
 * @returns {Promise<Object|null>} File at index if valid, null otherwise
 */
export const getRecentFileAtIndex = async (recentFiles, index) => {
    // Always return null in test environment
    if (isTestEnvironment()) {
        return null;
    }
    
    if (index < 0 || index >= recentFiles.length) return null;
    
    const file = recentFiles[index];
    if (file.handle && await isFileHandleValid(file.handle)) {
        return file;
    }
    return null;
};

/**
 * Load auto-open setting from localStorage
 * @returns {boolean} Auto-open enabled state
 */
export const loadAutoOpenSetting = () => {
    // Always return false in test environment
    if (isTestEnvironment()) {
        return false;
    }
    
    try {
        const stored = localStorage.getItem('omniblocks_auto_open_enabled');
        return stored === 'true';
    } catch (error) {
        log.warn('Failed to load auto-open setting:', error);
        return false;
    }
};

/**
 * Save auto-open setting to localStorage
 * @param {boolean} enabled Auto-open enabled state
 */
export const saveAutoOpenSetting = (enabled) => {
    // Don't save settings in test environment
    if (isTestEnvironment()) {
        return;
    }
    
    try {
        localStorage.setItem('omniblocks_auto_open_enabled', enabled.toString());
    } catch (error) {
        log.warn('Failed to save auto-open setting:', error);
    }
};

/**
 * Load selected recent file index from localStorage
 * @returns {number} Selected recent file index (defaults to 0)
 */
export const loadSelectedRecentFileIndex = () => {
    // Always return 0 in test environment
    if (isTestEnvironment()) {
        return 0;
    }
    
    try {
        const stored = localStorage.getItem('omniblocks_selected_recent_file_index');
        const parsed = parseInt(stored, 10);
        return isNaN(parsed) ? 0 : Math.max(0, parsed);
    } catch (error) {
        log.warn('Failed to load selected recent file index:', error);
        return 0;
    }
};

/**
 * Save selected recent file index to localStorage
 * @param {number} index Selected recent file index
 */
export const saveSelectedRecentFileIndex = (index) => {
    // Don't save settings in test environment
    if (isTestEnvironment()) {
        return;
    }
    
    try {
        localStorage.setItem('omniblocks_selected_recent_file_index', index.toString());
    } catch (error) {
        log.warn('Failed to save selected recent file index:', error);
    }
};