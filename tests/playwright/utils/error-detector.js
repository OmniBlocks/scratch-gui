/**
 * Error Detection Utility for OmniBlocks Playwright Tests
 * Monitors console for JavaScript errors (not warnings) and captures context
 */

class ErrorDetector {
  constructor(page) {
    this.page = page;
    this.errors = [];
    this.actions = [];
    this.startTime = Date.now();
    this.setupErrorListeners();
  }

  setupErrorListeners() {
    // Listen for console errors (not warnings)
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.captureError({
          type: 'console_error',
          message: msg.text(),
          timestamp: Date.now() - this.startTime,
          location: msg.location(),
          args: msg.args()
        });
      }
    });

    // Listen for page errors (uncaught exceptions)
    this.page.on('pageerror', (error) => {
      this.captureError({
        type: 'page_error',
        message: error.message,
        stack: error.stack,
        timestamp: Date.now() - this.startTime,
        name: error.name
      });
    });

    // Listen for failed requests that might indicate JS loading issues
    this.page.on('requestfailed', (request) => {
      if (request.url().endsWith('.js') || request.url().includes('javascript')) {
        this.captureError({
          type: 'request_failed',
          message: `Failed to load: ${request.url()}`,
          timestamp: Date.now() - this.startTime,
          failure: request.failure()
        });
      }
    });
  }

  captureError(error) {
    console.log(`🚨 JavaScript Error Detected: ${error.message}`);
    
    // Add recent actions context (last 10 actions before error)
    const recentActions = this.actions.slice(-10);
    
    this.errors.push({
      ...error,
      recentActions,
      totalActions: this.actions.length
    });
  }

  logAction(action) {
    this.actions.push({
      type: action.type,
      target: action.target,
      timestamp: Date.now() - this.startTime,
      details: action.details || {}
    });

    // Keep only last 50 actions to prevent memory issues
    if (this.actions.length > 50) {
      this.actions = this.actions.slice(-50);
    }
  }

  getErrors() {
    return this.errors;
  }

  hasErrors() {
    return this.errors.length > 0;
  }
}

module.exports = { ErrorDetector };
