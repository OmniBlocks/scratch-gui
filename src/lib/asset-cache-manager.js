/**
 * Asset Cache Manager for OmniBlocks
 * Provides intelligent caching and deduplication for game assets
 */

import { generateAssetHash, generateCacheKey, extractAssetMetadata, areAssetsIdentical } from './asset-hash-utils';

// Default configuration
const DEFAULT_CONFIG = {
    maxCacheSize: 100 * 1024 * 1024, // 100MB
    maxMemoryCache: 50 * 1024 * 1024, // 50MB in memory
    enablePersistentCache: true,
    enableMemoryCache: true,
    enableDeduplication: true,
    cacheVersion: '1.0.0'
};

class AssetCacheManager {
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG, ...config };
        this.memoryCache = new Map();
        this.memoryCacheSize = 0;
        this.hashToAssetMap = new Map();
        this.accessOrder = new Map(); // For LRU tracking
        this.cacheStats = {
            hits: 0,
            misses: 0,
            deduplicationSaves: 0,
            totalSize: 0
        };
        
        this.dbName = 'OmniBlocksAssetCache';
        this.dbVersion = 1;
        this.db = null;
        
        this.initializeDatabase();
    }

    /**
     * Initialize IndexedDB for persistent caching
     */
    async initializeDatabase() {
        if (!this.config.enablePersistentCache || typeof indexedDB === 'undefined') {
            console.log('Persistent cache disabled or IndexedDB not available');
            return;
        }

        try {
            this.db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, this.dbVersion);
                
                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);
                
                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    
                    // Create object stores
                    if (!db.objectStoreNames.contains('assets')) {
                        const assetStore = db.createObjectStore('assets', { keyPath: 'cacheKey' });
                        assetStore.createIndex('hash', 'hash', { unique: false });
                        assetStore.createIndex('timestamp', 'timestamp', { unique: false });
                    }
                    
                    if (!db.objectStoreNames.contains('metadata')) {
                        db.createObjectStore('metadata', { keyPath: 'key' });
                    }
                };
            });
            
            console.log('Asset cache database initialized successfully');
            await this.loadCacheStats();
        } catch (error) {
            console.error('Failed to initialize asset cache database:', error);
            this.db = null;
        }
    }

    /**
     * Load cache statistics from persistent storage
     */
    async loadCacheStats() {
        if (!this.db) return;
        
        try {
            const transaction = this.db.transaction(['metadata'], 'readonly');
            const store = transaction.objectStore('metadata');
            const request = store.get('cacheStats');
            
            const result = await new Promise((resolve, reject) => {
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
            
            if (result && result.value) {
                this.cacheStats = { ...this.cacheStats, ...result.value };
            }
        } catch (error) {
            console.warn('Failed to load cache stats:', error);
        }
    }

    /**
     * Save cache statistics to persistent storage
     */
    async saveCacheStats() {
        if (!this.db) return;
        
        try {
            const transaction = this.db.transaction(['metadata'], 'readwrite');
            const store = transaction.objectStore('metadata');
            await store.put({ key: 'cacheStats', value: this.cacheStats });
        } catch (error) {
            console.warn('Failed to save cache stats:', error);
        }
    }

    /**
     * Get an asset from cache
     * @param {Object} asset - Asset descriptor
     * @returns {Promise<Object|null>} - Cached asset data or null
     */
    async getAsset(asset) {
        const assetHash = await generateAssetHash(asset.data || '');
        const cacheKey = generateCacheKey(asset, assetHash);
        
        // Check memory cache first
        if (this.config.enableMemoryCache && this.memoryCache.has(cacheKey)) {
            this.updateAccessOrder(cacheKey);
            this.cacheStats.hits++;
            return this.memoryCache.get(cacheKey);
        }
        
        // Check persistent cache
        if (this.db) {
            try {
                const cachedAsset = await this.getFromPersistentCache(cacheKey);
                if (cachedAsset) {
                    // Add to memory cache for faster future access
                    this.addToMemoryCache(cacheKey, cachedAsset);
                    this.cacheStats.hits++;
                    return cachedAsset;
                }
            } catch (error) {
                console.warn('Failed to retrieve from persistent cache:', error);
            }
        }
        
        this.cacheStats.misses++;
        return null;
    }

    /**
     * Store an asset in cache
     * @param {Object} asset - Asset to cache
     * @returns {Promise<string>} - Cache key of stored asset
     */
    async storeAsset(asset) {
        const assetHash = await generateAssetHash(asset.data);
        const cacheKey = generateCacheKey(asset, assetHash);
        
        // Check for deduplication opportunity
        if (this.config.enableDeduplication && this.hashToAssetMap.has(assetHash)) {
            this.cacheStats.deduplicationSaves++;
            return this.hashToAssetMap.get(assetHash);
        }
        
        const metadata = extractAssetMetadata(asset);
        const cacheEntry = {
            cacheKey,
            hash: assetHash,
            data: asset.data,
            metadata,
            timestamp: Date.now()
        };
        
        // Store in memory cache
        if (this.config.enableMemoryCache) {
            this.addToMemoryCache(cacheKey, cacheEntry);
        }
        
        // Store in persistent cache
        if (this.db) {
            try {
                await this.storeToPersistentCache(cacheEntry);
            } catch (error) {
                console.warn('Failed to store to persistent cache:', error);
            }
        }
        
        // Update hash mapping for deduplication
        this.hashToAssetMap.set(assetHash, cacheKey);
        this.cacheStats.totalSize += metadata.size;
        
        // Check if we need to evict old entries
        await this.enforceStorageLimits();
        
        return cacheKey;
    }

    /**
     * Add asset to memory cache with LRU management
     */
    addToMemoryCache(cacheKey, asset) {
        const size = asset.metadata.size;
        
        // Check if adding this asset would exceed memory limit
        if (this.memoryCacheSize + size > this.config.maxMemoryCache) {
            this.evictFromMemoryCache(size);
        }
        
        this.memoryCache.set(cacheKey, asset);
        this.memoryCacheSize += size;
        this.updateAccessOrder(cacheKey);
    }

    /**
     * Evict assets from memory cache using LRU policy
     */
    evictFromMemoryCache(requiredSpace) {
        const sortedByAccess = Array.from(this.accessOrder.entries())
            .sort((a, b) => a[1] - b[1]); // Sort by access time (oldest first)
        
        for (const [cacheKey] of sortedByAccess) {
            if (this.memoryCacheSize + requiredSpace <= this.config.maxMemoryCache) {
                break;
            }
            
            const asset = this.memoryCache.get(cacheKey);
            if (asset) {
                this.memoryCache.delete(cacheKey);
                this.memoryCacheSize -= asset.metadata.size;
                this.accessOrder.delete(cacheKey);
            }
        }
    }

    /**
     * Update access order for LRU tracking
     */
    updateAccessOrder(cacheKey) {
        this.accessOrder.set(cacheKey, Date.now());
    }

    /**
     * Get asset from persistent cache
     */
    async getFromPersistentCache(cacheKey) {
        if (!this.db) return null;
        
        const transaction = this.db.transaction(['assets'], 'readonly');
        const store = transaction.objectStore('assets');
        const request = store.get(cacheKey);
        
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Store asset to persistent cache
     */
    async storeToPersistentCache(cacheEntry) {
        if (!this.db) return;
        
        const transaction = this.db.transaction(['assets'], 'readwrite');
        const store = transaction.objectStore('assets');
        await store.put(cacheEntry);
    }

    /**
     * Enforce storage limits and evict old entries if necessary
     */
    async enforceStorageLimits() {
        if (this.cacheStats.totalSize <= this.config.maxCacheSize) {
            return;
        }
        
        // Implement LRU eviction for persistent cache
        if (this.db) {
            try {
                const transaction = this.db.transaction(['assets'], 'readwrite');
                const store = transaction.objectStore('assets');
                const index = store.index('timestamp');
                const request = index.openCursor();
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor && this.cacheStats.totalSize > this.config.maxCacheSize) {
                        const asset = cursor.value;
                        cursor.delete();
                        this.cacheStats.totalSize -= asset.metadata.size;
                        cursor.continue();
                    }
                };
            } catch (error) {
                console.warn('Failed to enforce storage limits:', error);
            }
        }
    }

    /**
     * Get cache statistics
     */
    getStats() {
        return {
            ...this.cacheStats,
            memoryCacheSize: this.memoryCacheSize,
            memoryCacheEntries: this.memoryCache.size,
            hitRate: this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) || 0
        };
    }

    /**
     * Clear all caches
     */
    async clearCache() {
        this.memoryCache.clear();
        this.memoryCacheSize = 0;
        this.hashToAssetMap.clear();
        this.accessOrder.clear();
        
        if (this.db) {
            try {
                const transaction = this.db.transaction(['assets'], 'readwrite');
                const store = transaction.objectStore('assets');
                await store.clear();
            } catch (error) {
                console.warn('Failed to clear persistent cache:', error);
            }
        }
        
        this.cacheStats = {
            hits: 0,
            misses: 0,
            deduplicationSaves: 0,
            totalSize: 0
        };
    }
}

export default AssetCacheManager;
