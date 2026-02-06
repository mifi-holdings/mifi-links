# mifi.dev landing

One-page static Linktree-style site for [mifi.dev](https://mifi.dev). Built with SvelteKit (static adapter), TypeScript, pnpm, PostCSS, and critical CSS.

## Prerequisites

- **Node.js** 22+
- **pnpm** (enable via `corepack enable && corepack prepare pnpm@latest --activate`)

## Quick start

### Option A: Dev container (recommended)

Use the same Linux environment as CI so Playwright snapshots match.

1. Open the repo in VS Code or Cursor.
2. When prompted, click **Reopen in Container** (or run **Dev Containers: Reopen in Container** from the command palette).
3. Wait for the container to build; **postCreateCommand** runs `pnpm install` and `pnpm exec playwright install chromium --with-deps` so dependencies and the Playwright browser are ready.
4. Run the scripts below inside the container.

### Option B: Local

```bash
pnpm install
pnpm dev          # dev server at http://localhost:5173
pnpm build        # output in build/
pnpm preview      # preview build at http://localhost:4173
```

## Scripts

| Script               | Description                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| `pnpm dev:bio`       | Start Vite dev server for mifi.bio                                                               |
| `pnpm dev:dev`       | Start Vite dev server for mifi.dev                                                               |
| `pnpm build`         | Build static site to `build/`                                                                    |
| `pnpm build:full`    | Build + inline critical CSS (requires Chromium: `pnpm exec puppeteer browsers install chromium`) |
| `pnpm preview`       | Serve `build/` locally                                                                           |
| `pnpm check`         | Run `svelte-kit sync` and `svelte-check`                                                         |
| `pnpm lint`          | ESLint + Stylelint                                                                               |
| `pnpm format`        | Prettier (write)                                                                                 |
| `pnpm format:check`  | Prettier (check only)                                                                            |
| `pnpm test`          | Vitest (watch)                                                                                   |
| `pnpm test:run`      | Vitest (single run)                                                                              |
| `pnpm test:coverage` | Vitest with coverage                                                                             |
| `pnpm test:e2e`      | Playwright e2e (starts preview, then runs tests)                                                 |
| `pnpm test:e2e:ui`   | Playwright e2e in UI mode                                                                        |

## Project layout

- `src/` – SvelteKit app (routes, layout, global CSS)
- `src/lib/data/` – JSON content (e.g. `links.json`) loaded at build time
- `static/` – Static assets
- `scripts/` – Post-build scripts (e.g. critical CSS)
- `e2e/` – Playwright e2e tests
- `build/` – Output after `pnpm build` (gitignored)

## Tooling

- **Package manager:** pnpm
- **Language:** TypeScript
- **Lint:** ESLint, Stylelint
- **Format:** Prettier
- **Unit tests:** Vitest
- **E2E / visual regression:** Playwright (use same Linux build in dev container and CI)
- **Critical CSS:** Post-build step via `critical` (run `pnpm build:full` with Chromium installed)

## Deploy

- Repo: `git.mifi.dev/mifi-holdings/mifi-dev-landing`
- Deploy via webhook to Portainer stack; `docker-compose` in repo defines nginx + Traefik labels for `mifi.dev` and `www.mifi.dev` on network `marina-net`.

## Fonts

Fonts live in `static/assets/fonts/`. The wordmark uses **Plus Jakarta Sans** (700). The self-hosted “latin” woff2 subsets omit ligature (GSUB) tables, so the **fi** ligature in “mifi” does not appear with them.

**Current setup:** Plus Jakarta Sans 700 is loaded from **Google Fonts** in the layout so the wordmark fi ligature works. All other fonts (Fraunces, Inter, etc.) are self-hosted.

**To self-host the wordmark font with ligatures** instead of Google Fonts:

1. **Download the font**  
   [Google Fonts → Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) → “Download family” (ZIP). Unzip; use the **Bold** static file (e.g. `PlusJakartaSans-Bold.ttf` or `PlusJakartaText-Bold.otf` from the `static` folder). Or clone [Tokotype/PlusJakartaSans](https://github.com/tokotype/PlusJakartaSans) and use `fonts/ttf/PlusJakartaSans-Bold.ttf` (or the OTF equivalent).

2. **Subset with ligatures** (from the repo root, with fonttools installed: `pip install fonttools brotli`):

```bash
# Replace PATH_TO_BOLD with the path to the Bold TTF/OTF (e.g. ~/Downloads/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf)
# Use --layout-features='*' to keep all layout features (including liga); or 'liga','clig'
pyftsubset PATH_TO_BOLD \
  --output-file=static/assets/fonts/plus-jakarta-sans-700-liga.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --unicodes='U+0020-007F,U+00A0-00FF,U+FB01,U+FB02'
```

Example if the ZIP is in your Downloads folder:

```bash
pyftsubset ~/Downloads/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf \
  --output-file=static/assets/fonts/plus-jakarta-sans-700-liga.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --unicodes='U+0020-007F,U+00A0-00FF,U+FB01,U+FB02'
```

3. **Switch back to self-hosted**  
   Put the new woff2 in `static/assets/fonts/`. In `src/lib/fonts.css`, uncomment the Plus Jakarta Sans `@font-face` and set its `url()` to `plus-jakarta-sans-700-liga.woff2`. In `src/routes/+layout.svelte`, remove the Google Fonts `<link>` for Plus Jakarta Sans.

### Fraunces variable (headings with opsz)

Headings use **Fraunces** with `font-variation-settings: "opsz" 36`. That only works with the **variable** font (opsz + wght axes). Static instances (e.g. `fraunces-v38-latin-500.woff2`) ignore opsz.

1. **Download the variable TTF**  
   [Google Fonts → Fraunces](https://fonts.google.com/specimen/Fraunces) → “Download family”. In the ZIP, use the file in the **variable** folder: `Fraunces-VariableFont_opsz,wght.ttf` (or similar name).

2. **Subset to woff2** (from repo root; `pip install fonttools brotli`):

```bash
# Replace PATH_TO_VARIANT with the path to Fraunces-VariableFont_opsz,wght.ttf
pyftsubset PATH_TO_VARIANT \
  --output-file=static/assets/fonts/fraunces-variable-opsz-wght.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --unicodes='U+0020-007F,U+00A0-00FF'
```

Example if the ZIP is in Downloads:

```bash
pyftsubset ~/Downloads/Fraunces/fraunces-variable-opsz-wght.ttf \
  --output-file=static/assets/fonts/fraunces-variable-opsz-wght.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --unicodes='U+0020-007F,U+00A0-00FF'
```

3. **Use it in the app**  
   In `src/lib/fonts.css`, replace the Fraunces `@font-face` with one that points at the variable woff2 and a `font-weight` range (e.g. 100 900) so the browser can use the wght axis. See the comment in `fonts.css` for the exact block.

## CSP

CSP is set via Traefik middleware, not in app code.
