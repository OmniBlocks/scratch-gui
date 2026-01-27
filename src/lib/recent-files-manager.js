/**
 * Manages recent files using IndexedDB and File System Access API
 * IndexedDB is used to store FileSystemFileHandle objects which cannot be serialized to localStorage
 */

const DB_NAME = 'omniblocks-recent-files';
const DB_VERSION = 1;
const STORE_NAME = 'fileHandles';
const AUTO_OPEN_KEY = 'tw-auto-open-enabled';
const MAX_RECENT_FILES = 5;

/**
 * Initialize IndexedDB database
 * @returns {Promise<IDBDatabase>} Database instance
 */
const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = event => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const objectStore = db.createObjectStore(STORE_NAME, {keyPath: 'id', autoIncrement: true});
                objectStore.createIndex('timestamp', 'timestamp', {unique: false});
                objectStore.createIndex('name', 'name', {unique: false});
            }
        };
    });
};

/**
 * Load recent files from IndexedDB
 * @returns {Promise<Array>} Array of recent file objects with metadata and handles
 */
export const loadRecentFiles = async () => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const objectStore = transaction.objectStore(STORE_NAME);
            const index = objectStore.index('timestamp');
            const request = index.openCursor(null, 'prev'); // Sort by timestamp descending
            
            const files = [];
            request.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor && files.length < MAX_RECENT_FILES) {
                    files.push({
                        id: cursor.value.id,
                        name: cursor.value.name,
                        timestamp: cursor.value.timestamp,
                        handle: cursor.value.handle
                    });
                    cursor.continue();
                } else {
                    resolve(files);
                }
            };
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error('Failed to load recent files from IndexedDB:', e);
        return [];
    }
};

/**
 * Load recent files metadata only (without handles) - for initial display
 * @returns {Promise<Array>} Array of recent file metadata
 */
export const loadRecentFilesMetadata = async () => {
    try {
        const files = await loadRecentFiles();
        return files.map(({name, timestamp}) => ({name, timestamp}));
    } catch (e) {
        console.error('Failed to load recent files metadata:', e);
        return [];
    }
};

/**
 * Add a file to recent files list in IndexedDB
 * @param {FileSystemFileHandle} fileHandle The file handle from File System Access API
 * @returns {Promise<Array>} Updated array of recent files metadata
 */
export const addRecentFile = async fileHandle => {
    try {
        const db = await initDB();
        
        // First, check if file with same name exists and remove it
        const existing = await loadRecentFiles();
        const duplicateId = existing.find(f => f.name === fileHandle.name)?.id;
        
        if (duplicateId) {
            await new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const objectStore = transaction.objectStore(STORE_NAME);
                const request = objectStore.delete(duplicateId);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        }
        
        // Add new file
        await new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.add({
                name: fileHandle.name,
                timestamp: Date.now(),
                handle: fileHandle
            });
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
        
        // Clean up old entries if we exceed MAX_RECENT_FILES
        const allFiles = await loadRecentFiles();
        if (allFiles.length > MAX_RECENT_FILES) {
            const toDelete = allFiles.slice(MAX_RECENT_FILES);
            await Promise.all(toDelete.map(file => 
                new Promise((resolve, reject) => {
                    const transaction = db.transaction([STORE_NAME], 'readwrite');
                    const objectStore = transaction.objectStore(STORE_NAME);
                    const request = objectStore.delete(file.id);
                    request.onsuccess = () => resolve();
                    request.onerror = () => reject(request.error);
                })
            ));
        }
        
        // Return metadata only for Redux state
        return await loadRecentFilesMetadata();
    } catch (e) {
        console.error('Failed to add recent file to IndexedDB:', e);
        return [];
    }
};

/**
 * Get file handle by name from IndexedDB
 * @param {string} fileName The name of the file to retrieve
 * @returns {Promise<FileSystemFileHandle|null>} The file handle or null if not found
 */
export const getFileHandleByName = async fileName => {
    try {
        const files = await loadRecentFiles();
        const file = files.find(f => f.name === fileName);
        return file ? file.handle : null;
    } catch (e) {
        console.error('Failed to get file handle:', e);
        return null;
    }
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
 * Clear all recent files from IndexedDB
 * @returns {Promise<void>}
 */
export const clearRecentFiles = async () => {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const objectStore = transaction.objectStore(STORE_NAME);
            const request = objectStore.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.error('Failed to clear recent files:', e);
    }
};
