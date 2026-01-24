# Code Quality & Standards Check Workflow

## Overview

The **Code Quality Check** workflow is an automated GitHub Actions workflow that analyzes code for quality issues, security vulnerabilities, and deprecated patterns. It runs on all pull requests and pushes to main/develop branches.

## What It Checks

### 1. 🔄 Deprecated React Patterns

Detects legacy React patterns that should be migrated to modern alternatives:

- **Deprecated Lifecycle Methods**:
  - `componentWillMount()` → Use `componentDidMount()` or hooks
  - `componentWillReceiveProps()` → Use `componentDidUpdate()` or `getDerivedStateFromProps()`
  - `componentWillUpdate()` → Use `componentDidUpdate()` or `getSnapshotBeforeUpdate()`
  
- **UNSAFE_ Methods**: Even with the `UNSAFE_` prefix, these are still deprecated

- **React.createClass**: Legacy API, should use ES6 classes or function components

- **String Refs**: Pattern like `ref="myRef"` is deprecated, use callback refs or `createRef()`

**Why it matters**: Deprecated methods may be removed in future React versions and can cause performance issues.

### 2. 🤖 AI-Generated Code Detection

Identifies patterns commonly found in AI-generated code:

- **Verbose Comments**: Excessive "This function...", "This method..." style comments
- **AI Placeholders**: "TODO: Implement", "Add your code here", etc.
- **Perfect JSDoc**: Suspiciously complete documentation (may indicate copy-paste)
- **Overly Long Names**: Variable/function names longer than 30 characters
- **AI Service Mentions**: Accidental inclusion of "ChatGPT", "Claude", "GPT-4", etc.

**Why it matters**: AI-generated code should be reviewed for quality, correctness, and project fit. This is about **quality assurance**, not banning AI tools.

### 3. 🔄 Code Duplication

Uses `jscpd` to find copy-pasted code blocks:

- **Threshold**: 5% duplication
- **Minimum**: 10 lines or 50 tokens to be considered duplicate
- **Excludes**: Tests, build artifacts, node_modules

**Why it matters**: Duplicated code is harder to maintain. Bugs need to be fixed in multiple places, and refactoring becomes difficult.

### 4. 🔒 Security & Ethics

Scans for security vulnerabilities and unsafe patterns:

- **🚨 CRITICAL: Hardcoded Secrets (Automated Security Check)**
  - Detects patterns like `password = "..."`, `api_key = "..."`, `secret = "..."`, `token = "..."`
  - **Action Required**: Remove any detected secrets immediately and rotate any exposed credentials
  - Use environment variables or GitHub Secrets instead
  - Creates a DRAFT security advisory (private until fixed)

- **⚠️ eval() Usage**
  - Allows arbitrary code execution (security risk)
  - Consider safer alternatives like JSON parsing

- **⚠️ Unsafe HTML Injection**
  - `dangerouslySetInnerHTML` and `innerHTML` without sanitization
  - Can lead to XSS (Cross-Site Scripting) attacks
  - Always sanitize user input before rendering HTML

- **⚠️ Disabled Security Checks**
  - `eslint-disable security` or similar comments
  - May hide real security issues

- **ℹ️ Excessive Console Logs**
  - Not a security issue, but suggests debugging code left in production

## How It Works

### Workflow Triggers

The workflow runs automatically on:
- **Pull Requests**: opened, synchronized, or reopened
- **Pushes**: to `main` or `develop` branches

### Process

1. **Checkout code** and install dependencies
2. **Run checks** in parallel for speed
3. **Generate report** with findings
4. **Post comment** on PR with detailed results
5. **Upload artifacts** with full reports (retained for 30 days)
6. **Fail workflow** if critical issues found (deprecated patterns or security violations)

### Output

The workflow produces:
- **PR Comment**: Detailed report with all findings
- **Workflow Summary**: Quick overview in GitHub Actions
- **Artifacts**: Full jscpd reports for download

## Understanding the Report

### ✅ All Checks Passed

```
## 🔍 Code Quality Analysis Report

### ✅ All Checks Passed!

No code quality issues detected. Great work! 🎉

- ✅ No deprecated React patterns
- ✅ No obvious AI-generated code markers
- ✅ No significant code duplication
- ✅ No security or ethical violations
```

Your code is clean! No action needed.

### ⚠️ Issues Detected

