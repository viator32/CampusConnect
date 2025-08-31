# Building a New Page or Tab

This guide explains how to add a new page or a tab to an existing page using the patterns in this codebase.

## 1) Plan the feature

- Define the route path and URL params.
- Identify the service methods/endpoints and any DTO mappers you’ll need.
- Decide whether it belongs in an existing feature (preferred) or a new `src/features/<domain>`.

## 2) Define the route

- Add a route in `src/routes/index.tsx` under the appropriate guard (`RequireAuth` for protected pages).

```tsx
// src/routes/index.tsx (snippet)
<Route path="/your-page" element={<YourPage />} />
```

## 3) Create the page component

- Place it under `src/features/<domain>/pages/YourPage.tsx`.
- Use local state for page-only concerns; keep cross-cutting state in context (e.g., `useAuth`, `useProfile`).
- Show loading and error states.

```tsx
import React, { useEffect, useState } from "react";
import Button from "@/components/Button";
import { yourService } from "../services/YourService";

export default function YourPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    yourService
      .list()
      .then(setItems)
      .catch((err) => setError(err?.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Page</h1>
      <Button
        onClick={() => {
          /* action */
        }}
      >
        Do Thing
      </Button>
      {/* render items */}
    </div>
  );
}
```

## 4) Add or extend a service

- Extend `BaseService` and use `ClientApi` to call endpoints.
- Add a `mappers.ts` if backend DTOs need shaping into UI models.

```ts
// src/features/your-domain/services/YourService.ts
import { BaseService } from "@/services/BaseService";

export class YourService extends BaseService {
  async list() {
    return this.api.request<any[]>("/your-endpoint");
  }
}

export const yourService = new YourService();
```

## 5) Build a tab inside an existing page

- Tabs are just components taking the parent model and callbacks to update it.
- Keep parent state (e.g., loaded club) in the page, and pass `onUpdate` or `onSelect` handlers down.
- Store the active tab in URL via `useSearchParams` for deep-linking.

```tsx
// Parent page
const [activeTab, setActiveTab] = useState<"details" | "settings">("details");

{
  /* toggle and render tabs */
}
{
  activeTab === "details" && <DetailsTab model={model} onUpdate={setModel} />;
}
{
  activeTab === "settings" && <SettingsTab model={model} onUpdate={setModel} />;
}
```

## 6) Patterns to follow

- Optimistic updates for small, reversible actions.
- Roll back state on error; show `Toast` where appropriate.
- Keep presentational components stateless; handle effects in pages/hooks.
- Keep TSDoc on exported functions and complex types.
- Use `FormData` only when needed; JSON bodies must be stringified manually.
- For file uploads, send raw blobs with `Content-Type: application/octet-stream`.

## 7) Testing and docs

- Add unit tests for mappers and non-trivial logic.
- Update `docs/COMPONENTS.md` or `docs/PAGES_CLUBS_PROFILE_FEED.md` if the new page is significant.
- Keep the root `README.md` concise; link to deeper docs.
