# Multi-stage: build both variants (dev + bio), then nginx with host-based routing.
# No buildx; plain docker build.

FROM node:22-bookworm-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build dev variant, move output, then build bio variant (same build/ dir).
RUN set -e && \
    CONTENT_VARIANT=dev pnpm run build && \
    cp -r build /out/dev && \
    CONTENT_VARIANT=bio pnpm run build && \
    cp -r build /out/bio

# Runtime: nginx serves /out/dev and /out/bio by Host header.
FROM nginx:alpine

COPY --from=builder /out/dev /usr/share/nginx/html/dev
COPY --from=builder /out/bio /usr/share/nginx/html/bio
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
