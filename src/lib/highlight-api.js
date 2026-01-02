import driverService from './driver-service.js';
import {
    highlightFileMenu,
    highlightEditMenu,
    highlightAddonsButton,
    highlightAdvancedButton,
    highlightFeedbackButton,
    highlightPlayButton,
    startMenuBarTour
} from './button-tours.js';

/**
 * Global API for button highlighting in OmniBlocks
 * This provides a simple interface for highlighting buttons and starting tours
 */
class HighlightAPI {
    constructor() {
        this.driverService = driverService;
    }

    /**
     * Highlight any button by CSS selector
     * @param {string} selector - CSS selector for the element
     * @param {Object} options - Highlight options
     */
    highlight(selector, options = {}) {
        return this.driverService.highlightButton(selector, options);
    }

    /**
     * Start a custom tour with multiple steps
     * @param {Array} steps - Array of step configurations
     */
    tour(steps) {
        return this.driverService.startTour(steps);
    }

    /**
     * Clear any active highlights
     */
    clear() {
        return this.driverService.clear();
    }

    /**
     * Predefined button highlights
     */
    fileMenu() { return highlightFileMenu(); }
    editMenu() { return highlightEditMenu(); }
    addons() { return highlightAddonsButton(); }
    advanced() { return highlightAdvancedButton(); }
    feedback() { return highlightFeedbackButton(); }
    playButton() { return highlightPlayButton(); }

    /**
     * Start the main menu bar tour
     */
    menuBarTour() { return startMenuBarTour(); }

    /**
     * Demo function to showcase highlighting capabilities
     */
    demo() {
        console.log('🎯 OmniBlocks Button Highlighting Demo');
        console.log('Try: window.OmniBlocks.highlight.fileMenu()');
        console.log('Try: window.OmniBlocks.highlight.playButton()');
        console.log('Try: window.OmniBlocks.highlight.menuBarTour()');
        console.log('Try: window.OmniBlocks.highlight.highlight("[data-driver=\\"addons-button\\"]", {title: "Custom Title"})');
        
        // Show a quick demo
        setTimeout(() => this.fileMenu(), 1000);
    }
}

// Create and export singleton
const highlightAPI = new HighlightAPI();

export default highlightAPI;
