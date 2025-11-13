/**
 * IndexedDB API for managing recent projects using File System Access API handles
 * Follows patterns from tw-restore-point-api.js and tw-local-backpack-api.js
 */

// Database Configuration
const DATABASE_NAME = 'TW_RecentProjects';
const DATABASE_VERSION = 1;
const STORE_NAME = 'recent_projects';
const MAX_RECENT_PROJECTS = 5;

/**
 * @typedef RecentProject
 * @property {FileSystemFileHandle} handle - File System Access API handle
 * @property {string} name - Display name of the file
 * @property {number} timestamp - Last accessed timestamp
 */

/** @type {IDBDatabase|null} */
let _cachedDB = null;

/**
 * @returns {Promise<IDBDatabase|null>} IDB database with store created, or null if unavailable
 */
const getDatabase = () => {
    if (_cachedDB) {
        return Promise.resolve(_cachedDB);
    }

    if (typeof indexedDB === 'undefined') {
        return Promise.resolve(null);
    }

    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

        request.onupgradeneeded = () => {
            const db = request.result;
            const store = db.createObjectStore(STORE_NAME, {
                keyPath: 'id',
                autoIncrement: true
            });
            // Create index on timestamp for efficient sorting
            store.createIndex('timestamp', 'timestamp', { unique: false });
        };

        request.onsuccess = () => {
            _cachedDB = request.result;
            resolve(request.result);
        };

        request.onerror = () => {
            // Don't reject - return null to gracefully handle unavailable IndexedDB
            resolve(null);
        };
    });
};

/**
 * Check if a file handle has the required permissions
 * @param {FileSystemFileHandle} fileHandle - File handle to check
 * @returns {Promise<boolean>} True if permission is granted
 */
const checkFilePermission = async fileHandle => {
    try {
        const permission = await fileHandle.queryPermission({ mode: 'read' });
        if (permission === 'granted') {
            return true;
        }
        
        // Try to request permission
        const requested = await fileHandle.requestPermission({ mode: 'read' });
        return requested === 'granted';
    } catch (error) {
        // Handle AbortError (user cancelled) or other permission errors
        return false;
    }
};

/**
 * Add a recent project to the database
 * @param {FileSystemFileHandle} fileHandle - File handle to add
 * @param {number} timestamp - Timestamp when file was accessed
 * @returns {Promise<RecentProject[]|null>} Updated list of recent projects, or null on error
 */
const addRecentProject = async (fileHandle, timestamp) => {
    const db = await getDatabase();
    if (!db) {
        return null;
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        transaction.onerror = () => {
            // Don't reject - return null to gracefully handle errors
            resolve(null);
        };

        const store = transaction.objectStore(STORE_NAME);
        
        // First, check if this file already exists (by name)
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
            const existingProjects = getAllRequest.result || [];
            
            // Remove existing entry with same name if it exists
            const existingProject = existingProjects.find(p => p.name === fileHandle.name);
            
            const addNewProject = () => {
                const newProject = {
                    handle: fileHandle,
                    name: fileHandle.name,
                    timestamp: timestamp
                };
                
                const addRequest = store.add(newProject);
                addRequest.onsuccess = () => {
                    // After adding, enforce max limit by removing oldest entries
                    enforceMaxLimit(store, resolve);
                };
            };

            if (existingProject) {
                // Update existing project's timestamp and move to top
                const updateRequest = store.delete(existingProject.id);
                updateRequest.onsuccess = () => {
                    addNewProject();
                };
            } else {
                addNewProject();
            }
        };
    });
};

/**
 * Enforce maximum number of recent projects by removing oldest entries
 * @param {IDBObjectStore} store - Object store to clean up
 * @param {Function} resolve - Promise resolve function
 */
const enforceMaxLimit = (store, resolve) => {
    const getAllRequest = store.getAll();
    getAllRequest.onsuccess = () => {
        const allProjects = getAllRequest.result || [];
        
        if (allProjects.length <= MAX_RECENT_PROJECTS) {
            // Return sorted list (newest first)
            const sortedProjects = allProjects
                .sort((a, b) => b.timestamp - a.timestamp)
                .map(p => ({
                    id: p.id,
                    handle: p.handle,
                    name: p.name,
                    timestamp: p.timestamp
                }));
            resolve(sortedProjects);
            return;
        }

        // Sort by timestamp and keep only the newest MAX_RECENT_PROJECTS
        const sortedProjects = allProjects.sort((a, b) => b.timestamp - a.timestamp);
        const projectsToKeep = sortedProjects.slice(0, MAX_RECENT_PROJECTS);
        const projectsToDelete = sortedProjects.slice(MAX_RECENT_PROJECTS);

        // Delete old projects
        let deletedCount = 0;
        const deleteNext = () => {
            if (deletedCount >= projectsToDelete.length) {
                // All old projects deleted, return the kept projects
                const result = projectsToKeep.map(p => ({
                    id: p.id,
                    handle: p.handle,
                    name: p.name,
                    timestamp: p.timestamp
                }));
                resolve(result);
                return;
            }

            const deleteRequest = store.delete(projectsToDelete[deletedCount].id);
            deleteRequest.onsuccess = () => {
                deletedCount++;
                deleteNext();
            };
        };

        deleteNext();
    };
};

/**
 * Get all recent projects from the database
 * @returns {Promise<RecentProject[]|null>} List of recent projects sorted by timestamp (newest first), or null on error
 */
const getRecentProjects = async () => {
    const db = await getDatabase();
    if (!db) {
        return null;
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        transaction.onerror = () => {
            // Don't reject - return null to gracefully handle errors
            resolve(null);
        };

        const store = transaction.objectStore(STORE_NAME);
        const getAllRequest = store.getAll();
        
        getAllRequest.onsuccess = () => {
            const projects = getAllRequest.result || [];
            
            // Sort by timestamp (newest first) and limit to MAX_RECENT_PROJECTS
            const sortedProjects = projects
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, MAX_RECENT_PROJECTS)
                .map(p => ({
                    id: p.id,
                    handle: p.handle,
                    name: p.name,
                    timestamp: p.timestamp
                }));
            
            resolve(sortedProjects);
        };
    });
};

/**
 * Remove a specific recent project from the database
 * @param {number} id - ID of the project to remove
 * @returns {Promise<boolean>} True if successfully removed, false on error
 */
const removeRecentProject = async id => {
    const db = await getDatabase();
    if (!db) {
        return false;
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        transaction.onerror = () => {
            resolve(false);
        };

        const store = transaction.objectStore(STORE_NAME);
        const deleteRequest = store.delete(id);
        
        deleteRequest.onsuccess = () => {
            resolve(true);
        };
    });
};

/**
 * Clear all recent projects from the database
 * @returns {Promise<boolean>} True if successfully cleared, false on error
 */
const clearAllRecentProjects = async () => {
    const db = await getDatabase();
    if (!db) {
        return false;
    }

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        transaction.onerror = () => {
            resolve(false);
        };

        const store = transaction.objectStore(STORE_NAME);
        const clearRequest = store.clear();
        
        clearRequest.onsuccess = () => {
            resolve(true);
        };
    });
};

export {
    addRecentProject,
    getRecentProjects,
    removeRecentProject,
    clearAllRecentProjects,
    checkFilePermission
};

export default {
    addRecentProject,
    getRecentProjects,
    removeRecentProject,
    clearAllRecentProjects,
    checkFilePermission
};