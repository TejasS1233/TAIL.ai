# Contributing to TAIL.ai

Thank you for your interest in contributing to TAIL.ai! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Issue Guidelines](#issue-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/TAIL.ai.git
   cd TAIL.ai
   ```

## Development Setup

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` with your configuration:

   - MongoDB connection string
   - JWT secret
   - API keys for AI providers (OpenAI, Anthropic, etc.)
   - Other service credentials

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Verify Setup

- Frontend should be running at: http://localhost:3000
- Backend should be running at: http://localhost:8000

## Project Structure

```
TAIL.ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Third-party integrations
│   ├── public/            # Static assets
│   └── package.json
├── server/                # Node.js backend
│   ├── src/
│   │   ├── routes/        # API route handlers
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Express middleware
│   │   ├── controllers/   # Business logic
│   │   └── utils/         # Server utilities
│   └── package.json
└── docs/                  # Documentation
```

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding tests

Examples:

- `feature/workflow-composer-ui`
- `fix/authentication-bug`
- `docs/api-documentation`

### Commit Messages

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting changes
- `refactor` - Code refactoring
- `test` - Adding tests
- `chore` - Maintenance tasks

Examples:

- `feat(workflow): add drag and drop functionality`
- `fix(auth): resolve JWT token expiration issue`
- `docs(readme): update installation instructions`

## Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow React best practices and hooks patterns
- Use functional components over class components
- Implement proper error boundaries
- Use TypeScript where applicable

### Code Formatting

- **Prettier** is configured for both client and server
- Run formatting before committing:
  ```bash
  # In client or server directory
  npx prettier --write .
  ```

### ESLint

- Follow the configured ESLint rules
- Run linting:
  ```bash
  # In client directory
  npm run lint
  ```

### CSS/Styling

- Use Tailwind CSS for styling
- Follow the configured Tailwind setup
- Use shadcn/ui components when possible
- Maintain responsive design principles

## Testing

### Running Tests

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

### Writing Tests

- Write unit tests for utility functions
- Add integration tests for API endpoints
- Include component tests for React components
- Ensure good test coverage for new features

## Submitting Changes

### Before Submitting

1. **Test your changes** thoroughly
2. **Run linting and formatting**:

   ```bash
   # Client
   cd client
   npm run lint
   npx prettier --write .

   # Server
   cd server
   npx prettier --write .
   ```

3. **Update documentation** if needed
4. **Add tests** for new functionality

### Pull Request Checklist

- [ ] Code follows the project's coding standards
- [ ] Tests pass locally
- [ ] Documentation is updated
- [ ] Commit messages follow the convention
- [ ] PR description clearly explains the changes
- [ ] Screenshots included for UI changes

## Issue Guidelines

### Reporting Bugs

When reporting bugs, include:

- **Clear description** of the issue
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Environment details** (OS, Node version, browser)
- **Screenshots or logs** if applicable

### Feature Requests

For feature requests, provide:

- **Clear description** of the proposed feature
- **Use case** and motivation
- **Possible implementation** approach
- **Alternative solutions** considered

### Issue Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed

## Pull Request Process

1. **Create a feature branch** from `main`
2. **Make your changes** following the guidelines
3. **Test thoroughly** and ensure all checks pass
4. **Update documentation** as needed
5. **Submit a pull request** with:
   - Clear title and description
   - Reference to related issues
   - Screenshots for UI changes
   - Testing instructions

### Review Process

- All PRs require at least one review
- Address feedback promptly
- Keep PRs focused and reasonably sized
- Maintain a clean commit history

### Merging

- PRs are merged using "Squash and merge"
- Ensure the commit message follows conventions
- Delete feature branches after merging

## Development Tips

### Useful Commands

```bash
# Install dependencies for both client and server
npm run install:all

# Start both client and server concurrently
npm run dev:all

# Build for production
npm run build:all

# Format code in both directories
npm run format:all
```

### Debugging

- Use browser dev tools for frontend debugging
- Use `console.log` and debugger statements
- Check network requests in browser dev tools
- Monitor server logs for backend issues

### Performance

- Optimize React components with `memo` when needed
- Use lazy loading for large components
- Implement proper caching strategies
- Monitor bundle size and performance metrics

## Getting Help

- **GitHub Issues** - For bugs and feature requests
- **Discussions** - For questions and general discussion
- **Email** - tsss1552@gmail.com for direct contact

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- Special mentions for outstanding contributions

Thank you for contributing to TAIL.ai! 🚀
