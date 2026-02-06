# Multi-stage: build both variants (dev + bio) with critical CSS, then nginx with host-based routing.
# No buildx; plain docker build.

FROM node:22-bookworm-slim AS builder

# Chromium deps for critical CSS (Puppeteer headless)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Install Chromium for critical CSS (used by the "critical" package)
RUN pnpm run critical-css:install

COPY . .

# Create output dirs and generate .svelte-kit so tsconfig.json extends resolves (avoids esbuild warning).
RUN mkdir -p /out && pnpm exec svelte-kit sync

# Build dev variant with critical CSS, move output, then build bio variant with critical CSS.
RUN set -e && \
    CONTENT_VARIANT=dev pnpm run build && pnpm run critical-css && \
    cp -r build /out/dev && \
    CONTENT_VARIANT=bio pnpm run build && pnpm run critical-css && \
    cp -r build /out/bio

# Runtime: nginx serves /out/dev and /out/bio by Host header.
FROM nginx:alpine

COPY --from=builder /out/dev /usr/share/nginx/html/dev
COPY --from=builder /out/bio /usr/share/nginx/html/bio
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/snippets/ /etc/nginx/snippets/

EXPOSE 80
