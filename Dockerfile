# --- Build stage -------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps with good caching
COPY club-hub/package.json club-hub/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copy source and build
COPY club-hub/ ./

# Build-time envs for Vite (must start with VITE_*)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=production

RUN npm run build

# --- Runtime stage (nginx) ---------------------------------------------------
FROM nginx:1.27-alpine AS runtime

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static build
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Optional: smaller image & healthcheck helper
RUN apk add --no-cache curl

EXPOSE 80

# Healthcheck (fail fast if not serving)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -fsS http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
