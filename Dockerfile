# Multi-stage Dockerfile for the ClubHub frontend (CRA)

# 1) Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies first for better layer caching
COPY club-hub/package.json club-hub/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy the rest of the app and build
COPY club-hub/ ./

# Optional: pass build-time envs like --build-arg REACT_APP_API_BASE_URL=https://api.example.com
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

RUN npm run build

# 2) Runtime stage (Nginx serving static files)
FROM nginx:1.27-alpine AS runtime

# Copy custom nginx config with SPA fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from builder
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

