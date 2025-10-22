# Mega PR Test & Analysis Workflow

This document describes the upgraded CI/CD workflow for pull requests.

## Features

### 🎯 Smart Path-Based Execution
- **Source changes** (`src/**`): Triggers all tests
- **UI changes** (`src/**`, `**/*.css`, `stories/**`): Triggers accessibility and visual regression tests
- **Dependency changes** (`package.json`, `package-lock.json`): Triggers security audits

### 🚀 Modular Job Architecture
- **Plan & Filters**: Determines which jobs to run based on changed files
- **Setup**: Installs Node.js and dependencies
- **Lint**: Runs ESLint checks
- **Test & Coverage**: Runs Jest tests with coverage reporting
- **Build & Size**: Builds project with timing and bundle size analysis
- **Security**: Runs npm audit for vulnerabilities
- **Accessibility**: Runs pa11y accessibility tests (UI changes only)
- **Visual Regression**: Runs Playwright visual tests (UI changes only)
- **Summary**: Creates sticky PR comment with results
- **Leaderboard**: Updates cross-PR metrics in issue #275

### 📊 Enhanced Reporting
- **Progress bars**: Unicode spinners with ASCII fallback
- **Coverage visualization**: Progress bar showing test coverage percentage
- **Bundle size tracking**: Gzipped size analysis with size-limit
- **Build time metrics**: Millisecond-precision build timing
- **Sticky PR comments**: Single comment updated throughout the workflow

### 🏆 Cross-PR Leaderboard
- Tracks build time, bundle size, and coverage across all PRs
- Maintains persistent rankings in issue #275
- Score calculation: `(buildMs/500) + (sizeKb/10) - (covPct/2)`
- Lower scores are better (faster builds, smaller bundles, higher coverage)

## Configuration Files

### `.size-limit.json`
Configures bundle size analysis:
```json
[
  {
    "name": "App bundle",
    "path": "build/**/*.js",
    "limit": "500 kB",
    "gzip": true
  }
]
```

### `scripts/ci/progress.sh`
Provides Unicode-aware progress bars with ASCII fallback.

### `playwright.vrt.config.ts`
Configures Playwright for visual regression testing.

### `tests/vrt/*.spec.ts`
Visual regression test files (add your own tests here).

## Environment Variables

- `ENABLE_A11Y`: Enable accessibility testing (default: true)
- `ENABLE_PLAYWRIGHT_VRT`: Enable visual regression testing (default: true)
- `CODECOV_ENABLED`: Enable Codecov upload (default: true)
- `CODECOV_TOKEN`: Token for Codecov upload (optional secret)

## Workflow Triggers

The workflow runs on:
- `pull_request` events: `opened`, `synchronize`, `reopened`, `ready_for_review`

## Performance

- **Target runtime**: Under 12 minutes on ubuntu-latest
- **Concurrency**: Jobs run in parallel where possible
- **Conditional execution**: Only runs relevant tests based on file changes
- **Artifact caching**: Shares data between jobs efficiently

## Troubleshooting

### Common Issues

1. **Progress script not executable**: The workflow automatically makes it executable
2. **Missing artifacts**: Jobs use `continue-on-error` for artifact downloads
3. **Conditional jobs skipped**: This is expected behavior based on file changes
4. **Leaderboard update fails**: Check if issue #275 exists and is accessible

### Debugging

- Check workflow logs in the Actions tab
- Artifacts are uploaded for detailed analysis
- Use `continue-on-error: true` for non-critical steps

## Migration from Legacy Workflow

The previous monolithic workflow has been replaced with this modular system. Key changes:

- **Multiple jobs** instead of single mega-test job
- **Path-based filtering** for efficient resource usage
- **Enhanced metrics** with persistent leaderboard
- **Better error handling** with continue-on-error
- **Improved reporting** with progress bars and sticky comments

## Contributing

To add new tests or modify the workflow:

1. Update `.github/workflows/prtest.yml` for workflow changes
2. Add new test files in appropriate directories
3. Update path filters in the `plan` job if needed
4. Test changes in a pull request to see the new workflow in action