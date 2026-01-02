import ScratchStorage from '@turbowarp/scratch-storage';

import defaultProject from './default-project';
import AddonHooks from '../addons/hooks';
import AssetCacheManager from './asset-cache-manager';
import { getCacheConfig } from './packager-cache-config';

/**
 * Wrapper for ScratchStorage which adds default web sources.
 * @todo make this more configurable
 */
class Storage extends ScratchStorage {
    constructor () {
        super();
        this.cacheDefaultProject();
        
        // Initialize asset cache manager
        const cacheMode = process.env.NODE_ENV === 'production' ? 'packager' : 'development';
        const cacheConfig = getCacheConfig(cacheMode);
        this.assetCacheManager = new AssetCacheManager(cacheConfig);
        this.enableAssetCaching = true;
    }
    addOfficialScratchWebStores () {
        this.addWebStore(
            [this.AssetType.Project],
            this.getProjectGetConfig.bind(this),
            this.getProjectCreateConfig.bind(this),
            this.getProjectUpdateConfig.bind(this)
        );
        this.addWebStore(
            [this.AssetType.ImageVector, this.AssetType.ImageBitmap, this.AssetType.Sound],
            this.getAssetGetConfig.bind(this),
            // We set both the create and update configs to the same method because
            // storage assumes it should update if there is an assetId, but the
            // asset store uses the assetId as part of the create URI.
            this.getAssetCreateConfig.bind(this),
            this.getAssetCreateConfig.bind(this)
        );
    }
    setProjectHost (projectHost) {
        this.projectHost = projectHost;
    }
    setProjectToken (projectToken) {
        this.projectToken = projectToken;
    }
    getProjectGetConfig (projectAsset) {
        const path = `${this.projectHost}/${projectAsset.assetId}`;
        const qs = this.projectToken ? `?token=${this.projectToken}` : '';
        return path + qs;
    }
    getProjectCreateConfig () {
        return {
            url: `${this.projectHost}/`,
            withCredentials: true
        };
    }
    getProjectUpdateConfig (projectAsset) {
        return {
            url: `${this.projectHost}/${projectAsset.assetId}`,
            withCredentials: true
        };
    }
    setAssetHost (assetHost) {
        this.assetHost = assetHost;
    }
    getAssetGetConfig (asset) {
        return `${this.assetHost}/internalapi/asset/${asset.assetId}.${asset.dataFormat}/get/`;
    }
    getAssetCreateConfig (asset) {
        return {
            // There is no such thing as updating assets, but storage assumes it
            // should update if there is an assetId, and the asset store uses the
            // assetId as part of the create URI. So, force the method to POST.
            // Then when storage finds this config to use for the "update", still POSTs
            method: 'post',
            url: `${this.assetHost}/${asset.assetId}.${asset.dataFormat}`,
            withCredentials: true
        };
    }
    setTranslatorFunction (translator) {
        this.translator = translator;
        this.cacheDefaultProject();
    }
    cacheDefaultProject () {
        if (!AddonHooks.willLoadDefaultProject) return;
        const defaultProjectAssets = defaultProject(this.translator);
        defaultProjectAssets.forEach(asset => this.builtinHelper._store(
            this.AssetType[asset.assetType],
            this.DataFormat[asset.dataFormat],
            asset.data,
            asset.id
        ));
    }
    
    /**
     * Enhanced load method with caching support
     * @param {string} assetType - Type of asset to load
     * @param {string} assetId - ID of asset to load
     * @param {string} dataFormat - Data format of asset
     * @returns {Promise} - Promise resolving to asset data
     */
    async loadWithCache(assetType, assetId, dataFormat) {
        if (!this.enableAssetCaching || !this.assetCacheManager) {
            return this.load(assetType, assetId, dataFormat);
        }
        
        const assetDescriptor = {
            assetType,
            assetId,
            dataFormat
        };
        
        try {
            // Try to get from cache first
            const cachedAsset = await this.assetCacheManager.getAsset(assetDescriptor);
            if (cachedAsset && cachedAsset.data) {
                console.log(`Cache hit for asset: ${assetId}`);
                return cachedAsset.data;
            }
            
            // Load from original source
            console.log(`Cache miss for asset: ${assetId}, loading from source`);
            const assetData = await this.load(assetType, assetId, dataFormat);
            
            // Store in cache for future use
            if (assetData) {
                const assetToCache = {
                    ...assetDescriptor,
                    data: assetData
                };
                await this.assetCacheManager.storeAsset(assetToCache);
            }
            
            return assetData;
        } catch (error) {
            console.warn('Error in cached asset loading, falling back to direct load:', error);
            return this.load(assetType, assetId, dataFormat);
        }
    }
    
    /**
     * Get cache statistics
     * @returns {Object} - Cache statistics
     */
    getCacheStats() {
        return this.assetCacheManager ? this.assetCacheManager.getStats() : null;
    }
    
    /**
     * Clear asset cache
     */
    async clearAssetCache() {
        if (this.assetCacheManager) {
            await this.assetCacheManager.clearCache();
        }
    }
}

const storage = new Storage();

export default storage;
