/**
 * Packager Asset Utilities for OmniBlocks
 * Provides utilities for managing assets in packaged HTML/Electron games
 */

import storage from './storage';

/**
 * Preload common assets that are likely to be used across levels
 * @param {Array} assetList - List of assets to preload
 * @returns {Promise} - Promise that resolves when preloading is complete
 */
export const preloadCommonAssets = async (assetList) => {
    if (!storage.assetCacheManager || !assetList || assetList.length === 0) {
        return;
    }
    
    console.log(`Preloading ${assetList.length} common assets...`);
    const preloadPromises = assetList.map(async (asset) => {
        try {
            await storage.loadWithCache(
                asset.assetType || storage.AssetType.ImageBitmap,
                asset.assetId,
                asset.dataFormat || 'png'
            );
        } catch (error) {
            console.warn(`Failed to preload asset ${asset.assetId}:`, error);
        }
    });
    
    await Promise.allSettled(preloadPromises);
    console.log('Asset preloading completed');
};

/**
 * Get memory usage information for the current page
 * @returns {Object} - Memory usage statistics
 */
export const getMemoryUsage = () => {
    const memoryInfo = {
        supported: false,
        usedJSHeapSize: 0,
        totalJSHeapSize: 0,
        jsHeapSizeLimit: 0,
        cacheStats: null
    };
    
    // Get browser memory info if available
    if (performance.memory) {
        memoryInfo.supported = true;
        memoryInfo.usedJSHeapSize = performance.memory.usedJSHeapSize;
        memoryInfo.totalJSHeapSize = performance.memory.totalJSHeapSize;
        memoryInfo.jsHeapSizeLimit = performance.memory.jsHeapSizeLimit;
    }
    
    // Get cache statistics
    if (storage.getCacheStats) {
        memoryInfo.cacheStats = storage.getCacheStats();
    }
    
    return memoryInfo;
};

/**
 * Clean up memory by clearing caches when memory usage is high
 * @param {number} threshold - Memory usage threshold (0-1, default 0.8)
 * @returns {Promise<boolean>} - True if cleanup was performed
 */
export const performMemoryCleanup = async (threshold = 0.8) => {
    const memoryInfo = getMemoryUsage();
    
    if (!memoryInfo.supported) {
        console.log('Memory monitoring not supported, performing cache cleanup anyway');
        await storage.clearAssetCache();
        return true;
    }
    
    const memoryUsageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
    
    if (memoryUsageRatio > threshold) {
        console.log(`Memory usage high (${(memoryUsageRatio * 100).toFixed(1)}%), performing cleanup...`);
        await storage.clearAssetCache();
        
        // Force garbage collection if available (Chrome DevTools)
        if (window.gc) {
            window.gc();
        }
        
        return true;
    }
    
    return false;
};

/**
 * Configure asset caching for packaged games
 * @param {Object} options - Configuration options
 */
export const configurePackagerCaching = (options = {}) => {
    const defaultOptions = {
        enablePreloading: true,
        enableMemoryMonitoring: true,
        memoryCleanupThreshold: 0.8,
        preloadAssets: [],
        monitoringInterval: 60000 // 1 minute
    };
    
    const config = { ...defaultOptions, ...options };
    
    // Preload common assets if specified
    if (config.enablePreloading && config.preloadAssets.length > 0) {
        preloadCommonAssets(config.preloadAssets).catch(error => {
            console.warn('Failed to preload assets:', error);
        });
    }
    
    // Set up memory monitoring
    if (config.enableMemoryMonitoring) {
        setInterval(async () => {
            try {
                const cleanupPerformed = await performMemoryCleanup(config.memoryCleanupThreshold);
                if (cleanupPerformed) {
                    console.log('Automatic memory cleanup performed');
                }
            } catch (error) {
                console.warn('Error during memory monitoring:', error);
            }
        }, config.monitoringInterval);
    }
    
    console.log('Packager asset caching configured:', config);
};

/**
 * Export cache statistics for debugging
 * @returns {Object} - Detailed cache and memory statistics
 */
export const exportCacheStatistics = () => {
    const memoryInfo = getMemoryUsage();
    const timestamp = new Date().toISOString();
    
    return {
        timestamp,
        memory: memoryInfo,
        userAgent: navigator.userAgent,
        url: window.location.href,
        performance: {
            navigation: performance.navigation,
            timing: performance.timing
        }
    };
};

/**
 * Initialize packager utilities when the page loads
 */
export const initializePackagerUtils = () => {
    // Set up global error handling for cache-related errors
    window.addEventListener('error', (event) => {
        if (event.error && event.error.message && event.error.message.includes('cache')) {
            console.warn('Cache-related error detected:', event.error);
            // Optionally perform cleanup or fallback
        }
    });
    
    // Set up unload handler to save cache stats
    window.addEventListener('beforeunload', () => {
        if (storage.assetCacheManager && storage.assetCacheManager.saveCacheStats) {
            storage.assetCacheManager.saveCacheStats();
        }
    });
    
    console.log('Packager utilities initialized');
};

export default {
    preloadCommonAssets,
    getMemoryUsage,
    performMemoryCleanup,
    configurePackagerCaching,
    exportCacheStatistics,
    initializePackagerUtils
};
