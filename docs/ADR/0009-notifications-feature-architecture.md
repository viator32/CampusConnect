# 0009 – Notifications feature architecture (service + mark-read)

## Context

The app needs a notifications center with a simple API surface and clear client behavior, even before real-time delivery is implemented.

## Decision

- Provide a `NotificationsService` with `getAll`, `markAsRead`, and `markAllAsRead`.
- Keep the page stateless beyond local UI state; service abstracts backend shape.
- Avoid infinite retries on empty feeds; show an empty state as valid.

## Consequences

- A clean API surface that can later swap to server push or polling.
- Predictable UX and simpler error handling.
