# Agent guidance for mifi.dev landing

## Purpose

This repo is a **one-page static** Linktree-style site for mifi.dev. It is **not** a SPA: output is pure HTML/CSS/JS with no client-side framework runtime. Minimal JS (theme toggle, copy-link, a11y, copyright year) is allowed.

## Stack (locked)

- **SvelteKit** with `@sveltejs/adapter-static` (static prerender only)
- **TypeScript** (always)
- **pnpm** (only); do not use npm or yarn
- **PostCSS** for CSS (nesting + preset-env)
- **Critical CSS** via post-build script (`scripts/critical-css.mjs`); full build with critical CSS is `pnpm run build:full` (requires Chromium)
- **Content:** JSON in `src/lib/data/` (e.g. `links.json`), loaded in `+page.server.ts` at build time
- **CSP:** Set by Traefik middleware; do not add CSP in app code

## Conventions

- Use **semantic HTML** and **JSON-LD** for SEO; target **WCAG 2.2 AAA** for accessibility.
- **No unsafe-inline** scripts; all JS via `<script src="...">`.
- **Dev container** uses the same Linux + Playwright Chromium as CI so e2e/visual-regression snapshots are comparable.
- **Docker:** Static server is **nginx**; Traefik labels for `mifi.dev`, `www.mifi.dev`, network `marina-net`.
- **CI:** Woodpecker; pipeline runs lint, unit tests, e2e/visual regression, build (pnpm).

## Key paths

- `src/routes/` – pages and layout
- `src/lib/data/` – JSON content
- `src/app.html` – HTML shell
- `scripts/critical-css.mjs` – post-build critical CSS
- `.devcontainer/` – dev container (Node, pnpm, Playwright Linux)
- `docker-compose` – nginx + Traefik (in repo root when added)

## Commands

- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build` (or `pnpm build:full` for critical CSS)
- Lint: `pnpm lint`
- Test: `pnpm test:run`, `pnpm test:e2e`
