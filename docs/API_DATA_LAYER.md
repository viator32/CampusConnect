# API & Data Layer

This document covers the HTTP client, error handling, and how domain services interact with the backend and map data.

## ClientApi

- Resolves base server URL: `constructor(base?)` → `import.meta.env.VITE_API_URL` → `http://localhost:8080`, then appends `/api`.
- Attaches `Authorization: Bearer <token>` when a token is set via `ClientApi.setAuthToken(token)`.
- On 401: clears token and triggers `onUnauthorized` callback (useful for redirects).
- On non-2xx: throws `ApiError(status, message)`. Message is parsed from JSON `{ message | error }` or falls back to `statusText`.
- On 204: returns `undefined`.
- Content-Type: sets `application/json` automatically when the body is not `FormData` and the header wasn’t provided. You must stringify JSON bodies yourself.

Example:

```ts
import { clientApi } from "@/services/api";

type Club = { id: string; name: string };

async function loadClubs(): Promise<Club[]> {
  return clientApi.request<Club[]>("/clubs");
}

async function createClub(name: string) {
  return clientApi.request<Club>("/clubs", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}
```

## BaseService

- `BaseService` holds a reference to the shared `clientApi` instance and provides `buildPayload(...)` to merge object fragments for request bodies.
- Domain services extend it to encapsulate backend endpoints per feature.

## Domain Services

- Auth: `features/auth/services/AuthService.ts`
  - `login`, `register`, `refresh`, `logout`. Manages token via `setAuthToken`.
- Profile: `features/profile/services/ProfileService.ts`
  - `getCurrent`, `getById`, `updateCurrent`, `updateAvatar`.
- Clubs: `features/clubs/services/ClubService.ts`
  - Clubs CRUD, join/leave, posts, comments, events, member roles.
- Feed: `features/feed/services/FeedService.ts`
  - `getPage` normalizes varied payload shapes; `addPost`, `addComment`.
- Bookmarks, Notifications, Support, Admin services cover their respective domains.

## Mapping DTOs to Models

- Each feature includes mappers to normalize backend DTOs into stable, typed models the UI expects.
- Example: `features/clubs/mappers.ts` maps clubs, events, posts, comments.
- Benefits:
  - Shields UI from backend shape drift.
  - Enables incremental backend integration.

## Errors

- Use `instanceof ApiError` to display human-friendly messages.
- Non-HTTP errors should be converted to user-facing copy at the page level.

## Auth Token Lifecycle

- Token persistence: `ClientApi.setAuthToken(token)` stores in `localStorage` under `access_token`.
- On app start: `ClientApi.bootstrapTokenFromStorage()` runs automatically (see `ClientApi.ts`).
- Global 401 handling via `clientApi.onUnauthorized` is wired in `useAuth` to redirect to `/login` and clear state.
