# Contributing

This guide explains how to set up your environment, our workflow, and coding standards.

## Getting Started

1. Install Node.js (LTS recommended).
2. Clone the repo and install dependencies:
   ```bash
   cd club-hub
   npm install
   ```
3. Start the dev server:
   ```bash
   npm start
   ```
4. Set `VITE_API_URL` in your env if pointing to a remote backend.

## Branching & PRs

- Create topic minor branches from `develop` and major branches from `main`:
  - Features: `feat/short-description`
  - Fixes: `fix/short-description`
  - Docs: `docs/short-description`
  - Chores: `chore/short-description`
- Prefer small, focused PRs. Include screenshots for UI changes(if needed).
- Use clear commit messages (Conventional Commits encouraged: `feat:`, `fix:`, `docs:`, `refactor:`).
- Ensure CI/tests pass before requesting review.

## Coding Standards

- TypeScript across the codebase; keep props and public APIs typed.
- Follow the feature-first structure under `src/features/<domain>/`.
- Add TSDoc to exported functions, classes, and complex types.
- Use services + mappers for all backend calls.
- Tailwind for styling; keep classNames readable and grouped.

## Testing

- Run tests locally with `npm test`.
- Add tests for mappers and non-trivial logic.
- For bug fixes, add a regression test when feasible.

## Running Linters/Formatters

- If linters are configured, run them before pushing. If not, keep code style consistent and rely on TypeScript + TSDoc guidance.

## Releasing

- Squash and merge PRs unless a detailed history is needed.
- Tag releases when appropriate; include release notes highlighting user-facing changes.
