# Contributing to DesignMate AI

Thank you for your interest in contributing to DesignMate AI! This document provides guidelines and instructions for contributing.

## Code of Conduct

Please be respectful and constructive in all interactions with the community.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in [Issues](../../issues)
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check [Discussions](../../discussions) for similar ideas
2. Create a new discussion or issue explaining:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative approaches considered
   - Examples or mockups if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes:
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation
   - Keep commits focused and atomic

4. Test your changes:
   ```bash
   npm run dev
   # Test manually
   ```

5. Commit with clear messages:
   ```bash
   git commit -m "feat: add new framework converter for Angular"
   ```

6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

7. Create a Pull Request:
   - Provide a clear description
   - Reference any related issues
   - Include screenshots for UI changes
   - Ensure all checks pass

## Development Setup

See the main [README.md](../README.md) for setup instructions.

## Code Style

### TypeScript
- Use TypeScript for all new files
- Prefer interfaces over types
- Add proper type annotations
- Avoid `any` types

### React
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow React best practices

### Naming Conventions
- Components: PascalCase (`MyComponent.tsx`)
- Hooks: camelCase with 'use' prefix (`useMyHook.ts`)
- Utilities: camelCase (`myUtility.ts`)
- Types: PascalCase (`MyType`)

### File Organization
```
component/
├── MyComponent.tsx      # Main component
├── MyComponent.test.tsx # Tests
└── index.ts            # Barrel export
```

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

## Testing

- Write tests for new features
- Ensure existing tests pass
- Test in multiple browsers if changing UI

## Questions?

Feel free to ask questions in [Discussions](../../discussions) or reach out to the maintainers.

Thank you for contributing! 🎉
