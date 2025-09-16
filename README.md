# CampusConnect / ClubHub - Root Guide

This repo contains a Quarkus backend and a React (Vite) frontend. You can run the full stack with Docker Compose, or run services separately for development.

## Quick Start (One Command)

- Ensure Docker is installed and running.
- Copy backend env file and set a strong pepper:
  - `cp backend/.env.example backend/.env`
  - Edit `backend/.env` and set `AUTH_PEPPER` to a long random string.
- Build and start everything (Postgres, MinIO, Backend API, Frontend) with Compose:
  - `docker compose -f docker-compose.fullstack.yml up --build`
- Open the frontend: http://localhost:3000
- Backend API (Quarkus): http://localhost:8080

What this does
- Starts services defined in `docker-compose.fullstack.yml`:
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
- `VITE_API_URL=http://your.api npm run dev`

## Run Fullstack Image Without Compose

If you already have Postgres and MinIO running, you can run only the app container (the image built by `Dockerfile.fullstack` embeds the built frontend into the Quarkus runtime for same-origin serving):

- Build: `docker build -t clubhub-fullstack -f Dockerfile.fullstack .`
- Run (example wiring to external services):
  - `docker run --rm --name clubhub-fullstack \
    --env-file backend/.env \
    -e DB_URL=jdbc:postgresql://<postgres_host>:5432/clubhub \
    -e DB_USER=clubhub -e DB_PASSWORD=clubhub \
    -e MINIO_ENDPOINT=http://<minio_host>:9000 \
    -e MINIO_ACCESS_KEY=minio -e MINIO_SECRET_KEY=minio123 \
    -e MINIO_BUCKET=avatars -e MINIO_POST_BUCKET=posts \
    -e MINIO_PUBLIC_URL=http://localhost:9000 \
    -p 8080:8080 clubhub-fullstack`

## Notes & Troubleshooting

- First run creates MinIO buckets and public policy automatically (avatars, posts).
- If you change frontend code, rebuild the image or use the dev server on port 3000.
- If a build fails on `@swc/core`, the project is configured to use Babel (`@vitejs/plugin-react`) inside Docker to avoid native binary issues.
- CORS:
  - With the Compose setup that includes the separate `frontend` service on port `3000`, requests are cross-origin. The backend is configured to allow `http://localhost:3000`.
  - With the single fullstack image (backend serving static files), frontend and backend are same-origin (no CORS needed).

## Useful Files

- `docker-compose.fullstack.yml` - Orchestrates Postgres, MinIO, backend API, and the Nginx-served frontend
- `Dockerfile.fullstack` - Builds frontend and embeds it into Quarkus runtime (single-container alternative)
- `frontend/Dockerfile` - Builds the production SPA, served by Nginx in the `frontend` service
- `frontend/nginx.conf` - Nginx config used by the `frontend` service
- `backend/.env.example` - Example env; copy to `backend/.env` and edit
- `frontend/club-hub/vite.config.js` - Vite dev config (port 3000)
- `frontend/club-hub/src/services/api/ClientApi.ts` - API base resolution

