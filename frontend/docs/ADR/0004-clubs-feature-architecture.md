# 0004 – Clubs feature architecture (tabs, optimistic UI)

## Context

The Clubs domain needs a discoverable browsing experience and a detailed club view with multiple concerns (about, events, forum, posts, members) while keeping code cohesive and scalable.

## Decision

- Organize the feature under `src/features/clubs/` with pages, components (tabs), services, types, and mappers.
- Use a single `ClubDetailPage` that renders tabs (`AboutTab`, `EventsTab`, `ForumTab`, `PostsTab`, `MembersTab`).
- Persist the active tab via `useSearchParams` to enable deep linking.
- Perform small actions (join/leave, like, bookmark) with optimistic UI updates and rollback on error.
- Normalize server DTOs using dedicated mappers before rendering.

## Consequences

- Tabs remain focused and easy to test independently.
- URL-addressable tabs improve shareability and navigation.
- Optimistic updates keep UI fast but require careful error rollback.
