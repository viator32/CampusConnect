# CampusConnect / ClubHub – Root Guide

This repo contains a Quarkus backend and a React (Vite) frontend. You can run both in one container with Docker, or run them separately for development.

## Quick Start (One Command)

- Ensure Docker is installed and running.
- Copy backend env file and set a strong pepper:
  - `cp backend/.env.example backend/.env`
  - Edit `backend/.env` and set `AUTH_PEPPER` to a long random string.
- Build and start everything (Postgres, MinIO, App) with Compose:
  - `docker compose -f docker-compose.fullstack.yml up --build`
- Open the app: http://localhost:8080

What this does
- Builds a single image from `Dockerfile.fullstack` that embeds the built frontend into the Quarkus backend.
- Starts services defined in `docker-compose.fullstack.yml`:
  - Postgres on `5432`
  - MinIO on `9000` (console on `9001`), default creds `minio / minio123`
  - App on `8080` serving frontend at `/` and APIs under `/api`
- Uses `backend/.env` for secrets and MinIO config.

## Frontend-Only Dev (Hot Reload)

- `cd frontend/club-hub`
- `npm install`
- `npm run dev` (serves at http://localhost:3000)
- Backend base defaults to `http://localhost:8080` (see `frontend/club-hub/src/services/api/ClientApi.ts`).

If your backend runs elsewhere, set an env var when starting Vite:
- `VITE_API_URL=http://your.api npm run dev`

## Run Fullstack Image Without Compose

If you already have Postgres and MinIO running, you can run only the app container:

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
- CORS: when using the fullstack image or compose, frontend and backend are same-origin (no CORS needed). Vite dev (port 3000) is allowed by backend CORS.

## Useful Files

- `Dockerfile.fullstack` – Builds frontend and embeds it into Quarkus runtime
- `docker-compose.fullstack.yml` – Orchestrates Postgres, MinIO, and the app
- `backend/.env.example` – Example env; copy to `backend/.env` and edit
- `frontend/club-hub/vite.config.js` – Vite dev config (port 3000)
- `frontend/club-hub/src/services/api/ClientApi.ts` – API base resolution

