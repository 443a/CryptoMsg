# Contributing to CryptoMsg

Thank you for your interest in contributing to CryptoMsg! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Style Guide](#style-guide)

## 📜 Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CryptoMsg.git
   cd CryptoMsg
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/443a/CryptoMsg.git
   ```

## 🔧 Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build       # Production build
npm run preview     # Preview production build

# Testing
npm test            # Run unit tests
npm run test:ui     # Run tests with UI
npm run test:e2e    # Run E2E tests

# Code Quality
npm run lint        # Lint code
npm run typecheck   # Type check
npm run format      # Format code
```

## 🔄 Making Changes

1. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. Make your changes following the [Style Guide](#style-guide)

3. Run tests to ensure nothing is broken:
   ```bash
   npm test
   npm run typecheck
   npm run lint
   ```

4. Commit your changes with a clear message:
   ```bash
   git commit -m "Add: brief description of your change"
   ```

## 📤 Submitting Changes

1. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub

3. Fill out the PR template with:
   - Description of changes
   - Related issue number (if applicable)
   - Testing performed
   - Screenshots (if UI changes)

## 📝 Style Guide

### TypeScript

- Use strict TypeScript with no `any` types
- Prefer interfaces over types for object shapes
- Use meaningful variable names
- Add JSDoc comments for public APIs

### Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix a bug
docs: update documentation
style: code style changes (formatting)
refactor: code refactoring
test: add/update tests
chore: maintenance tasks
```

Examples:
```
feat: add QR code generation
fix: resolve clipboard auto-clear issue
docs: update README with new features
```

### Pull Requests

- Keep PRs focused on a single change
- Reference related issues
- Include tests for new features
- Update documentation as needed

## ❓ Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
