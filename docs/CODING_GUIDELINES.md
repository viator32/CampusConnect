# Coding Guidelines

Concise conventions to keep the codebase consistent and easy to maintain.

## Naming & Style

- TypeScript everywhere; prefer explicit types on public APIs.
- Components: PascalCase, hooks: camelCase starting with `use`.
- Files: component files `ComponentName.tsx`, hooks `useThing.ts`/`useThing.tsx`.
- Keep functions short and single-purpose; extract helpers when needed.
- Prefer `type` over `interface` for simple object shapes; use `interface` for extensible models.
- Use `import type { ... }` when importing types only.
- Add TSDoc (`/** ... */`) to exported functions, classes, props, and complex types.

## Folder Structure

- Feature-first under `src/features/<domain>/`:
  - `pages/`, `components/`, `services/`, `hooks/`, `types.ts`, `mappers.ts`.
- Shared layers:
  - `src/services` – API client and cross-feature base service
  - `src/components` – reusable UI primitives
  - `src/layouts` – application shells
  - `src/routes` – router configuration
  - `src/utils`, `src/constants` – helpers and constants

## State Handling

- Local state with React hooks; lift state only when truly shared.
- Use context providers for cross-cutting state (auth, profile).
- Derive state with `useMemo` when it depends on stable inputs.
- Side effects: `useEffect` with minimal dependency arrays and cleanup functions.
- Avoid prop drilling by colocating components with their feature modules.

## API Patterns

- Use domain services that extend `BaseService` and call `ClientApi`.
- Normalize server DTOs via feature `mappers.ts`.
- Handle errors with `ApiError`; display friendly messages in pages.
- For JSON bodies, always `JSON.stringify(...)`; `ClientApi` does not serialize for you.
- Use absolute URLs only when necessary; prefer relative paths to `baseUrl`.

## UI & Styling

- Tailwind CSS utility classes for styling; keep classNames readable and grouped.
- Keep presentational components dumb; handle side effects in pages/containers.
- Prefer accessibility attributes (`aria-*`, labels) on interactive elements.

## Testing

- Unit test pure helpers and mappers where practical.
- For features, test critical flows (auth, profile update) and reducers if added later.
- Prefer integration-style tests at the page/component level when feasible.

## Git & PRs (see also CONTRIBUTING.md)

- Feature branches: `feat/...`, fixes: `fix/...`, docs: `docs/...`, chores: `chore/...`.
- Conventional commits are encouraged (e.g., `feat:`, `fix:`, `docs:`).
- Keep PRs small and focused; include screenshots or notes for UI changes.
