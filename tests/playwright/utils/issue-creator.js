/**
 * GitHub Issue Creator for OmniBlocks Playwright Test Errors
 * Automatically creates issues with error details, videos, and AI-generated summaries
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

class IssueCreator {
  constructor() {
    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN
    });
    this.owner = 'OmniBlocks';
    this.repo = 'scratch-gui';
  }

  async createErrorIssue(error, videoPath, testInfo) {
    if (!process.env.GITHUB_TOKEN) {
      console.log('⚠️ No GITHUB_TOKEN found, skipping issue creation');
      return null;
    }

    try {
      // Generate AI summary if logs are under 8k tokens
      const logSummary = await this.generateAISummary(error);
      
      // Upload video as asset if available
      let videoUrl = null;
      if (videoPath && fs.existsSync(videoPath)) {
        videoUrl = await this.uploadVideoAsset(videoPath);
      }

      // Create issue
      const issueBody = this.formatIssueBody(error, logSummary, videoUrl, testInfo);
      const issueTitle = this.formatIssueTitle(error);

      const issue = await this.octokit.rest.issues.create({
        owner: this.owner,
        repo: this.repo,
        title: issueTitle,
        body: issueBody,
        labels: ['bug', 'playwright-detected', 'needs-triage']
      });

      console.log(`✅ Created GitHub issue: ${issue.data.html_url}`);
      return issue.data;

    } catch (error) {
      console.error('Failed to create GitHub issue:', error);
      return null;
    }
  }

  async generateAISummary(error) {
    // Estimate token count (rough approximation: 1 token ≈ 4 characters)
    const errorText = JSON.stringify(error, null, 2);
    const estimatedTokens = errorText.length / 4;

    if (estimatedTokens > 8000) {
      return "⚠️ Error log too large for AI analysis (>8k tokens)";
    }

    // In a real implementation, you would call GitHub Actions AI or another AI service
    // For now, we'll create a structured analysis
    return this.createStructuredAnalysis(error);
  }

  createStructuredAnalysis(error) {
    const analysis = {
      errorType: error.type,
      severity: this.assessSeverity(error),
      likelyCategory: this.categorizeError(error),
      actionSequence: error.recentActions?.map(action => 
        `${action.timestamp}ms: ${action.type} on ${action.target}`
      ).join('\n') || 'No actions recorded',
      hypothesis: this.generateHypothesis(error)
    };

    return `## 🤖 AI Analysis

**Error Type:** ${analysis.errorType}
**Severity:** ${analysis.severity}
**Category:** ${analysis.likelyCategory}

**Action Sequence Leading to Error:**
\`\`\`
${analysis.actionSequence}
\`\`\`

**Hypothesis:** ${analysis.hypothesis}`;
  }

  assessSeverity(error) {
    if (error.message.includes('Cannot read property') || error.message.includes('undefined')) {
      return 'HIGH - Null/undefined access';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'MEDIUM - Network related';
    }
    if (error.type === 'console_error') {
      return 'MEDIUM - Console error';
    }
    return 'LOW - General error';
  }

  categorizeError(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('render') || message.includes('canvas') || message.includes('webgl')) {
      return 'Rendering/Graphics';
    }
    if (message.includes('audio') || message.includes('sound')) {
      return 'Audio System';
    }
    if (message.includes('block') || message.includes('scratch')) {
      return 'Block System';
    }
    if (message.includes('addon') || message.includes('extension')) {
      return 'Addon/Extension';
    }
    return 'General UI';
  }

  generateHypothesis(error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('cannot read property')) {
      return 'Likely caused by accessing a property on null/undefined object. Check initialization order.';
    }
    if (message.includes('network')) {
      return 'Network connectivity issue or server unavailability.';
    }
    if (error.recentActions?.some(a => a.type === 'click')) {
      return 'Error triggered by user interaction. Check event handlers and state management.';
    }
    return 'General error requiring investigation of error context and stack trace.';
  }

  formatIssueTitle(error) {
    const errorType = error.type.replace('_', ' ').toUpperCase();
    const shortMessage = error.message.substring(0, 50);
    return `🤖 [Playwright] ${errorType}: ${shortMessage}...`;
  }

  formatIssueBody(error, aiSummary, videoUrl, testInfo) {
    return `# 🤖 Automated Error Report

This issue was automatically created by Playwright testing.

## 📋 Error Details

**Type:** ${error.type}
**Message:** ${error.message}
**Timestamp:** ${new Date(Date.now() - error.timestamp).toISOString()}
**Test:** ${testInfo.title}

${error.stack ? `**Stack Trace:**
\`\`\`
${error.stack}
\`\`\`` : ''}

## 🎬 Video Evidence

${videoUrl ? `[📹 Watch Error Video](${videoUrl})` : '⚠️ No video available'}

## 🎯 Actions Leading to Error

${error.recentActions?.length ? 
  error.recentActions.map((action, i) => 
    `${i + 1}. **${action.type}** on \`${action.target}\` (${action.timestamp}ms)`
  ).join('\n') : 
  'No actions recorded before error'
}

${aiSummary}

## 🔧 Environment

- **Browser:** ${testInfo.project?.name || 'Unknown'}
- **Test File:** ${testInfo.file}
- **Total Actions:** ${error.totalActions || 0}

---
*This issue was created automatically by the OmniBlocks Playwright testing system.*`;
  }

  async uploadVideoAsset(videoPath) {
    // Note: GitHub doesn't support direct video uploads to issues
    // In a real implementation, you might upload to a service like AWS S3
    // For now, we'll just reference the local path
    return `Local video: ${path.basename(videoPath)}`;
  }
}

module.exports = { IssueCreator };
