# 0010 – Admin feature architecture (role-gated pages)

## Context

Administrative tools should be visible only to admins/moderators and organized for incremental backend integration.

## Decision

- Gate admin pages via the current profile role (`user.role`), redirect otherwise.
- Centralize admin behavior in `AdminService` with stubbed endpoints ready to be wired.
- Provide a hub page linking to sub-tools (users, analytics, moderation).

## Consequences

- Simple role checks avoid complex RBAC at the client layer.
- Pages can ship incrementally while backend endpoints are completed.
