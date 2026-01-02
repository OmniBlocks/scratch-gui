/**
 * Desktop Integration Module for OmniBlocks Desktop
 * Provides enhanced file system and hardware access when running in Electron
 */

class DesktopIntegration {
    constructor() {
        this.isDesktop = typeof window !== 'undefined' && window.omniBlocksDesktop;
        this.features = this.isDesktop ? window.omniBlocksDesktop.features : {};
    }

    /**
     * Check if running in desktop environment
     */
    isDesktopEnvironment() {
        return this.isDesktop;
    }

    /**
     * Get available desktop features
     */
    getAvailableFeatures() {
        return this.features;
    }

    /**
     * Create a project workspace with enhanced file organization
     */
    async createProjectWorkspace(projectName) {
        if (!this.isDesktop) {
            throw new Error('Workspace creation only available in desktop version');
        }

        try {
            const result = await window.omniBlocksDesktop.createWorkspace(projectName);
            return result;
        } catch (error) {
            console.error('Failed to create workspace:', error);
            throw error;
        }
    }

    /**
     * Import multiple projects at once
     */
    async batchImportProjects() {
        if (!this.isDesktop) {
            throw new Error('Batch import only available in desktop version');
        }

        try {
            const results = await window.omniBlocksDesktop.batchImport();
            return results;
        } catch (error) {
            console.error('Batch import failed:', error);
            throw error;
        }
    }

    /**
     * Show native save dialog
     */
    async showSaveDialog(options = {}) {
        if (!this.isDesktop) {
            throw new Error('Native dialogs only available in desktop version');
        }

        return await window.omniBlocksDesktop.showSaveDialog(options);
    }

    /**
     * Show native open dialog
     */
    async showOpenDialog(options = {}) {
        if (!this.isDesktop) {
            throw new Error('Native dialogs only available in desktop version');
        }

        return await window.omniBlocksDesktop.showOpenDialog(options);
    }
}

// Export singleton instance
const desktopIntegration = new DesktopIntegration();
export default desktopIntegration;

