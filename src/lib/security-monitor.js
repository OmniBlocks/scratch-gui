/**
 * Security monitoring system for OmniBlocks
 * Tracks suspicious behavior and provides alerts
 */

import log from './log';

// Security event types
export const SECURITY_EVENTS = {
    SPAM_DETECTED: 'spam_detected',
    RATE_LIMIT_HIT: 'rate_limit_hit',
    SUSPICIOUS_FILE: 'suspicious_file',
    INVALID_INPUT: 'invalid_input',
    REPEATED_FAILURES: 'repeated_failures'
};

// Security monitoring storage
const securityEvents = [];
const suspiciousUsers = new Map();

/**
 * Log a security event
 * @param {string} eventType - Type of security event
 * @param {Object} details - Event details
 * @param {string} userIdentifier - User identifier
 */
export function logSecurityEvent(eventType, details, userIdentifier = 'anonymous') {
    const event = {
        type: eventType,
        timestamp: Date.now(),
        userIdentifier,
        details,
        id: Math.random().toString(36).substr(2, 9)
    };
    
    securityEvents.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (securityEvents.length > 1000) {
        securityEvents.shift();
    }
    
    // Update suspicious user tracking
    updateSuspiciousUserScore(userIdentifier, eventType);
    
    // Log to console for debugging
    log.warn('Security Event:', event);
    
    // Check if user should be flagged
    checkUserSuspiciousLevel(userIdentifier);
}

/**
 * Update suspicious user score
 * @param {string} userIdentifier - User identifier
 * @param {string} eventType - Type of security event
 */
function updateSuspiciousUserScore(userIdentifier, eventType) {
    if (!suspiciousUsers.has(userIdentifier)) {
        suspiciousUsers.set(userIdentifier, {
            score: 0,
            events: [],
            firstSeen: Date.now(),
            lastActivity: Date.now()
        });
    }
    
    const userData = suspiciousUsers.get(userIdentifier);
    userData.lastActivity = Date.now();
    userData.events.push({
        type: eventType,
        timestamp: Date.now()
    });
    
    // Score different events differently
    const eventScores = {
        [SECURITY_EVENTS.SPAM_DETECTED]: 10,
        [SECURITY_EVENTS.RATE_LIMIT_HIT]: 5,
        [SECURITY_EVENTS.SUSPICIOUS_FILE]: 8,
        [SECURITY_EVENTS.INVALID_INPUT]: 3,
        [SECURITY_EVENTS.REPEATED_FAILURES]: 7
    };
    
    userData.score += eventScores[eventType] || 1;
    
    // Keep only recent events (last hour)
    const oneHour = 60 * 60 * 1000;
    userData.events = userData.events.filter(
        event => Date.now() - event.timestamp < oneHour
    );
}

/**
 * Check if user should be flagged as highly suspicious
 * @param {string} userIdentifier - User identifier
 */
function checkUserSuspiciousLevel(userIdentifier) {
    const userData = suspiciousUsers.get(userIdentifier);
    if (!userData) return;
    
    // Flag users with high scores
    if (userData.score > 20) {
        log.error(`Highly suspicious user detected: ${userIdentifier} (score: ${userData.score})`);
        
        // Could implement additional actions here:
        // - Show warning to user
        // - Temporarily restrict actions
        // - Send alert to administrators
    }
}

/**
 * Get security statistics
 * @returns {Object} Security statistics
 */
export function getSecurityStats() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const recentEvents = securityEvents.filter(
        event => now - event.timestamp < oneHour
    );
    
    const eventCounts = {};
    for (const event of recentEvents) {
        eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
    }
    
    return {
        totalEvents: securityEvents.length,
        recentEvents: recentEvents.length,
        eventCounts,
        suspiciousUsers: suspiciousUsers.size,
        highRiskUsers: Array.from(suspiciousUsers.values())
            .filter(user => user.score > 15).length
    };
}

/**
 * Clear old security data
 */
export function cleanupSecurityData() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    // Remove old suspicious users
    for (const [identifier, userData] of suspiciousUsers.entries()) {
        if (now - userData.lastActivity > oneDay) {
            suspiciousUsers.delete(identifier);
        }
    }
    
    // Remove old events
    const cutoff = now - oneDay;
    while (securityEvents.length > 0 && securityEvents[0].timestamp < cutoff) {
        securityEvents.shift();
    }
}

// Clean up old data every 10 minutes
setInterval(cleanupSecurityData, 10 * 60 * 1000);
