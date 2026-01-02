# OmniBlocks Security Features

This document outlines the security and anti-spam features implemented in OmniBlocks to protect users from scammers and malicious content.

## 🛡️ Overview

OmniBlocks includes comprehensive security measures to defend against:
- Spam and scam content
- Malicious file uploads
- Rate limiting abuse
- Cross-site scripting (XSS) attacks
- Inappropriate content

## 🔍 Content Filtering

### Spam Detection Patterns
The system automatically detects and blocks content containing:

**Common Scam Phrases:**
- "Free robux/money/cash/gift"
- "Click here/link/this"
- "Visit my/this website/site/link"
- "Download hack/cheat/mod"
- "Get free/unlimited robux/money"

**Suspicious URLs:**
- Shortened URLs (bit.ly, tinyurl, t.co, goo.gl)
- Discord invite links
- YouTube links (in inappropriate contexts)

**Phishing Attempts:**
- Fake Scratch login pages
- Requests for passwords/usernames
- Account verification scams

**Content Quality Issues:**
- Excessive character repetition (3+ repeated characters)
- All caps text (5+ consecutive capitals)
- Excessive punctuation (3+ repeated punctuation marks)
- Word repetition (same word repeated 5+ times)

### Implementation
Content filtering is applied to:
- Project titles and descriptions
- File names
- User-generated text content

## ⏱️ Rate Limiting

### Upload Rate Limits
- **File Uploads:** 5 attempts per hour per user
- **Project Saves:** 20 attempts per hour per user
- **New Projects:** 10 attempts per hour per user
- **Project Copies:** 5 attempts per hour per user
- **Project Remixes:** 5 attempts per hour per user

### User Identification
Rate limiting uses session-based user identification:
- Generates unique session ID stored in sessionStorage
- Tracks actions per session to prevent abuse
- Automatically cleans up old rate limit data

## 📁 File Upload Security

### File Validation
- **File Size Limit:** Maximum 50MB per file
- **File Type Restriction:** Only .sb, .sb2, and .sb3 files allowed
- **Filename Scanning:** Checks filenames for suspicious content
- **Content Validation:** Basic validation of file structure

### Security Checks
1. File extension validation
2. File size limits
3. Filename spam detection
4. Rate limiting enforcement

## 🧹 Input Sanitization

### XSS Prevention
All user inputs are sanitized to prevent cross-site scripting:
- Removes HTML angle brackets (`<>`)
- Strips `javascript:` protocol
- Removes event handlers (`onclick`, `onload`, etc.)
- Limits input length to 1000 characters
- Trims whitespace

### Safe Content Handling
- Project titles are sanitized before display
- File names are cleaned before processing
- User-generated content is validated

## 🔒 Security Headers

### Content Security Policy (CSP)
Implements strict CSP headers to prevent:
- Unauthorized script execution
- Data injection attacks
- Clickjacking attempts

### Additional Security Headers
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` for camera, microphone, geolocation

## 📊 Security Monitoring

### Event Tracking
The system logs security events including:
- Spam detection incidents
- Rate limit violations
- Suspicious file uploads
- Invalid input attempts
- Repeated failures

### User Behavior Analysis
- Tracks suspicious user patterns
- Assigns risk scores based on behavior
- Flags high-risk users for review
- Automatic cleanup of old monitoring data

### Security Dashboard
Administrators can access a security dashboard (Ctrl+Shift+S) showing:
- Total security events
- Recent activity (last hour)
- Event breakdown by type
- Suspicious user counts
- High-risk user statistics

## 🚨 User Alerts

### Security Notifications
Users receive friendly alerts when:
- Upload attempts are rate limited
- Files are blocked for security reasons
- Suspicious content is detected
- Security violations occur

### Alert Types
- **Warning:** Rate limits, suspicious content
- **Error:** Blocked uploads, security violations
- **Info:** General security notifications

## 🔧 Configuration

### Customizable Settings
Security features can be adjusted:
- Rate limit thresholds
- Spam detection patterns
- File size limits
- Content filtering rules

### Development Mode
- Security dashboard always available
- Enhanced logging for debugging
- Detailed error messages

## 🛠️ Implementation Files

### Core Security Files
- `src/lib/security-utils.js` - Main security utilities
- `src/lib/security-config.js` - Security configuration and CSP
- `src/lib/security-monitor.js` - Event monitoring and tracking
- `src/components/security-dashboard/` - Admin dashboard
- `src/components/security-alert/` - User alert system

### Integration Points
- `src/lib/sb-file-uploader-hoc.jsx` - File upload security
- `src/lib/project-saver-hoc.jsx` - Project saving security
- `src/components/gui/gui.jsx` - Main GUI integration

## 📈 Future Enhancements

Planned security improvements:
- Machine learning-based spam detection
- IP-based rate limiting
- User reputation system
- Advanced file content scanning
- Integration with external security services
- Real-time threat intelligence

## 🤝 Contributing

When contributing security features:
1. Follow the existing security patterns
2. Add comprehensive tests
3. Document new security measures
4. Consider privacy implications
5. Test with various attack scenarios

## 📞 Reporting Security Issues

If you discover security vulnerabilities:
1. Do NOT create public issues
2. Contact maintainers privately
3. Provide detailed reproduction steps
4. Allow time for fixes before disclosure

---

**Remember:** Security is an ongoing process. These features provide a strong foundation, but should be regularly updated and improved based on new threats and user feedback.
