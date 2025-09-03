# API & Data Layer

This document covers the HTTP client, error handling, and how domain services interact with the backend and map data.

## ClientApi

- Resolves base server URL: `constructor(base?)` → `import.meta.env.VITE_API_URL` → `http://localhost:8080`, then appends `/api`.
- Attaches `Authorization: Bearer <token>` when a token is set via `ClientApi.setAuthToken(token)`.
- On 401: clears token and triggers `onUnauthorized` callback (useful for redirects).
- On non-2xx: throws `ApiError(status, message)`. Message resolution order: JSON body keys `message` → `error` → `title` → `details` → `Response.statusText`. If none are available (some polyfills leave `statusText` empty), the message can be an empty string; see Error Handling below for UI fallbacks.
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

### buildPayload(...): merge semantics

- Type: `protected buildPayload(...args: unknown[]): Record<string, unknown>`
- Behavior: shallow merge (rightmost wins). Only plain objects are merged; non-objects are ignored. Nested objects are not deeply merged; they are overwritten as whole values.

Example (conflicts and nested objects):

```ts
// Given fragments
const base = {
  name: "Chess Club",
  meta: { color: "blue", size: "S" },
  tags: ["fun"],
};
const override = {
  description: "Weekly games",
  meta: { size: "L" },
  tags: ["board"],
};
const extra = null; // ignored

// buildPayload applies a shallow merge, rightmost wins for the same keys
const payload = this.buildPayload(base, override, extra);
// Result:
// {
//   name: 'Chess Club',
//   description: 'Weekly games',
//   meta: { size: 'L' },   // NOT deep-merged; entire `meta` replaced
//   tags: ['board']        // arrays also replaced, not concatenated
// }
```

Usage in a service:

```ts
// ClubService.createClub
const payload = this.buildPayload({
  name: data.name,
  description: data.description,
  category: data.category,
  subject: data.subject ?? Subject.NONE,
  interest: data.interest ?? Preference.NONE,
});
await this.api.request("/clubs", {
  method: "POST",
  body: JSON.stringify(payload),
});
```

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

### Concrete example: Club → Events → Posts

Backend may return nested club data with varying shapes. The mappers normalize it into consistent app models.

Backend variants (examples):

```json
// Variant A
{
  "id": 42,
  "name": "Chess Club",
  "description": "...",
  "avatar": "<base64>",
  "events": [
    { "id": 1, "title": "Meetup", "date": "2025-09-01", "time": "18:00", "location": "Room 101", "attendees": [{"userId":"u1","username":"alice"}] }
  ],
  "posts": [
    { "id": "p1", "author": { "username": "bob", "avatar": "..." }, "content": "hello", "likes": 2, "likedByUser": true, "createdAt": "2025-08-01T10:00:00Z" }
  ]
}

// Variant B
{
  "clubId": "42",
  "name": "Chess Club",
  "membersCount": 17,
  "events": [
    { "id": 2, "title": "Tournament", "date": "2025-10-05", "time": "09:00", "location": "Main Hall", "attendeesCount": 25 }
  ],
  "posts": [
    { "id": "p2", "username": "carol", "content": "update", "likes": 0, "time": "2025-08-02T12:00:00Z" }
  ]
}
```

Mapper output (stable shape):

```ts
type Club = {
  id: string;
  name: string;
  description: string;
  avatar: string; //base64 but has been replaced by Object storage link
  members: number; // membersCount → members
  isJoined: boolean;
  events: Event[]; // see mapEvent below
  posts: Post[]; // normalized & sorted by time desc
};

// See features/clubs/mappers.ts
export function mapClub(dto: any): Club {
  /* ... */
}
export function mapEvent(dto: any): Event {
  /* ... */
}
export function mapPost(dto: any): Post {
  /* ... */
}
```

Key normalization rules implemented in `features/clubs/mappers.ts`:

- IDs: `dto.id | dto.clubId | dto._id` → string
- Avatar: prepend `data:image/png;base64,` when not already a data URL
- Events: attendees normalize via `participants | attendees` and `participantsCount | attendeesCount`
- Posts: author from `author.username | author | username`; `liked` from `liked | likedByUser | likedByMe`; `time` from `time | createdAt`
- Nested arrays are always present; missing values default to empty arrays or sensible defaults

This makes UI code independent of backend drift, while still letting us accommodate new shapes by updating mappers.

## Errors

- Use `instanceof ApiError` to display human-friendly messages.
- Non-HTTP errors should be converted to user-facing copy at the page level.

### ApiError message parsing and fallbacks

`ClientApi.request` behavior on error responses:

- Reads `res.text()`; attempts `JSON.parse` when possible
- Message selection order: `data.message` → `data.error` → `data.title` → `data.details` → `res.statusText`
- Extra fields (when object): `code | errorCode`, `title`, `details | detail`, `params | messageParameters`, and the entire raw `data`

Edge case: Some environments set an empty `statusText`. If no message fields are present, `ApiError.message` can be an empty string. In consumers (pages/hooks), provide a final UI fallback, e.g.:

```ts
catch (err) {
  if (err instanceof ApiError) {
    const msg = err.message?.trim() || `Request failed (HTTP ${err.status})`;
    setToast(msg);
  } else {
    setToast('Unexpected error. Please try again.');
  }
}
```

Note: 401 triggers token clearing and optional `onUnauthorized` callback before throwing the error.

## Auth Token Lifecycle

- Token persistence: `ClientApi.setAuthToken(token)` stores in `localStorage` under `access_token`.
- On app start: `ClientApi.bootstrapTokenFromStorage()` runs automatically (see `ClientApi.ts`).
- Global 401 handling via `clientApi.onUnauthorized` is wired in `useAuth` to redirect to `/login` and clear state.

## Feed.getPage payload shapes

`features/feed/services/FeedService.ts#getPage(page, size)` accepts and normalizes several backend response variants into `FeedItem[]`:

- Array form: `FeedItem[]`
- Page wrapper: `{ content: FeedItem[] }`
- Split collections: `{ posts: any[]; events: any[] }`

Example inputs and normalized output:

```json
// Array form
[
  {"id":"p1","clubId":"42","author":"alice","content":"hi","likes":3,"comments":0,"time":"..."},
  {"type":"event","id":2,"clubId":"42","title":"Meetup","date":"2025-09-01","time":"18:00","location":"Room 101"}
]

// Page wrapper
{ "content": [ {"id":"p2","author":"bob","content":"news","likes":0,"comments":0,"time":"..."} ] }

// Split collections
{
  "posts": [
    { "id":"p3", "club": {"id":"42","name":"Chess","image":"..."}, "author": {"username":"carol","avatar":"..."}, "content":"update", "likedByUser": true, "likes": 2, "comments": 1, "time": "..." }
  ],
  "events": [
    { "id": 7, "club": {"id":"42","name":"Chess","image":"...","isJoined":true}, "title":"Tournament", "date":"2025-10-05", "time":"09:00", "location":"Main Hall", "attendeesCount": 25 }
  ]
}
```

Normalization rules (see implementation in `FeedService.ts`):

- Posts: derive `clubId/name/image` from `post.club` when present; author from `author.username | author`; `liked` from `liked | likedByUser | likedByMe`; map `commentsList` when provided
- Events: ensure a `type: 'event'` discriminator; normalize `clubId/name/image`; capture joined counts from `attendeesCount | attendees.length | joinedCount`; map attendees to `{ id, name, surname, email, avatar }[]`
- Empty inputs produce an empty array (not an error), enabling empty-feed UIs without retries
