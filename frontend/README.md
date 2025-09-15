# ClubHub

ClubHub is a social student hub for organizations and interest groups. Members can discover clubs, post updates, coordinate events, and stay in touch from a single dashboard. This repository contains the client-side application (React + TypeScript).

## Tech Stack

- React + TypeScript
- Tailwind CSS
- Vite-style env via `import.meta.env` (configure `VITE_API_URL`)
- Feature-first folder structure with a small service layer

Performance notes (Vite): see the updated `vite.config.js` for faster dev and prod builds. We prebundle common deps, set modern targets, and split vendor chunks.

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

Performance tips

- Dev startup/reloads: We prebundle `react`, `react-dom`, `react-router-dom`, `lucide-react`, and `emoji-picker-react` to reduce cold start and rebuild lag.
- Production build: Modern target (`es2020`), `esbuild` minification, manual vendor chunks (`react`, `icons`, `emoji`) and disabled compressed-size reports for faster CI.
- Cache: Vite cache lives in `node_modules/.vite`. If builds seem off after upgrading deps, clear it and restart: `rm -rf node_modules/.vite`.

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

### Build with BuildKit

We rely on Docker BuildKit for caching npm layers. Enable it when building the image:

DOCKER_BUILDKIT=1 docker build --progress=plain -t club-hub-frontend -f frontend/Dockerfile .

1. Build the image from the repository root (this reuses the Dockerfile that
   lives in `frontend/` while keeping the correct build context):
   ```bash
   docker build -t club-hub-frontend -f frontend/Dockerfile --build-arg VITE_API_URL=http://localhost:8080 .
   ```
   If you prefer running the command from inside the `frontend/` directory,
   override the source path once:
   ```bash
   docker build -t club-hub-frontend --build-arg FRONTEND_SRC=club-hub .
   ```
2. Run the container (maps container port 80 to localhost:3000):
   ```bash
   docker run --rm --name clubhub-frontend -p 3000:80 clubhub-frontend
   ```
3. Open the app:
   - http://localhost:3000

Notes:

- The client defaults its API root to `http://localhost:8080` (see `club-hub/src/services/api/ClientApi.ts`). Make sure your backend is reachable there (serving `/api`).
- If your backend lives elsewhere, pass a build arg for Vite: `--build-arg VITE_API_URL=https://your.api` and rebuild the image.

## Notable Data Model Notes

- Feed uses offset/limit pagination: `GET /api/feed?offset=<o>&limit=<n>`.
- Club posts use offset/limit pagination: `GET /api/clubs/{clubId}/posts?offset=<o>&limit=<n>`.
- Club threads use offset/limit pagination: `GET /api/clubs/{clubId}/threads?offset=<o>&limit=<n>`.
- Thread replies use offset/limit pagination: `GET /api/threads/{threadId}/replies?offset=<o>&limit=<n>`.
- Post comments use offset/limit pagination: `GET /api/posts/{postId}/comments?offset=<o>&limit=<n>`.
- Posts can include a single `picture` (object storage URL). JSON posts omit it; multipart posts include it under the `picture` field.
- Comment author DTO shape: `{ id, username, avatar }`.

Feature updates

- Club Posts tab: infinite scroll (IntersectionObserver) via `ClubService.listPostsPage` (10 items per page).
- Forum tab: paginated thread list via `ClubService.listThreadsPage` with Load More.
- Thread detail: loads replies from the backend with pagination via `GET /api/threads/{threadId}/replies?offset=&limit=` and supports posting replies via `POST /api/threads/{threadId}/replies`.
- Voting: threads and replies support upvote/downvote with mutual exclusion (switching sides removes the opposite vote first). Score = upvotes − downvotes. Threads and replies are sorted by score (desc) in UI; ties break by latest activity for threads.
- Permissions: deleting posts allowed for the post author, club ADMIN, or global ADMIN. Editing posts remains author-only. Deleting replies allowed for reply author, club MODERATOR/ADMIN, or global ADMIN.
- Events in feed: event cards display club avatars (mapped from `club.avatar` fallback `club.image`).

Votes API

- Threads: `POST /api/threads/{threadId}/upvote`, `DELETE /api/threads/{threadId}/upvote`; `POST /api/threads/{threadId}/downvote`, `DELETE /api/threads/{threadId}/downvote`.
- Replies: `POST /api/replies/{replyId}/upvote`, `DELETE /api/replies/{replyId}/upvote`; `POST /api/replies/{replyId}/downvote`, `DELETE /api/replies/{replyId}/downvote`.

Replies & Comments

- List thread replies: `GET /api/threads/{threadId}/replies?offset=&limit=`; add reply: `POST /api/threads/{threadId}/replies`; delete reply: `DELETE /api/replies/{replyId}`.
- List post comments: `GET /api/posts/{postId}/comments?offset=&limit=`; delete comment: `DELETE /api/comments/{commentId}`.
