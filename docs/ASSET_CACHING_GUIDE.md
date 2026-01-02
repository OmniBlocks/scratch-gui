# Asset Caching and Deduplication Guide

This guide explains how to use OmniBlocks' asset caching and deduplication system for HTML/Electron packaged games.

## Overview

The asset caching system helps reduce memory usage and improve performance by:

- **Deduplicating identical assets** across different levels/HTML pages
- **Caching frequently used assets** in memory and persistent storage
- **Managing memory usage** with intelligent cleanup policies
- **Preloading common assets** to reduce loading times

## Basic Usage

### Automatic Caching

Asset caching is enabled by default. The system automatically:

```javascript
// Assets are automatically cached when loaded
const assetData = await storage.loadWithCache(
    storage.AssetType.ImageBitmap,
    'asset-id-123',
    'png'
);
```

### Manual Configuration

For packaged games, you can configure caching behavior:

```javascript
import { configurePackagerCaching } from '../lib/packager-asset-utils';

// Configure for your packaged game
configurePackagerCaching({
    enablePreloading: true,
    enableMemoryMonitoring: true,
    memoryCleanupThreshold: 0.8, // Clean up when 80% memory used
    preloadAssets: [
        { assetId: 'common-background', assetType: 'ImageBitmap', dataFormat: 'png' },
        { assetId: 'ui-elements', assetType: 'ImageVector', dataFormat: 'svg' },
        { assetId: 'background-music', assetType: 'Sound', dataFormat: 'mp3' }
    ],
    monitoringInterval: 30000 // Check memory every 30 seconds
});
```

## Advanced Features

### Preloading Assets

Preload common assets that will be used across multiple levels:

```javascript
import { preloadCommonAssets } from '../lib/packager-asset-utils';

const commonAssets = [
    { assetId: 'player-sprite', assetType: 'ImageBitmap', dataFormat: 'png' },
    { assetId: 'jump-sound', assetType: 'Sound', dataFormat: 'wav' },
    { assetId: 'ui-font', assetType: 'Font', dataFormat: 'woff2' }
];

await preloadCommonAssets(commonAssets);
```

### Memory Management

Monitor and manage memory usage:

```javascript
import { getMemoryUsage, performMemoryCleanup } from '../lib/packager-asset-utils';

// Check current memory usage
const memoryInfo = getMemoryUsage();
console.log('Memory usage:', memoryInfo);

// Manually trigger cleanup if needed
const cleanupPerformed = await performMemoryCleanup(0.7); // 70% threshold
if (cleanupPerformed) {
    console.log('Memory cleanup completed');
}
```

### Cache Statistics

Monitor cache performance:

```javascript
// Get cache statistics
const stats = storage.getCacheStats();
console.log('Cache hit rate:', stats.hitRate);
console.log('Deduplication saves:', stats.deduplicationSaves);
console.log('Total cache size:', stats.totalSize);
```

## Configuration Options

### Cache Manager Configuration

```javascript
const cacheConfig = {
    maxCacheSize: 200 * 1024 * 1024, // 200MB total cache
    maxMemoryCache: 100 * 1024 * 1024, // 100MB in memory
    enablePersistentCache: true, // Use IndexedDB for persistence
    enableMemoryCache: true, // Use in-memory cache
    enableDeduplication: true, // Deduplicate identical assets
    enableCrossLevelCaching: true, // Cache across HTML pages
    enablePreloading: true, // Allow asset preloading
    enableCompressionCache: true // Cache compressed versions
};
```

### Asset Priorities

Configure which asset types are prioritized for caching:

```javascript
const assetPriorities = {
    'ImageVector': 10, // Highest priority (SVGs)
    'ImageBitmap': 8,  // High priority (PNGs, JPGs)
    'Sound': 6,        // Medium priority (audio files)
    'Project': 4       // Lower priority (project files)
};
```

## Best Practices

### For Multi-Level Games

1. **Identify Common Assets**: List assets used across multiple levels
2. **Preload Early**: Load common assets during the initial loading screen
3. **Monitor Memory**: Set up automatic memory monitoring
4. **Clean Between Levels**: Clear level-specific assets when transitioning

```javascript
// Example level transition
async function transitionToLevel(levelId) {
    // Clear level-specific cache
    await storage.clearAssetCache();
    
    // Preload new level assets
    const levelAssets = getLevelAssets(levelId);
    await preloadCommonAssets(levelAssets);
    
    // Load the level
    loadLevel(levelId);
}
```

### Performance Tips

1. **Use appropriate cache sizes** based on your target devices
2. **Enable compression** for large assets
3. **Monitor hit rates** to optimize preloading strategies
4. **Test on low-memory devices** to ensure compatibility

## Troubleshooting

### Common Issues

**High Memory Usage**: Reduce `maxMemoryCache` or lower `memoryCleanupThreshold`

**Slow Loading**: Increase preloading or check cache hit rates

**Cache Not Working**: Verify IndexedDB support and check browser console for errors

### Debug Information

```javascript
import { exportCacheStatistics } from '../lib/packager-asset-utils';

// Export detailed statistics for debugging
const debugInfo = exportCacheStatistics();
console.log('Debug info:', debugInfo);
```

## Browser Compatibility

- **IndexedDB**: Required for persistent caching (supported in all modern browsers)
- **Web Crypto API**: Used for asset hashing (fallback available)
- **Performance API**: Used for memory monitoring (graceful degradation)

## Environment Variables

Control caching behavior with environment variables:

```bash
# Disable asset caching entirely
ENABLE_ASSET_CACHING=false

# Set cache mode (development, production, packager)
NODE_ENV=production
```

This caching system is designed to work seamlessly with your existing OmniBlocks projects while providing significant performance improvements for packaged games.
