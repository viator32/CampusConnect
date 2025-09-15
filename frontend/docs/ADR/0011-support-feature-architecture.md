# 0011 – Support feature architecture (feedback service)

## Context

We need a simple mechanism for users to send feedback/support requests that can evolve to a full helpdesk integration later.

## Decision

- Implement a `SupportService.sendFeedback(subject, email, message)` endpoint behind a single UI form.
- Keep a placeholder implementation (logging/timeout) until backend is ready.
- Provide a lightweight FAQ within the same page to deflect common questions.

## Consequences

- Users can submit feedback early; swapping to a real backend is low risk.
- Centralized service call avoids scattering HTTP calls across components.
