---
name: CI Leaderboard Setup
about: Template for setting up the CI leaderboard (issue #275)
title: 'CI Leaderboard - Cross-PR Metrics Tracking'
labels: ['ci', 'metrics', 'leaderboard']
assignees: []
---

# CI Leaderboard - Cross-PR Metrics Tracking

This issue tracks the cross-PR leaderboard for build performance metrics.

## How It Works

The leaderboard automatically updates when PRs are tested, tracking:
- **Build time** (milliseconds)
- **Bundle size** (kB, gzipped)
- **Test coverage** (percentage)
- **Overall score** (lower is better)

## Score Calculation

```
Score = (buildMs/500) + (sizeKb/10) - (covPct/2)
```

Lower scores indicate better performance (faster builds, smaller bundles, higher coverage).

## Leaderboard

The leaderboard will appear here automatically when the first PR is processed.

<!-- ci-leaderboard -->