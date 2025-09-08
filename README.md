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
4. Start the development server (Vite on port 3000):
   ```bash
   npm run dev
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

## Run Frontend with Docker

Build the production image and run it with Nginx serving the static app.

1. Build the image from the repository root:
   ```bash
   docker build -t club-hub-frontend .
   ```
2. Run the container (maps container port 80 to localhost:3000):
   ```bash
   docker run --rm -p 3000:80 club-hub-frontend
   ```
3. Open the app:
   - http://localhost:3000

Notes:
- The client defaults its API root to `http://localhost:8080` (see `club-hub/src/services/api/ClientApi.ts`). Make sure your backend is reachable there (serving `/api`).
- If your backend lives elsewhere, pass a build arg for Vite: `--build-arg VITE_API_URL=https://your.api` and rebuild the image.
