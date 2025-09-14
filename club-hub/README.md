# ClubHub Application

This directory contains the source code for the ClubHub web application built with React, TypeScript and Tailwind CSS.

## Architecture Overview
- **Routes** in `src/routes` map URL paths to pages using React Router.
- **Features** in `src/features` bundle pages, components, hooks and services for each domain (e.g. clubs, feed, profile, notifications, admin).
- **Services** under `src/services` provide a thin API layer for HTTP requests.
- **Layouts** in `src/layouts` supply shared page shells.
- Shared UI building blocks live in `src/components`.

### Main Modules
- `auth` – user sign in and registration flows
- `profile` – profile viewing and editing
- `clubs` – club discovery and detail pages
- `feed` – aggregate updates from followed clubs
- `bookmarks` – saved items for quick access
- `notifications` – alerts about activity
- `admin` – management tools for club content
- `settings` and `support` – account preferences and help resources

## Key Functionality
- User authentication and profile management
- Browse clubs and view a personalized feed
- Bookmark content and receive notifications
- Administrative tools for managing club content

## Available Scripts (Vite)

```bash
npm run dev      # run the development server (http://localhost:3000)
npm run build    # create a production build (dist/)
npm run preview  # preview the production build locally
```

Environment:
- Configure backend URL with `VITE_API_URL` (the client app will append `/api`).

Performance & build:
- Dev prebundles: `react`, `react-dom`, `react-router-dom`, `lucide-react`, `emoji-picker-react` for faster cold start (see `vite.config.js`).
- Build: modern target (`es2020`), `esbuild` minify, vendor chunk splitting.

Feature updates:
- Club Posts tab uses infinite scroll (offset/limit via `ClubService.listPostsPage`).
- Forum tab fetches threads on tab open and paginates via `ClubService.listThreadsPage`.
- Thread detail loads replies from the backend with pagination: `GET /api/threads/{threadId}/replies?offset=&limit=`; add reply via `POST /api/threads/{threadId}/replies`.
- Voting: threads and replies support upvote/downvote with mutual exclusion. Score = upvotes − downvotes. Threads and replies are sorted by score in UI.
- Permissions: posts can be deleted by author, club ADMIN, or global ADMIN; replies can be deleted by author, club MOD/ADMIN, or global ADMIN.

Refer to the repository root README and `docs/` for additional details.
