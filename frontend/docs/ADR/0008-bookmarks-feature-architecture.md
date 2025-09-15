# 0008 – Bookmarks feature architecture (service + toggles)

## Context

Bookmarking posts should be reusable across feed and club contexts and avoid duplicating API calls.

## Decision

- Provide a `BookmarksService` with `getAll`, `add`, and `remove` methods.
- Use optimistic toggles in UIs and reconcile on error.
- Preload bookmark IDs to enable quick state reflection in lists.

## Consequences

- A single source of truth for bookmark behavior.
- Snappy UX with manageable rollback complexity on failures.
