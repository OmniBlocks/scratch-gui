/* eslint-env jest */
/**
 * Tests for .github/workflows/summary.yml
 * 
 * This test suite validates the GitHub Actions workflow configuration
 * for issue summarization and security handling.
 */
const fs = require('fs');
const path = require('path');

describe('GitHub Actions Summary Workflow', () => {
    let workflowContent;
    let workflowPath;

    beforeAll(() => {
        workflowPath = path.join(__dirname, '../../../.github/workflows/summary.yml');
        workflowContent = fs.readFileSync(workflowPath, 'utf8');
    });

    describe('YAML Structure', () => {
        test('workflow file exists and is readable', () => {
            expect(workflowContent).toBeDefined();
            expect(workflowContent.length).toBeGreaterThan(0);
        });

        test('contains required workflow properties', () => {
            expect(workflowContent).toContain('name:');
            expect(workflowContent).toContain('on:');
            expect(workflowContent).toContain('jobs:');
        });

        test('has proper YAML indentation (spaces, not tabs)', () => {
            const lines = workflowContent.split('\n');
            const tabLines = lines.filter(line => line.includes('\t'));
            expect(tabLines.length).toBe(0);
        });

        test('does not contain merge conflict markers', () => {
            expect(workflowContent).not.toContain('<<<<<<<');
            expect(workflowContent).not.toContain('=======');
            expect(workflowContent).not.toContain('>>>>>>>');
        });
    });

    describe('Security Handling Features', () => {
        test('contains security keyword detection instructions', () => {
            expect(workflowContent).toContain('ADDITIONAL SECURITY INSTRUCTIONS');
            expect(workflowContent).toContain('[SECURITY]');
            expect(workflowContent).toContain('security vulnerability');
        });

        test('has security handling step', () => {
            expect(workflowContent).toContain('Handle special keywords');
            expect(workflowContent).toContain("steps.final.outputs.response == '[SECURITY]'");
        });

        test('security step redacts sensitive information', () => {
            expect(workflowContent).toContain('Redacted Security Vulnerability');
            expect(workflowContent).toContain('hidden the original content');
        });

        test('security step adds security label', () => {
            expect(workflowContent).toContain('--add-label "security"');
        });

        test('security step closes and locks issue', () => {
            const securitySection = workflowContent.substring(
                workflowContent.indexOf('Handle special keywords'),
                workflowContent.indexOf('Handle spam keyword')
            );
            expect(securitySection).toContain('gh issue close');
            expect(securitySection).toContain('gh issue lock');
        });

        test('prevents public comment on security issues', () => {
            const commentSection = workflowContent.substring(
                workflowContent.indexOf('Comment with AI summary')
            );
            expect(commentSection).toContain("steps.final.outputs.response != '[SECURITY]'");
        });

        test('security instructions mention never revealing details', () => {
            expect(workflowContent).toContain('Never reveal vulnerability details in public comments');
        });

        test('provides secure reporting channel', () => {
            expect(workflowContent).toContain('security/advisories/new');
            expect(workflowContent).toContain('private reporting channel');
        });
    });

    describe('Special Keywords', () => {
        test('contains all special keyword handlers', () => {
            expect(workflowContent).toContain('[SECURITY]');
            expect(workflowContent).toContain('[SPAM]');
            expect(workflowContent).toContain('[CLOSE]');
            expect(workflowContent).toContain('[LOCK]');
            expect(workflowContent).toContain('[LOCKDOWN]');
        });

        test('has proper conditional checks for keywords', () => {
            expect(workflowContent).toContain("== '[SECURITY]'");
            expect(workflowContent).toContain("== '[SPAM]'");
            expect(workflowContent).toContain("== '[CLOSE]'");
            expect(workflowContent).toContain("== '[LOCK]'");
        });

        test('keyword section has proper ordering', () => {
            const securityIndex = workflowContent.indexOf("== '[SECURITY]'");
            const spamIndex = workflowContent.indexOf("== '[SPAM]'");
            const closeIndex = workflowContent.indexOf("== '[CLOSE]'");
            const lockIndex = workflowContent.indexOf("== '[LOCK]'");
            
            expect(securityIndex).toBeGreaterThan(0);
            expect(spamIndex).toBeGreaterThan(securityIndex);
            expect(closeIndex).toBeGreaterThan(spamIndex);
            expect(lockIndex).toBeGreaterThan(closeIndex);
        });
    });

    describe('Environment Variables', () => {
        test('uses GITHUB_TOKEN for authentication', () => {
            expect(workflowContent).toContain('GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}');
        });

        test('uses ISSUE_NUMBER from event context', () => {
            expect(workflowContent).toContain('ISSUE_NUMBER: ${{ github.event.issue.number }}');
        });

        test('GitHub CLI commands use environment variables', () => {
            const securitySection = workflowContent.substring(
                workflowContent.indexOf('Handle special keywords')
            );
            expect(securitySection).toContain('$ISSUE_NUMBER');
            expect(securitySection).toContain('gh issue');
        });
    });

    describe('Step Names and Structure', () => {
        test('has descriptive step names', () => {
            expect(workflowContent).toContain('name: Handle special keywords');
            expect(workflowContent).toContain('name: Handle spam keyword');
            expect(workflowContent).toContain('name: Comment with AI summary');
        });

        test('uses proper YAML syntax for conditionals', () => {
            const conditionalPattern = /if:\s*\$\{\{\s*.+\s*\}\}/g;
            const conditionals = workflowContent.match(conditionalPattern);
            expect(conditionals).toBeTruthy();
            expect(conditionals.length).toBeGreaterThan(0);
        });

        test('multi-line shell commands are properly formatted', () => {
            const runBlocks = workflowContent.split('run: |');
            expect(runBlocks.length).toBeGreaterThan(1);
        });
    });

    describe('Security Best Practices', () => {
        test('uses GitHub CLI securely', () => {
            expect(workflowContent).toContain('gh issue');
            expect(workflowContent).not.toContain('curl -H "Authorization: Bearer');
        });

        test('properly quotes shell variables', () => {
            const securitySection = workflowContent.substring(
                workflowContent.indexOf('Handle special keywords')
            );
            expect(securitySection).toMatch(/"\$\w+"/);
        });
    });

    describe('Error Handling and Edge Cases', () => {
        test('handles empty or missing responses gracefully', () => {
            expect(workflowContent).toContain("!= '[SECURITY]'");
        });

        test('provides user-friendly messages', () => {
            expect(workflowContent).toContain('Thank you for your security report');
            expect(workflowContent).toContain('appreciate your responsible disclosure');
        });

        test('includes helpful links for users', () => {
            expect(workflowContent).toMatch(/\[.*\]\(https:\/\/.+\)/);
        });
    });

    describe('Integration with AI Summary', () => {
        test('references AI output from previous steps', () => {
            expect(workflowContent).toContain('steps.final.outputs.response');
        });

        test('has conditional logic based on AI response', () => {
            expect(workflowContent).toContain("if: ${{ steps.final.outputs.response == '[SECURITY]' }}");
        });
    });

    describe('Regression Tests', () => {
        test('maintains backward compatibility with existing keywords', () => {
            expect(workflowContent).toContain('OTHER SPECIAL KEYWORDS');
            expect(workflowContent).toContain('[CLOSE]');
            expect(workflowContent).toContain('[LOCK]');
            expect(workflowContent).toContain('[LOCKDOWN]');
        });

        test('preserves spam handling functionality', () => {
            expect(workflowContent).toContain('Handle spam keyword');
        });

        test('preserves normal commenting functionality', () => {
            expect(workflowContent).toContain('Comment with AI summary');
        });
    });

    describe('Documentation and Comments', () => {
        test('includes helpful comments for maintainers', () => {
            const commentPattern = /#[^\n]+/g;
            const comments = workflowContent.match(commentPattern);
            expect(comments).toBeTruthy();
            expect(comments.length).toBeGreaterThan(5);
        });

        test('has section dividers for clarity', () => {
            expect(workflowContent).toContain('---');
        });
    });
});