import {driver} from 'driver.js';

/**
 * Driver.js service for highlighting buttons and creating guided tours
 * in the OmniBlocks interface
 */
class DriverService {
    constructor() {
        this.driverInstance = null;
        this.isInitialized = false;
        this.defaultConfig = {
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            allowClose: true,
            overlayClickNext: false,
            smoothScroll: true,
            stagePadding: 4,
            stageRadius: 10,
            popoverClass: 'omniblocks-driver-popover',
            progressText: 'Step {{current}} of {{total}}',
            nextBtnText: 'Next →',
            prevBtnText: '← Previous',
            doneBtnText: 'Done',
            closeBtnText: '✕'
        };
    }

    /**
     * Initialize the driver service
     * @param {Object} config - Custom configuration options
     */
    init(config = {}) {
        if (this.isInitialized) {
            return;
        }

        const mergedConfig = {
            ...this.defaultConfig,
            ...config
        };

        this.driverInstance = driver(mergedConfig);
        this.isInitialized = true;
    }

    /**
     * Highlight a single button or element
     * @param {string} selector - CSS selector for the element to highlight
     * @param {Object} options - Highlight options
     */
    highlightButton(selector, options = {}) {
        if (!this.isInitialized) {
            this.init();
        }

        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Driver.js: Element not found for selector: ${selector}`);
            return;
        }

        const highlightConfig = {
            element: selector,
            popover: {
                title: options.title || 'Button Highlight',
                description: options.description || 'This button performs an important action.',
                position: options.position || 'bottom',
                showButtons: options.showButtons || ['close'],
                ...options.popover
            }
        };

        this.driverInstance.highlight(highlightConfig);
    }

    /**
     * Start a guided tour with multiple steps
     * @param {Array} steps - Array of step configurations
     */
    startTour(steps) {
        if (!this.isInitialized) {
            this.init();
        }

        if (!Array.isArray(steps) || steps.length === 0) {
            console.warn('Driver.js: Invalid steps provided for tour');
            return;
        }

        this.driverInstance.setSteps(steps);
        this.driverInstance.drive();
    }

    /**
     * Clear any active highlights or tours
     */
    clear() {
        if (this.driverInstance) {
            this.driverInstance.destroy();
        }
    }

    /**
     * Check if driver is currently active
     */
    isActive() {
        return this.driverInstance && this.driverInstance.isActivated;
    }

    /**
     * Get the driver instance for advanced usage
     */
    getInstance() {
        return this.driverInstance;
    }
}

// Create and export a singleton instance
const driverService = new DriverService();

export default driverService;
