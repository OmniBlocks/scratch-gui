/**
 * Utility functions for File System Access API operations
 */

/**
 * Check if File System Access API is supported
 * @returns {boolean} True if supported
 */
export const isFileSystemAccessSupported = () => 'showOpenFilePicker' in window && 'showSaveFilePicker' in window;

/**
 * Check if File System Access API's queryPermission is available
 * @param {FileSystemFileHandle} handle - File handle to check
 * @returns {Promise<boolean>} True if permission can be queried
 */
export const canQueryPermission = handle => {
    try {
        return handle && typeof handle.queryPermission === 'function';
    } catch {
        return false;
    }
};

/**
 * Check if we have permission to read a file handle
 * @param {FileSystemFileHandle} handle - File handle to check
 * @returns {Promise<boolean>} True if we have read permission
 */
export const hasReadPermission = async handle => {
    try {
        if (!handle || !await canQueryPermission(handle)) {
            return false;
        }
        const permission = await handle.queryPermission({mode: 'read'});
        return permission === 'granted';
    } catch {
        return false;
    }
};

/**
 * Request read permission for a file handle
 * @param {FileSystemFileHandle} handle - File handle to request permission for
 * @returns {Promise<boolean>} True if permission was granted
 */
export const requestReadPermission = async handle => {
    try {
        if (!handle || typeof handle.requestPermission !== 'function') {
            return false;
        }
        const permission = await handle.requestPermission({mode: 'read'});
        return permission === 'granted';
    } catch {
        return false;
    }
};

/**
 * Verify a file handle is still valid and accessible
 * @param {FileSystemFileHandle} handle - File handle to verify
 * @returns {Promise<object>} Object with isValid boolean and file info if valid
 */
export const verifyFileHandle = async handle => {
    try {
        if (!handle) {
            return {isValid: false};
        }

        // Check if we have permission
        const hasPermission = await hasReadPermission(handle);
        if (!hasPermission) {
            // Try to request permission
            const granted = await requestReadPermission(handle);
            if (!granted) {
                return {isValid: false};
            }
        }

        // Try to get the file to verify it still exists
        const file = await handle.getFile();
        return {
            isValid: true,
            file: file,
            name: file.name,
            size: file.size,
            lastModified: file.lastModified
        };
    } catch {
        return {isValid: false};
    }
};

/**
 * Convert a file handle to a serializable format for storage
 * @param {FileSystemFileHandle} handle - File handle to serialize
 * @returns {Promise<object>} Serializable file info or null if not possible
 */
export const serializeFileHandle = async handle => {
    try {
        if (!handle || !isFileSystemAccessSupported()) {
            return null;
        }

        // Verify the handle first
        const verification = await verifyFileHandle(handle);
        if (!verification.isValid) {
            return null;
        }

        return {
            type: 'file-system-access',
            name: verification.name,
            handle: handle
        };
    } catch {
        return null;
    }
};

/**
 * Get best available representation of a file for storage
 * @param {File|FileSystemFileHandle} fileOrHandle - File or file handle
 * @returns {Promise<object>} Serializable file info
 */
export const getStorableFileInfo = async fileOrHandle => {
    try {
        if (!fileOrHandle) {
            return null;
        }

        // Handle FileSystemFileHandle
        if (fileOrHandle.kind === 'file' && typeof fileOrHandle.getFile === 'function') {
            const serialized = await serializeFileHandle(fileOrHandle);
            if (serialized) {
                return serialized;
            }
        }

        // Handle regular File object
        if (fileOrHandle instanceof File) {
            return {
                type: 'file',
                name: fileOrHandle.name,
                size: fileOrHandle.size,
                lastModified: fileOrHandle.lastModified
            };
        }

        return null;
    } catch {
        return null;
    }
};
