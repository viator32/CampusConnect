# 0002 – ClientApi + token strategy

## Context

We require an HTTP client that works across local/deployed environments, handles bearer-token auth, and surfaces predictable errors while remaining simple.

## Decision

Implement a minimal `ClientApi` that:

- Resolves base URL from constructor arg → `import.meta.env.VITE_API_URL` → `http://localhost:8080`, then appends `/api`.
- Stores bearer tokens via `setAuthToken` (memory + `localStorage`).
- On 401: clears token and invokes `onUnauthorized` (used to redirect to `/login`).
- On non-2xx: throws `ApiError(status, message)` parsed from body.
- Does not auto-serialize bodies; callers provide `JSON.stringify` as needed.

Wire global 401 handling in `useAuth`; periodically refresh tokens via `authService.refresh`.

## Consequences

- Consistent request handling and error semantics across the app.
- Simple token lifecycle with storage bootstrap on app start.
- Clear responsibility: services build payloads, `ClientApi` handles transport.
