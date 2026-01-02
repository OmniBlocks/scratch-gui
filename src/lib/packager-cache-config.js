/**
 * Packager-specific cache configuration for OmniBlocks
 * Optimized settings for HTML/Electron game packaging
 */

/**
 * Default cache configuration for packaged games
 */
export const PACKAGER_CACHE_CONFIG = {
    // Larger cache size for packaged games since they're distributed
    maxCacheSize: 200 * 1024 * 1024, // 200MB
    maxMemoryCache: 100 * 1024 * 1024, // 100MB in memory
    
    // Enable all optimizations for packaged games
    enablePersistentCache: true,
    enableMemoryCache: true,
    enableDeduplication: true,
    
    // Packager-specific settings
    enableCrossLevelCaching: true, // Cache assets across different HTML levels
    enablePreloading: true, // Preload common assets
    enableCompressionCache: true, // Cache compressed versions
    
    // Asset type priorities (higher = more likely to be cached)
    assetPriorities: {
        'ImageVector': 10,
        'ImageBitmap': 8,
        'Sound': 6,
        'Project': 4
    },
    
    // Cache version for packaged games
    cacheVersion: '1.0.0-packager'
};

/**
 * Configuration for development mode (smaller limits)
 */
export const DEVELOPMENT_CACHE_CONFIG = {
    maxCacheSize: 50 * 1024 * 1024, // 50MB
    maxMemoryCache: 25 * 1024 * 1024, // 25MB in memory
    enablePersistentCache: true,
    enableMemoryCache: true,
    enableDeduplication: true,
    enableCrossLevelCaching: false,
    enablePreloading: false,
    enableCompressionCache: false,
    cacheVersion: '1.0.0-dev'
};

/**
 * Get cache configuration based on environment
 * @param {string} mode - 'packager', 'development', or 'production'
 * @returns {Object} - Cache configuration object
 */
export const getCacheConfig = (mode = 'development') => {
    switch (mode) {
        case 'packager':
            return PACKAGER_CACHE_CONFIG;
        case 'development':
            return DEVELOPMENT_CACHE_CONFIG;
        case 'production':
            return PACKAGER_CACHE_CONFIG; // Use packager config for production
        default:
            return DEVELOPMENT_CACHE_CONFIG;
    }
};

export default { PACKAGER_CACHE_CONFIG, DEVELOPMENT_CACHE_CONFIG, getCacheConfig };
