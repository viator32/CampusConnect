# 0001 – Feature-first folder structure

## Context

We need a scalable, discoverable way to organize UI and business logic so each domain can evolve independently with minimal coupling and clearer ownership.

## Decision

Adopt a feature-first layout under `src/features/<domain>` that colocates:

- `pages/` – routed screens
- `components/` – feature-scoped UI
- `services/` – API access for the domain
- `hooks/` – domain hooks/providers
- `types.ts` and `mappers.ts` – models and DTO normalization

Keep shared primitives in `src/components` and cross-cutting services/utilities in `src/services`, `src/utils`, and `src/constants`.

## Consequences

- Pros: clear boundaries, easier localized refactors, simpler onboarding.
- Cons: occasional duplication across features (acceptable for speed/clarity).
