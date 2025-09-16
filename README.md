# CampusConnect / ClubHub - Root Guide

This repo contains a Quarkus backend and a React (Vite) frontend. You can run the full stack with Docker Compose, or run
services separately for development.

## Quick Start (One Command)

- Ensure Docker is installed and running.
- Copy backend env file and set a strong pepper:
  ```bash
  cp backend/.env.example backend/.env
  ```
  Edit `backend/.env` and set `AUTH_PEPPER` to a long random string.
- Build and start everything (Postgres, MinIO, Backend API, Frontend) with Compose:
  ```bash
  cd backend
  docker compose up -d --build
  ```
- Open the frontend: http://localhost:3000
- Backend API (Quarkus): http://localhost:8080

### Rebuilding after changes

If you make changes to either backend or frontend and want to rebuild both services:

```bash
cd backend
docker compose up -d --build --force-recreate
```

### What this does

- Starts services defined in `backend/docker-compose.yml`:
    - Postgres on `5432` (volume `pgdata`)
    - MinIO on `9000` (console on `9001`), default creds `minio / minio123` (volume `minio_data`)
    - Backend app on `8080` exposing REST APIs under `/api`
    - Frontend (Nginx) on `3000` serving the built SPA; it calls the backend at `http://localhost:8080`
- Uses `backend/.env` for secrets and MinIO config (e.g., `AUTH_PEPPER`, `DB_*`, `MINIO_*`).

## Frontend-Only Dev (Hot Reload)

- `cd frontend/club-hub`
- `npm install`
- `npm run dev` (serves at http://localhost:3000)
- Backend base defaults to `http://localhost:8080` (see `frontend/club-hub/src/services/api/ClientApi.ts`).

If your backend runs elsewhere, set an env var when starting Vite:

```bash
VITE_API_URL=http://your.api npm run dev
```

## Notes & Troubleshooting

- First run creates MinIO buckets and public policy automatically (avatars, posts).
- If you change frontend code, rebuild the container or use the dev server on port 3000.
- If a build fails on `@swc/core`, the project is configured to use Babel (`@vitejs/plugin-react`) inside Docker to
  avoid native binary issues.
- CORS: The backend is configured to allow requests from `http://localhost:3000`.

## Useful Files

- `backend/docker-compose.yml` - Orchestrates Postgres, MinIO, backend API, and the Nginx-served frontend
- `frontend/Dockerfile` - Builds the production SPA, served by Nginx in the `frontend` service
- `frontend/nginx.conf` - Nginx config used by the `frontend` service
- `backend/.env.example` - Example env; copy to `backend/.env` and edit
- `frontend/club-hub/vite.config.js` - Vite dev config (port 3000)
- `frontend/club-hub/src/services/api/ClientApi.ts` - API base resolution
