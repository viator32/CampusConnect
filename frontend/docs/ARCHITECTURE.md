# Architecture Overview

This document explains how the app is structured and how the major pieces work together.

## High-Level Structure

- Routes (`src/routes`) map URL paths to page components via React Router.
- Features (`src/features`) group pages, components, hooks, services, types, and mappers by domain (auth, profile, clubs, feed, bookmarks, notifications, admin, settings, support).
- Layouts (`src/layouts`) provide the application shell (navigation, header, content area).
- Shared UI components (`src/components`) are small, reusable building blocks (e.g., `Button`, `Input`, `Avatar`).
- Services (`src/services`) contain the API client and a base service class used by domain services.
- Utilities (`src/utils`, `src/constants`) provide small helpers and constants.

## Data Flow

1. UI components (pages/tabs) call domain services (e.g., `ClubService`) for data.
2. Services use the shared `clientApi` instance to perform HTTP requests.
3. Feature mappers normalize backend DTOs into app-friendly models.
4. React hooks/contexts (e.g., `useAuth`, `useProfile`) manage cross-cutting state.

## Client API

- `ClientApi` resolves a base server URL from, in order: constructor `base` arg, `import.meta.env.VITE_API_URL`, or `http://localhost:8080`, and appends `/api`.
- Adds `Authorization: Bearer <token>` when a token is set via `setAuthToken`.
- Clears the token and invokes `onUnauthorized` on 401.
- Throws `ApiError` on non-2xx and returns `undefined` for 204 responses.

See `src/services/api/ClientApi.ts` for details.

## State Management

- Local UI state is held in React component state and hooks.
- Cross-cutting state is managed with context providers:
  - `useAuth` handles token lifecycle, refresh, and global 401 handling.
  - `useProfile` fetches and updates the current user profile.
- No global state library is used; domains keep state co-located and simple.

## Feature Hooks

- `useAuth` (`features/auth/hooks/useAuth.tsx`):
  - Persists token to `localStorage` via `ClientApi.setAuthToken` and restores on boot.
  - Refreshes tokens on an interval; clears token and redirects on 401 using `clientApi.onUnauthorized`.
  - Exposes `login`, `register`, and `logout` helpers.

- `useProfile` (`features/profile/hooks/useProfile.tsx`):
  - In-memory cache of the authenticated `user` in a React context.
  - Loads user whenever the auth token changes; exposes `refresh`, `updateUser`, `updateAvatar`.
  - This is not a persistent cache; it’s reset on logout or reload.

- Feature hooks (example `useClubs`):
  - Own their local state (`clubs`, `loading`, `error`, `totalPages`).
  - Implement optimistic updates with rollback. Example join/leave:

```ts
// Optimistically join
setClubs(prev => prev.map(c => c.id === id ? { ...c, isJoined: true, members: c.members + 1 } : c));
clubService.joinClub(id).catch(err => {
  // Roll back on failure
  setClubs(prev => prev.map(c => c.id === id ? { ...c, isJoined: false, members: Math.max(0, c.members - 1) } : c));
  setError(err.message ?? 'Failed to join club');
});
```

Guidance:
- Keep optimistic updates simple and reversible; compute rollbacks from previous state.
- For multi-entity updates, prefer deriving rollbacks from IDs, not indices.
- If a mutation changes server-calculated fields, re-fetch after success when needed (e.g., `useProfile().refresh()`).

## Feature Organization

Each feature folder typically includes:

- `pages/` top-level screens routed via React Router
- `components/` feature-specific components
- `services/` domain service calling backend endpoints
- `types.ts` types and enums used by the feature
- `mappers.ts` DTO → model mapping utilities
- `hooks/` feature-specific hooks or providers

This “feature-first” structure keeps related code close together and reduces cross-module coupling.

## UI Components

- Small, typed, Tailwind-styled primitives (`Button`, `Input`, `Toggle`, `Toast`, `ProcessingBox`, `Avatar`)
- Feature components (e.g., `AboutTab`, `EventsTab`, `PostsTab`) encapsulate cohesive UI behavior per tab/page.

