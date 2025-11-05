# Development Guide

## Getting Started

### Prerequisites
- Node.js 20.x or later
- npm 9.x or later

### Installation

```bash
npm ci
npm start
```

Development server: <http://localhost:8601>

### Building

```bash
npm run build
```

### Testing

```bash
npm test              # Run all tests
npm run test:lint     # Linting only
npm run test:unit     # Unit tests
npm run test:integration
npm run test:smoke
```

### Common Issues

**ESLint not found:** Run `npm ci`

**Build fails:** 
1. `npm run clean`
2. `rm -rf node_modules && npm ci`
3. `npm run build`

## Project Structure

- src/addons/ - Addon system
- src/components/ - React components
- src/containers/ - Redux containers
- src/lib/ - Utilities
- src/reducers/ - State management
- src/css/ - Stylesheets

## Code Quality

Avoid console.log in production code.
Use proper logging or remove before commit.