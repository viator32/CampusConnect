# Multi-stage Dockerfile for the ClubHub frontend (Vite)

# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first for better layer caching
COPY club-hub/package.json club-hub/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the app and build
COPY club-hub/ ./

# Optional: build-time envs for client config (Vite consumes VITE_*)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# 2) Runtime stage (Nginx serving static files)
FROM nginx:1.27-alpine AS runtime

# Copy custom nginx config with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from builder (Vite outputs to dist)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
