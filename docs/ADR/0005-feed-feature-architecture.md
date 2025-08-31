# 0005 – Feed feature architecture (union items + infinite scroll)

## Context

The feed aggregates heterogeneous content (events, posts) from multiple sources and must support efficient pagination and deduplication.

## Decision

- Model feed items as a union type (`FeedItem = FeedPost | FeedEventItem`).
- Normalize varied backend payload shapes in `FeedService.getPage` (array, `content`, or split `posts/events`).
- Implement infinite scroll via an `IntersectionObserver` sentinel and maintain a key-set for deduplication.
- Keep user actions (like, bookmark, join) optimistic with rollback on error.

## Consequences

- UI renders a single list regardless of backend response differences.
- Infinite scroll reduces page loads and improves UX.
- Deduplication prevents flicker and duplicate items across pages.
