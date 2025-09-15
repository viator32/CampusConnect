# 0003 – Service layer with DTO mappers

## Context

Backend payloads vary between endpoints and can evolve over time. The UI needs stable, typed models and a single place to maintain endpoint paths.

## Decision

Introduce domain services (e.g., `ClubService`, `ProfileService`) that extend `BaseService` and call endpoints via `ClientApi`. Add feature-level `mappers.ts` to normalize DTOs into the app’s models.

Guidelines:

- Keep services thin and focused on HTTP, leaving transformation to mappers.
- Map optional/alternate fields (e.g., `author.username` vs `username`) to stable properties.
- Sort/order data in services when needed (e.g., posts by date) to simplify UIs.

## Consequences

- UI is insulated from backend shape drift and inconsistencies.
- A single place to adjust paths and payloads during backend integration.
- Small mapping overhead in exchange for resilience and readability.