## Error Handling

- Network errors from the API layer surface as `ApiError(status, message)`.
- Auth 401s trigger a token clear and redirect to `/login` via `clientApi.onUnauthorized`.
- Pages show friendly messages where appropriate (e.g., feed or club loading errors).

### Cross-cutting errors: banners vs. toasts

- Use inline banners for blocking or form-level errors (e.g., Login/Register pages’ `ErrorBanner`).
  - Accessibility: `role="alert"` and `aria-live="assertive"` for errors; provide a close button with `aria-label`.
- Use `Toast` (`src/components/Toast.tsx`) for transient operation errors/success (e.g., bookmarking or join failures).
  - Default auto-dismiss is ~3s; keep messages short.
- Parse errors consistently:

```ts
import { ApiError } from '@/services/api';

function toMessage(err: unknown, fallback = 'Something went wrong.') {
  if (err instanceof ApiError) return err.message?.trim() || `Request failed (HTTP ${err.status})`;
  if (typeof (err as any)?.message === 'string') return (err as any).message;
  if (typeof err === 'string') return err;
  if (err instanceof Error) return err.message;
  return fallback;
}
```

Consider a future `GlobalErrorBoundary` for unrecoverable render errors; for now, prefer page-level handling.

## Build & Environment

- Vite-style env usage via `import.meta.env.VITE_API_URL` (ensures `.../api` suffix).
- Tailwind CSS for styling and utility classes.
- Icons from `lucide-react`.
- Vite config is optimized for speed (see `vite.config.js`):
  - Dev: prebundle `react`, `react-dom`, `react-router-dom`, `lucide-react`, `emoji-picker-react`; modern `es2020` target.
  - Prod: `esbuild` minify, `es2020` target, vendor chunking (`react`, `icons`, `emoji`), no compressed-size report.

---

To discover:

- `src/services/api/ClientApi.ts` (HTTP client)
- `src/features/auth/hooks/useAuth.tsx` (auth flow)
- `src/routes/index.tsx` + `src/layouts/AppLayout.tsx` (routing + shell)
- A feature folder like `src/features/clubs/` (real end-to-end example)

## Routing

- Router: `src/routes/index.tsx` builds routes with React Router v6:
  - Public: `/login`, `/register` redirect to `/explore` when already authenticated.
  - Guarded: Most app routes are nested under `<RequireAuth>` (see `features/auth/components/RequireAuth.tsx`).
  - Dynamic segments: Club pages use `/clubs/:clubId` plus sub-routes for posts/threads.

Example structure:

```tsx
<Route element={<RequireAuth />}>
  <Route path="/explore" element={<ExplorePage />} />
  <Route path="/clubs/:clubId" element={<ClubDetailPage />} />
  <Route path="/clubs/:clubId/posts/:postId" element={<ClubDetailPage />} />
  <Route path="/feed" element={<FeedPage />} />
  <Route path="/admin" element={<AdminPage />} />
  <Route path="*" element={<Navigate to="/explore" replace />} />
</Route>
```

Route guards:
- Auth guard: `RequireAuth` redirects to `/login` when no token.
- Role guard (pattern): Wrap admin-only routes with a `RequireRole` that consults `useProfile()`:

```tsx
function RequireRole({ role }: { role: 'ADMIN' | 'MODERATOR' }) {
  const { user } = useProfile();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === role ? <Outlet /> : <Navigate to="/explore" replace />;
}

// Usage
<Route element={<RequireAuth />}>
  <Route element={<RequireRole role="ADMIN" />}>
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/admin/analytics" element={<AnalyticsPage />} />
  </Route>
</Route>
```

For deeper nesting under clubs (e.g., settings, members), add child routes under `/clubs/:clubId/*` and render an outlet in `ClubDetailPage` or a dedicated `ClubLayout`.
