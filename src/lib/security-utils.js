/**
 * Security utilities for spam/scammer defense in OmniBlocks
 * Provides content filtering, rate limiting, and input validation
 */

// Spam/scam detection patterns
const SPAM_PATTERNS = [
    // Common scam phrases
    /free\s*(robux|money|cash|gift)/i,
    /click\s*(here|link|this)/i,
    /visit\s*(my|this)\s*(website|site|link)/i,
    /download\s*(hack|cheat|mod)/i,
    /get\s*(free|unlimited)\s*(robux|money)/i,
    
    // Suspicious URLs and domains
    /bit\.ly|tinyurl|t\.co|goo\.gl/i,
    /discord\.gg|discord\.com\/invite/i,
    /youtube\.com\/watch|youtu\.be/i,
    
    // Phishing attempts
    /scratch\.mit\.edu.*login/i,
    /enter\s*(password|username)/i,
    /verify\s*(account|email)/i,
    
    // Excessive repetition (3+ repeated chars)
    /(.)\1{3,}/,
    
    // All caps (5+ consecutive caps)
    /[A-Z]{5,}/,
    
    // Excessive punctuation
    /[!?]{3,}/
];

// Inappropriate content patterns
const INAPPROPRIATE_PATTERNS = [
    // Add patterns for inappropriate language
    // Note: Being conservative to avoid false positives
    /\b(spam|scam|hack|cheat)\b/i
];

// Rate limiting storage (in-memory for now)
const rateLimitStore = new Map();

/**
 * Clean up old rate limit entries
 */
function cleanupRateLimit() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    for (const [key, data] of rateLimitStore.entries()) {
        if (now - data.firstAttempt > oneHour) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Check if action is rate limited
 * @param {string} identifier - User identifier (IP, session, etc.)
 * @param {string} action - Action type ('upload', 'save', etc.)
 * @param {number} maxAttempts - Maximum attempts per hour
 * @returns {boolean} - True if rate limited
 */
export function isRateLimited(identifier, action, maxAttempts = 10) {
    cleanupRateLimit();
    
    const key = `${identifier}_${action}`;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    if (!rateLimitStore.has(key)) {
        rateLimitStore.set(key, {
            count: 1,
            firstAttempt: now
        });
        return false;
    }
    
    const data = rateLimitStore.get(key);
    
    // Reset if more than an hour has passed
    if (now - data.firstAttempt > oneHour) {
        rateLimitStore.set(key, {
            count: 1,
            firstAttempt: now
        });
        return false;
    }
    
    data.count++;
    return data.count > maxAttempts;
}

/**
 * Sanitize text input to prevent XSS
 * @param {string} input - Input text to sanitize
 * @returns {string} - Sanitized text
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .replace(/[<>]/g, '') // Remove angle brackets
        .replace(/javascript:/gi, '') // Remove javascript: protocol
        .replace(/on\w+\s*=/gi, '') // Remove event handlers
        .trim()
        .substring(0, 1000); // Limit length
}

/**
 * Check if text contains spam or inappropriate content
 * @param {string} text - Text to check
 * @returns {Object} - {isSpam: boolean, reason: string}
 */
export function checkForSpam(text) {
    if (!text || typeof text !== 'string') {
        return { isSpam: false, reason: null };
    }
    
    const cleanText = text.toLowerCase().trim();
    
    // Check spam patterns
    for (const pattern of SPAM_PATTERNS) {
        if (pattern.test(text)) {
            return { 
                isSpam: true, 
                reason: 'Contains suspicious content or links' 
            };
        }
    }
    
    // Check inappropriate content
    for (const pattern of INAPPROPRIATE_PATTERNS) {
        if (pattern.test(text)) {
            return { 
                isSpam: true, 
                reason: 'Contains inappropriate content' 
            };
        }
    }
    
    // Check for excessive repetition of words
    const words = cleanText.split(/\s+/);
    const wordCount = {};
    for (const word of words) {
        if (word.length > 2) {
            wordCount[word] = (wordCount[word] || 0) + 1;
            if (wordCount[word] > 5) {
                return { 
                    isSpam: true, 
                    reason: 'Excessive repetition detected' 
                };
            }
        }
    }
    
    return { isSpam: false, reason: null };
}

/**
 * Validate file upload for security
 * @param {File} file - File to validate
 * @returns {Object} - {isValid: boolean, reason: string}
 */
export function validateFileUpload(file) {
    if (!file) {
        return { isValid: false, reason: 'No file provided' };
    }
    
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
        return { 
            isValid: false, 
            reason: 'File too large (max 50MB)' 
        };
    }
    
    // Check file extension
    const allowedExtensions = ['.sb', '.sb2', '.sb3'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => 
        fileName.endsWith(ext)
    );
    
    if (!hasValidExtension) {
        return { 
            isValid: false, 
            reason: 'Invalid file type. Only .sb, .sb2, and .sb3 files are allowed' 
        };
    }
    
    // Check filename for suspicious content
    const spamCheck = checkForSpam(file.name);
    if (spamCheck.isSpam) {
        return { 
            isValid: false, 
            reason: `Suspicious filename: ${spamCheck.reason}` 
        };
    }
    
    return { isValid: true, reason: null };
}

/**
 * Show a user-friendly security alert
 * @param {string} type - Alert type ('warning', 'error', 'info')
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 * @param {Function} onAction - Optional action callback
 */
export function showSecurityAlert(type, title, message, onAction = null) {
    // Create a temporary alert element
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        max-width: 400px;
        background: white;
        border: 1px solid #ddd;
        border-left: 4px solid ${type === 'error' ? '#dc3545' : '#ffc107'};
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        padding: 16px;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    `;
    
    alertDiv.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px; color: #333;">${title}</div>
        <div style="color: #666; font-size: 14px; margin-bottom: 12px;">${message}</div>
        <button onclick="this.parentElement.remove()" style="
            background: #ff6680;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        ">OK</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 10000);
}

/**
 * Generate a simple user identifier for rate limiting
 * @returns {string} User identifier
 */
export function generateUserIdentifier() {
    // Simple identifier based on session and timestamp
    // In a real app, this could use IP address, user ID, etc.
    const sessionId = sessionStorage.getItem('omniblocks_session') || 
        Math.random().toString(36).substr(2, 9);
    
    if (!sessionStorage.getItem('omniblocks_session')) {
        sessionStorage.setItem('omniblocks_session', sessionId);
    }
    
    return `user_${sessionId}`;
}