```
## 🔍 Code Quality Analysis Report

### Issues Detected

## ❌ Deprecated React Patterns

### Deprecated Lifecycle Methods Found:
```
src/components/Example.jsx:15: componentWillMount() {
src/components/Another.jsx:22: componentWillReceiveProps(nextProps) {
```

**Recommendation:** Migrate to modern React patterns (hooks, function components)
```

Each section includes:
- **Files and line numbers** where issues were found
- **Specific code snippets** showing the problem
- **Recommendations** for fixing the issues

## Fixing Issues

### Deprecated React Patterns

**Before:**
```jsx
class MyComponent extends React.Component {
    componentWillMount() {
        this.loadData();
    }
}
```

**After (using hooks):**
```jsx
function MyComponent() {
    useEffect(() => {
        loadData();
    }, []); // Empty array = run once on mount
}
```

### Hardcoded Secrets

**Before:**
```js
const apiKey = "sk-1234567890abcdef";
fetch(`https://api.example.com?key=${apiKey}`);
```

**After:**
```js
const apiKey = process.env.API_KEY;  // Set in .env file
fetch(`https://api.example.com?key=${apiKey}`);
```

**Important**: If real secrets were committed, you must:
1. Remove them from the code
2. **Rotate/invalidate** the exposed credentials immediately
3. Add them to `.gitignore` or use GitHub Secrets

### Code Duplication

**Before:**
```js
// In FileA.js
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// In FileB.js (duplicate!)
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}
```

**After:**
```js
// In utils/validation.js
export function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// In FileA.js and FileB.js
import { validateEmail } from './utils/validation';
```

## Configuration

### Customizing Thresholds

Edit `.jscpd.json` to adjust duplicate detection:

```json
{
  "threshold": 5,       // Fail if >5% duplication
  "minLines": 10,       // Minimum 10 lines to count as duplicate
  "minTokens": 50,      // Minimum 50 tokens to count as duplicate
  "ignore": [
    "**/*.min.js",
    "**/node_modules/**",
    "**/build/**"
  ]
}
```

### Disabling Checks (Not Recommended)

If you need to temporarily disable a check:

```yaml
# In .github/workflows/code-quality-check.yml
- name: Check for deprecated React functions
  if: false  # Disables this step
```

**Warning**: Only disable checks if you have a very good reason. Security checks should never be disabled.

## FAQ

### Q: Will this block my PR from merging?

**A**: It depends on what was found:
- **Security violations** (hardcoded secrets, use of `eval`, etc.) will **block** your PR until fixed.
- **Deprecated React patterns** may **warn or block** depending on configuration. The workflow currently fails on these patterns, but since there are 11 known legacy usages inherited from upstream Scratch/TurboWarp, the workflow only scans changed files in PRs to avoid blocking existing code.

Non-critical issues (AI markers, some duplicates) will warn but won't block.

### Q: What if I'm using AI tools like GitHub Copilot?

**A**: That's fine! The workflow detects **patterns**, not whether AI was used. It's checking:
- Code quality (verbose comments, placeholder text)
- Correctness (did you review what was generated?)

Review AI suggestions before committing, and you'll be fine.

### Q: My code uses `dangerouslySetInnerHTML` safely. How do I handle this?

**A**: Add a comment explaining why it's safe:

```jsx
// SAFETY: Content is sanitized via DOMPurify in sanitizeHtml() above
<div dangerouslySetInnerHTML={{__html: sanitizedContent}} />
```

The workflow will still flag it, but reviewers will understand the context.

### Q: What about test files?

**A**: The workflow excludes the `test/` directory from duplicate detection. However, deprecated patterns and security issues are still checked in tests.

### Q: Can I run this locally?

**A**: Yes! Install jscpd globally:

```bash
npm install -g jscpd
```

Then run individual checks:

```bash
# Check for duplicates
jscpd src/

# Check for deprecated React patterns
grep -r "componentWillMount\|componentWillReceiveProps" --include="*.js" --include="*.jsx" src/

# Check for hardcoded secrets
grep -r "password\s*=\s*['\"].\+['\"]\|api_key\s*=\s*['\"].\+['\"]" --include="*.js" src/
```

## Best Practices

1. **Review Before Committing**: Read through code before pushing, especially AI-generated code
2. **Use Modern React**: Prefer hooks and function components over class components
3. **DRY Principle**: Don't Repeat Yourself - refactor duplicated code
4. **Never Commit Secrets**: Use environment variables and `.env` files (add to `.gitignore`)
5. **Sanitize User Input**: Always sanitize before using `dangerouslySetInnerHTML`
6. **Keep Dependencies Updated**: Old dependencies may have deprecated patterns

## Troubleshooting

### False Positives

If you get flagged incorrectly:

1. **Check the context**: Is it really a false positive?
2. **Add a comment**: Explain why the pattern is necessary
3. **File an issue**: If it's a workflow bug, let maintainers know

### Workflow Fails to Run

Check:
- Is the workflow file in `.github/workflows/`?
- Does the file have correct YAML syntax?
- Are there sufficient permissions in the workflow?

### "No such file or directory" Errors

The workflow expects:
- Source code in `src/` directory
- Node.js project with `package.json`
- NPM dependencies installable via `npm ci`

## Contributing

Found a pattern we should check for? Open an issue or PR!

Suggested additions:
- More deprecated patterns
- Better AI detection heuristics
- Additional security checks
- Language-specific checks (TypeScript, etc.)

---

**Last Updated**: January 2025  
**Maintainer**: OmniBlocks Team  
**Feedback**: Open an issue on GitHub
