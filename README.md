# ClubHub

ClubHub is a social student hub for organizations and interest groups. Members can discover clubs, post updates, coordinate events, and stay in touch from a single dashboard. This repository contains the client-side application (React + TypeScript).

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Vite-style env via `import.meta.env`
- Feature-first folder structure with a small service layer

## Getting Started

1. Navigate into the app directory:
   ```bash
   cd club-hub
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment (optional):
   - `VITE_API_URL` to point to your backend root (client app appends `/api`)
4. Start the development server:
   ```bash
   npm start
   ```
5. Open http://localhost:3000

## Documentation

- Architecture: `docs/ARCHITECTURE.md`
- API & Data Layer: `docs/API_DATA_LAYER.md`
- Coding Guidelines: `docs/CODING_GUIDELINES.md`
- Pages Overview: `docs/PAGES_CLUBS_PROFILE_FEED.md`
- Build a Page/Tab: `docs/BUILDING_PAGES_AND_TABS.md`
- ADRs (decisions): `docs/ADR/README.md`
- Contributing: `CONTRIBUTING.md`

For a feature-level overview also see `club-hub/README.md`.
