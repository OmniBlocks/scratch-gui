/**
 * Video Handler Utility for OmniBlocks Playwright Tests
 * Manages video recording and processing for error analysis
 */

const fs = require('fs');
const path = require('path');

class VideoHandler {
  constructor(testInfo) {
    this.testInfo = testInfo;
    this.videoPath = null;
  }

  async getVideoPath() {
    if (this.videoPath) {
      return this.videoPath;
    }

    // Wait for video to be available after test completion
    const attachments = this.testInfo.attachments;
    const videoAttachment = attachments.find(a => a.name === 'video');
    
    if (videoAttachment && videoAttachment.path) {
      this.videoPath = videoAttachment.path;
      return this.videoPath;
    }

    return null;
  }

  async copyVideoForIssue(errorId) {
    const originalPath = await this.getVideoPath();
    if (!originalPath || !fs.existsSync(originalPath)) {
      console.log('⚠️ No video found for error report');
      return null;
    }

    // Create error-videos directory if it doesn't exist
    const errorVideosDir = path.join(process.cwd(), 'test-results', 'error-videos');
    if (!fs.existsSync(errorVideosDir)) {
      fs.mkdirSync(errorVideosDir, { recursive: true });
    }

    // Copy video with error-specific name
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const errorVideoPath = path.join(errorVideosDir, `error-${errorId}-${timestamp}.webm`);
    
    try {
      fs.copyFileSync(originalPath, errorVideoPath);
      console.log(`📹 Video saved for error: ${errorVideoPath}`);
      return errorVideoPath;
    } catch (error) {
      console.error('Failed to copy video:', error);
      return null;
    }
  }

  async getVideoStats() {
    const videoPath = await this.getVideoPath();
    if (!videoPath || !fs.existsSync(videoPath)) {
      return null;
    }

    const stats = fs.statSync(videoPath);
    return {
      size: stats.size,
      created: stats.birthtime,
      path: videoPath
    };
  }
}

module.exports = { VideoHandler };
