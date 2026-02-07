# Agent guidance for mifi.dev landing

## Purpose

This repo is a **one-page static** Linktree-style site for mifi.dev. It is **not** a SPA: output is pure HTML/CSS/JS with no client-side framework runtime. Minimal JS (theme toggle, copy-link, a11y, copyright year) is allowed.

## Stack (locked)

- **SvelteKit** with `@sveltejs/adapter-static` (static prerender only)
- **TypeScript** (always)
- **pnpm** (only); do not use npm or yarn
- **PostCSS** for CSS (nesting + preset-env)
- **Critical CSS** via post-build script (`scripts/critical-css.mjs`); full build with critical CSS is `pnpm run build:full` (run `pnpm run critical-css:install` once to install Chromium)
- **CSP-safe scripts:** Post-build `scripts/externalize-inline-script.mjs` moves SvelteKit’s inline bootstrap script to `_app/immutable/bootstrap.[hash].js` so CSP can use `script-src 'self'` without `unsafe-inline`
- **Content:** JSON in `src/lib/data/` (e.g. `links.json`), loaded in `+page.server.ts` at build time
- **CSP:** Set by Traefik middleware; do not add CSP in app code. Middleware must not use `require-trusted-types-for 'script'` (Svelte hydration is incompatible).

## Conventions

- Use **semantic HTML** and **JSON-LD** for SEO; target **WCAG 2.2 AAA** for accessibility.
- **No unsafe-inline** scripts; all JS via `<script src="...">`.
- **Dev container** uses the same Linux + Playwright Chromium as CI so e2e/visual-regression snapshots are comparable.
- **Docker:** Single image with both variants; **nginx** does host-based routing (mifi.dev / www.mifi.dev → `/html/dev`, mifi.bio / www.mifi.bio → `/html/bio`). Traefik labels for both hosts; network `marina-net`. Dockerfile builds both with `CONTENT_VARIANT=dev` and `CONTENT_VARIANT=bio`, each with critical CSS inlined.
- **CI:** Woodpecker; pipeline runs lint, unit tests, e2e/visual regression, build (pnpm), and build-full (critical CSS; installs Chromium).

## Key paths

- `src/routes/` – pages and layout
- `src/lib/data/` – JSON content
- `src/app.html` – HTML shell
- `scripts/critical-css.mjs` – post-build critical CSS
- `scripts/externalize-inline-script.mjs` – post-build: extract bootstrap script for CSP
- `.devcontainer/` – dev container (Node, pnpm, Playwright Linux)
- `Dockerfile` – multi-stage build (both dev + bio variants), then nginx with host-based routing
- `nginx/default.conf` – nginx server blocks for mifi.dev and mifi.bio
- `docker-compose.yml` – one service, registry image, Traefik labels for both hosts

## Commands

- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build` (static SSR HTML + externalized script; or `pnpm build:full` for critical CSS; run `pnpm run critical-css:install` once first)
- Lint: `pnpm lint`
- Test: `pnpm test:run`, `pnpm test:e2e`
