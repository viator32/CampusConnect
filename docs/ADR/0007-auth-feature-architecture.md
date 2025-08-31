# 0007 – Auth feature architecture (provider + refresh + guards)

## Context

Authentication must be simple, persistent across reloads, refreshable, and integrated with navigation guards.

## Decision

- Implement an `AuthProvider` managing the token, persisting it in `localStorage`.
- Wire `clientApi.onUnauthorized` to clear state and redirect to `/login`.
- Periodically refresh tokens via `authService.refresh`.
- Protect routes using a `RequireAuth` component.

## Consequences

- Centralized token lifecycle with minimal boilerplate for consumers.
- Predictable redirects on session expiry; reduced duplication across pages.
