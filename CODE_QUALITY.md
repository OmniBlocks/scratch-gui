# Code Quality Workflow - Quick Reference

## What This Workflow Does

Automatically checks your code for:
- 🔄 **Deprecated React patterns** (11 instances currently in codebase)
- 🤖 **AI-generated code markers** (quality assurance)
- 📋 **Duplicate code** (copy-paste detection)
- 🔒 **Security issues** (hardcoded secrets, XSS risks)

## When It Runs

- ✅ Every pull request
- ✅ Pushes to `main` or `develop`

## What Happens

1. Workflow runs automatically
2. Posts detailed report as PR comment
3. Uploads full reports as artifacts
4. **Fails if critical issues found**

## Current Codebase Status

As of January 2025:
- **11 deprecated React methods** detected in src/
  - `componentWillReceiveProps` in 10 files
  - `componentWillMount` in 1 file
- These are **legacy patterns** inherited from Scratch/TurboWarp
- Migration to hooks/modern React is recommended but not urgent

## For Contributors

### If Your PR Gets Flagged

**Don't panic!** The workflow is here to help, not block. Here's what to do:

1. **Read the report** - Check PR comments for details
2. **Assess severity**:
   - 🚨 **Critical** (hardcoded secrets, deprecated): Fix before merge
   - ⚠️ **Warning** (AI markers, duplicates): Review and improve if possible
3. **Fix issues** - Follow recommendations in the report
4. **Push changes** - Workflow runs again automatically

### Common Scenarios

#### "My code uses AI tools like Copilot"
**That's fine!** We use AI tools too. The check is about:
- Reviewing what AI generated
- Removing placeholder comments
- Ensuring code quality

Just review and clean up the output before committing.

#### "I have a hardcoded API key"
**🚨 STOP!** This is critical:
1. Remove the hardcoded secret immediately
2. Use environment variables: `process.env.API_KEY`
3. If it's a real key, **rotate it** (invalidate and create new)
4. Add `.env` to `.gitignore`

#### "My code has duplicates"
**Consider refactoring**, but it's not urgent:
- Extract common code to utilities
- Use shared components
- Follow DRY (Don't Repeat Yourself) principle

#### "I'm fixing a deprecated React method"
**Great!** Migration path:
```jsx
// Old (deprecated)
componentWillReceiveProps(nextProps) {
  if (nextProps.value !== this.props.value) {
    this.setState({value: nextProps.value});
  }
}

// New (hooks)
useEffect(() => {
  setValue(props.value);
}, [props.value]);

// Or use getDerivedStateFromProps (class components)
static getDerivedStateFromProps(props, state) {
  if (props.value !== state.value) {
    return {value: props.value};
  }
  return null;
}
```

## For Maintainers

### Adjusting Thresholds

Edit `.jscpd.json`:
```json
{
  "threshold": 5,      // % duplication to fail
  "minLines": 10,      // minimum lines to count
  "minTokens": 50      // minimum tokens to count
}
```

### Disabling Checks (Emergency Only)

Edit `.github/workflows/code-quality-check.yml`:
```yaml
- name: Check for deprecated React functions
  if: false  # Temporarily disable
```

**Warning**: Only do this in emergencies. Re-enable ASAP.

### Monitoring

- **Artifacts**: Full jscpd reports available for 30 days
- **PR Comments**: Automatically posted on every PR
- **Actions Tab**: View workflow history

## Documentation

Full documentation: [`docs/CODE_QUALITY_WORKFLOW.md`](./docs/CODE_QUALITY_WORKFLOW.md)

Topics covered:
- Detailed explanation of each check
- How to fix common issues
- Configuration options
- FAQ and troubleshooting
- Best practices

## Questions?

- **Bug in workflow?** Open an issue with `workflow` label
- **False positive?** Open an issue with `code-quality` label
- **Need help fixing?** Ask in PR comments, maintainers will assist

---

**Remember**: This workflow is a **helper**, not a blocker. It catches issues early so you don't have to worry about them later! 🎉
