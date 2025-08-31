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

## Build & Environment

- Vite-style env usage via `import.meta.env.VITE_API_URL` (ensures `.../api` suffix).
- Tailwind CSS for styling and utility classes.
- Icons from `lucide-react`.

---

To discover:

- `src/services/api/ClientApi.ts` (HTTP client)
- `src/features/auth/hooks/useAuth.tsx` (auth flow)
- `src/routes/index.tsx` + `src/layouts/AppLayout.tsx` (routing + shell)
- A feature folder like `src/features/clubs/` (real end-to-end example)
