/**
 * Asset Hash Utilities for Content-Based Deduplication
 * Provides functions to generate and manage content hashes for assets
 */

/**
 * Generate SHA-256 hash from asset data
 * @param {ArrayBuffer|Uint8Array|string} data - Asset data to hash
 * @returns {Promise<string>} - Hex string of the hash
 */
export const generateAssetHash = async (data) => {
    // Convert string to ArrayBuffer if needed
    if (typeof data === 'string') {
        data = new TextEncoder().encode(data);
    }
    
    // Convert Uint8Array to ArrayBuffer if needed
    if (data instanceof Uint8Array) {
        data = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    }
    
    try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = new Uint8Array(hashBuffer);
        return Array.from(hashArray)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    } catch (error) {
        console.warn('Failed to generate hash using Web Crypto API, falling back to simple hash:', error);
        return generateSimpleHash(data);
    }
};

/**
 * Fallback hash function for environments without Web Crypto API
 * @param {ArrayBuffer} data - Asset data to hash
 * @returns {string} - Simple hash string
 */
const generateSimpleHash = (data) => {
    const view = new Uint8Array(data);
    let hash = 0;
    
    for (let i = 0; i < view.length; i++) {
        const char = view[i];
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(16);
};

/**
 * Generate a cache key for an asset based on its properties
 * @param {Object} asset - Asset object with id, dataFormat, etc.
 * @param {string} contentHash - Content hash of the asset
 * @returns {string} - Cache key
 */
export const generateCacheKey = (asset, contentHash) => {
    const assetId = asset.assetId || asset.id || 'unknown';
    const dataFormat = asset.dataFormat || 'unknown';
    return `${assetId}_${dataFormat}_${contentHash}`;
};

/**
 * Extract asset metadata for caching
 * @param {Object} asset - Asset object
 * @returns {Object} - Metadata object
 */
export const extractAssetMetadata = (asset) => {
    return {
        id: asset.assetId || asset.id,
        dataFormat: asset.dataFormat,
        assetType: asset.assetType,
        size: asset.data ? asset.data.byteLength || asset.data.length : 0,
        timestamp: Date.now()
    };
};

/**
 * Check if two assets are identical based on their hashes
 * @param {string} hash1 - First asset hash
 * @param {string} hash2 - Second asset hash
 * @returns {boolean} - True if assets are identical
 */
export const areAssetsIdentical = (hash1, hash2) => {
    return hash1 === hash2;
};

export default { generateAssetHash, generateCacheKey, extractAssetMetadata, areAssetsIdentical };
