import driverService from './driver-service.js';

/**
 * Predefined button highlighting tours for OmniBlocks
 */

/**
 * Highlight the File menu and its key functions
 */
export const highlightFileMenu = () => {
    driverService.highlightButton('[data-driver="file-menu"]', {
        title: 'File Menu',
        description: 'Access project management functions like New, Save, Load, and Export.',
        position: 'bottom'
    });
};

/**
 * Highlight the Edit menu
 */
export const highlightEditMenu = () => {
    driverService.highlightButton('[data-driver="edit-menu"]', {
        title: 'Edit Menu',
        description: 'Find editing options like Turbo Mode, 60 FPS, and advanced settings.',
        position: 'bottom'
    });
};

/**
 * Highlight the Addons button
 */
export const highlightAddonsButton = () => {
    driverService.highlightButton('[data-driver="addons-button"]', {
        title: 'Addons',
        description: 'Customize your OmniBlocks experience with community-built addons.',
        position: 'bottom'
    });
};

/**
 * Highlight the Advanced Settings button
 */
export const highlightAdvancedButton = () => {
    driverService.highlightButton('[data-driver="advanced-button"]', {
        title: 'Advanced Settings',
        description: 'Access advanced configuration options and experimental features.',
        position: 'bottom'
    });
};

/**
 * Highlight the Feedback button
 */
export const highlightFeedbackButton = () => {
    driverService.highlightButton('[data-driver="feedback-button"]', {
        title: 'Feedback',
        description: 'Share your thoughts and suggestions to help improve OmniBlocks.',
        position: 'bottom'
    });
};

/**
 * Highlight the Play button
 */
export const highlightPlayButton = () => {
    driverService.highlightButton('[data-driver="play-button"]', {
        title: 'Play/Stop Button',
        description: 'Click to play or stop sounds and projects.',
        position: 'bottom'
    });
};

/**
 * Start a guided tour of the main menu bar
 */
export const startMenuBarTour = () => {
    const steps = [
        {
            element: '[data-driver="file-menu"]',
            popover: {
                title: 'File Menu',
                description: 'Start here to create new projects, save your work, or load existing projects.',
                position: 'bottom'
            }
        },
        {
            element: '[data-driver="edit-menu"]',
            popover: {
                title: 'Edit Menu',
                description: 'Access editing tools like Turbo Mode for faster execution and 60 FPS mode.',
                position: 'bottom'
            }
        },
        {
            element: '[data-driver="addons-button"]',
            popover: {
                title: 'Addons',
                description: 'Enhance OmniBlocks with community addons for extra features and customization.',
                position: 'bottom'
            }
        },
        {
            element: '[data-driver="advanced-button"]',
            popover: {
                title: 'Advanced Settings',
                description: 'Configure advanced options and experimental features.',
                position: 'bottom'
            }
        },
        {
            element: '[data-driver="feedback-button"]',
            popover: {
                title: 'Feedback',
                description: 'Help us improve OmniBlocks by sharing your feedback and suggestions!',
                position: 'bottom'
            }
        }
    ];
    
    driverService.startTour(steps);
};
