/**
 * Security configuration for OmniBlocks
 * Handles CSP headers, security policies, and other security measures
 */

/**
 * Content Security Policy configuration
 */
export const CSP_CONFIG = {
    'default-src': ["'self'"],
    'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for React and some addons
        "'unsafe-eval'", // Required for VM execution
        "blob:", // Required for worker scripts
        "data:", // Required for some inline scripts
        "https://www.google-analytics.com", // If using analytics
        "https://cdn.jsdelivr.net" // For CDN resources
    ],
    'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for dynamic styling
        "https://fonts.googleapis.com"
    ],
    'img-src': [
        "'self'",
        "data:", // Required for base64 images
        "blob:", // Required for generated images
        "https:", // Allow HTTPS images
        "http://localhost:*" // For development
    ],
    'font-src': [
        "'self'",
        "data:",
        "https://fonts.gstatic.com"
    ],
    'connect-src': [
        "'self'",
        "https://projects.scratch.mit.edu", // For project loading
        "https://cdn.assets.scratch.mit.edu", // For assets
        "https://clouddata.scratch.mit.edu", // For cloud variables
        "wss://clouddata.scratch.mit.edu", // WebSocket for cloud data
        "https://api.github.com", // For updates/releases
        "blob:", // For blob URLs
        "data:" // For data URLs
    ],
    'media-src': [
        "'self'",
        "blob:",
        "data:"
    ],
    'worker-src': [
        "'self'",
        "blob:"
    ],
    'child-src': [
        "'self'",
        "blob:"
    ],
    'frame-src': [
        "'self'",
        "https://omniblocks.github.io" // For music editor iframe
    ],
    'object-src': ["'none'"], // Disable plugins
    'base-uri': ["'self'"], // Restrict base tag
    'form-action': ["'self'"] // Restrict form submissions
};

/**
 * Generate CSP header string
 * @returns {string} CSP header value
 */
export function generateCSPHeader() {
    const policies = [];
    
    for (const [directive, sources] of Object.entries(CSP_CONFIG)) {
        policies.push(`${directive} ${sources.join(' ')}`);
    }
    
    return policies.join('; ');
}

/**
 * Security headers configuration
 */
export const SECURITY_HEADERS = {
    'Content-Security-Policy': generateCSPHeader(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()'
};

/**
 * Apply security headers to the document
 */
export function applySecurityHeaders() {
    // Add meta tags for security headers that can be set via HTML
    const head = document.head;
    
    // CSP meta tag
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = generateCSPHeader();
    head.appendChild(cspMeta);
    
    // X-Content-Type-Options
    const nosniffMeta = document.createElement('meta');
    nosniffMeta.httpEquiv = 'X-Content-Type-Options';
    nosniffMeta.content = 'nosniff';
    head.appendChild(nosniffMeta);
    
    // Referrer Policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    head.appendChild(referrerMeta);
}
