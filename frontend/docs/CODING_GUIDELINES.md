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

### Accessibility Examples

- Buttons: include `aria-label` when the visible text is not descriptive or when the button is icon-only.

```tsx
// Icon-only button
<button
  type="button"
  aria-label="Close dialog"
  className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
>
  <X size={16} />
</button>
```

- Inputs: prefer a visible `<label>` bound via `htmlFor`. When a visible label is not feasible, use `aria-label`.

```tsx
<label htmlFor="email" className="block text-sm font-medium">Email</label>
<input
  id="email"
  type="email"
  required
  className="mt-1 w-full border rounded px-3 py-2"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && <p id="email-error" className="mt-1 text-xs text-red-600">{error}</p>}
```

- Toggles: use `role="switch"` and `aria-checked` for custom toggles; ensure keyboard operability.

```tsx
<button
  role="switch"
  aria-checked={enabled}
  onClick={() => setEnabled(v => !v)}
  className={`inline-flex h-6 w-11 items-center rounded-full ${enabled ? 'bg-green-600' : 'bg-gray-300'}`}
>
  <span className={`h-5 w-5 bg-white rounded-full transform transition ${enabled ? 'translate-x-5' : 'translate-x-1'}`} />
  <span className="sr-only">Enable notifications</span>
</button>
```

- Alerts/banners: errors should use `role="alert"` and live region.

```tsx
<div role="alert" aria-live="assertive" className="border border-red-200 bg-red-50 text-red-800 p-3 rounded">
  Could not save changes.
</div>
```

- Images/avatars: provide `alt` text; hide decorative images with empty `alt`.

```tsx
<img src={avatarUrl} alt={`${user.name}'s avatar`} className="h-8 w-8 rounded-full" />
```

## Testing

- Unit test pure helpers and mappers where practical.
- For features, test critical flows (auth, profile update) and reducers if added later.
- Prefer integration-style tests at the page/component level when feasible.

## Git & PRs (see also CONTRIBUTING.md)

- Feature branches: `feat/...`, fixes: `fix/...`, docs: `docs/...`, chores: `chore/...`.
- Conventional commits are encouraged (e.g., `feat:`, `fix:`, `docs:`).
- Keep PRs small and focused; include screenshots or notes for UI changes.
