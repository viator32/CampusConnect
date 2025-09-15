# syntax=docker/dockerfile:1.7

ARG BASE_REGISTRY=mirror.gcr.io
ARG NODE_TAG=library/node:20-bullseye-slim
ARG NGINX_TAG=library/nginx:1.27-alpine
ARG FRONTEND_SRC=frontend/club-hub
ARG FRONTEND_DIR=frontend

FROM ${BASE_REGISTRY}/${NODE_TAG} AS deps
ARG FRONTEND_SRC
WORKDIR /app
COPY ${FRONTEND_SRC}/package.json ${FRONTEND_SRC}/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund --include=optional


FROM ${BASE_REGISTRY}/${NODE_TAG} AS builder
ARG FRONTEND_SRC
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ${FRONTEND_SRC}/ ./
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV NODE_ENV=production
RUN npm run build

FROM ${BASE_REGISTRY}/${NGINX_TAG} AS runtime
ARG FRONTEND_DIR
COPY ${FRONTEND_DIR}/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html/
RUN apk add --no-cache curl
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -fsS http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
