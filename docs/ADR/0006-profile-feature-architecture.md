# 0006 – Profile feature architecture (context + avatar uploads)

## Context

Profile data is needed across the app and must support updates and avatar uploads without heavy global state solutions.

## Decision

- Provide a `ProfileProvider` context with `user`, `refresh`, `updateUser`, and `updateAvatar` methods.
- Store the current profile in provider state, refetch on auth token changes.
- Map DTOs to the app model (`mapUser`, `mapUserToDto`) and upload avatars as raw blobs (`application/octet-stream`).

## Consequences

- Consumers read profile data via a simple `useProfile()` hook.
- Updates stay localized and predictable; avatar uploads avoid form-data complexity.
