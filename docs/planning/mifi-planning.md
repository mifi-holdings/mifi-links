mifi.dev one-page static landing — plan

1. Tech stack (locked): SvelteKit (static)

Chosen stack: SvelteKit with the static adapter (@sveltejs/adapter-static). Output is pure static HTML with no client-side framework bundle or rendering; minimal JS (theme toggle, copy-link, a11y, copyright year) compiles to a small vanilla-like bundle from Svelte components.

Why SvelteKit: Components + scoped CSS; static adapter = pre-rendered HTML; data-driven at build time via load in +page.server.ts or +layout.server.ts; no React runtime; you've used it recently for another static site with good results.

Critical CSS: Implement during scaffold (not bolted on later). Use a Vite plugin (e.g. vite-plugin-critical or equivalent) or a post-build step with the critical npm package to inline critical CSS in <head>, add <link rel="preload" as="style"> in <head>, and place <link rel="stylesheet"> at end of <body>.

Content: Data-driven JSON (e.g. src/lib/data/links.json or content/links.json); load in +page.server.ts (or +page.ts with export const prerender = true) and pass to the page—all content rendered into HTML at build time.

Package manager: pnpm (lockfile pnpm-lock.yaml); all install/build/test scripts assume pnpm.

Language: TypeScript (always); all app and config code in TypeScript.

CSS: PostCSS for nesting and future CSS features (e.g. postcss-nested, postcss-preset-env); integrate with Vite/SvelteKit so component and global CSS are processed consistently.

2. Repo, deploy, and infrastructure

Repo: git.mifi.dev/mifi-holdings/mifi-dev-landing.

Deploy: Webhook from Gitea to Portainer stack; stack defined by docker-compose in repo.

docker-compose (in repo):

Service: nginx (small footprint, low memory) serving the built static site.

Traefik labels for:

Hosts: mifi.dev, www.mifi.dev

Use existing Docker network: marina-net

No client-side rendering; container just serves pre-built HTML/CSS/JS and assets.

CI (Woodpecker) will run on the same server as Gitea: lint, unit tests, e2e/visual regression, and build (using pnpm); deploy can be “build artifact + webhook triggers Portainer to pull and redeploy stack.”

Local development: Dev Containers (.devcontainer/) so local development matches a consistent, reproducible environment (Node, pnpm, browsers/tools as needed). Playwright in the dev container must use the same Linux build as the CI pipeline so visual-regression snapshots are the same size and comparable. Document how to open the project in a dev container in README; CI can mirror the same stack where relevant.

3. Tooling and quality

Prettier: Format HTML, CSS, JS/TS, JSON, YAML (config in repo).

Lint:

ESLint and TypeScript for TS—strict, no unsafe patterns; align with CSP (e.g. no eval, no inline event handlers in generated HTML).

Stylelint for CSS—scoped to project rules, WCAG-related rules where helpful.

Unit tests: Vitest (latest), 100% coverage for all JS (theme toggle, copy-link, a11y helpers, copyright year). No framework runtime in output = tests run against plain JS (or Svelte-compiled output).

E2E / visual regression: Playwright (latest)—e2e flows plus visual regression (screenshot diffing) for layout/design. Run in CI (Woodpecker). Dev container must use the same Linux Playwright build as CI so snapshots are the same size.

Packages: Use latest stable versions; lockfile in repo (pnpm-lock.yaml).

4. Build pipeline

Critical CSS:

Inline critical CSS in <head>.

Non-critical styles: <link rel="preload" as="style"> in <head>, actual <link rel="stylesheet"> at end of <body> (your preferred pattern; Critters or alternative implements this).

Content: JSON data file(s) (e.g. src/lib/data/links.json) defining links, labels, and any copy; consumed at build time and rendered into HTML. No client-side data fetching or rendering.

JS: Single small bundle (or one script) for: theme switch, copy-link, a11y enhancements, copyright year. Script referenced via <script src="...">; CSP is enforced by Traefik middleware.

CSS pipeline: PostCSS runs on styles (e.g. via Vite PostCSS config); nesting and future features applied before critical-CSS extraction so inlined and deferred CSS are consistent.

5. Security and standards

CSP: Set via Traefik middleware (not in app code). This plan does not include implementing CSP in the site; the reverse proxy enforces policy.

SEO: Semantic HTML first; JSON-LD (e.g. WebSite, Person, Organization) in the page; meta tags and document structure that reflect content and purpose.

Accessibility: WCAG 2.2 AAA—color contrast, focus, keyboard, screen reader, and motion/prefers-reduced-motion considered from the start. Theme toggle and copy-link must be keyboard-accessible and announced.

6. Design and content (placeholder)

Design: Modern, fun, slightly cheeky, with personality; palette and light ideas (imagery, emoji, fonts) to be applied in implementation; plan assumes placeholder structure and components so copy and visuals can be dropped in later.

Page type: Single-page Linktree-style layout—links to LLC site, Facebook, IG (US and Brazilian), LinkedIn, Github, etc., with clear sections and optional short copy.

Imagery/emoji/fonts: To be specified in a follow-up; architecture will support semantic sections and components so design can evolve without changing stack.

7. Documentation and LLM guidance

README.md: Fully document setup (prereqs, pnpm, dev container), all scripts (pnpm install, pnpm dev, pnpm build, pnpm preview, pnpm lint, pnpm test, pnpm test:e2e, etc.), and how to run/deploy locally and via CI. New contributors and agents should be able to follow README to get from clone to running site and tests.

AGENTS.md: Project-level guidance for LLM agents (goals, stack, conventions, where key config and code live). Add and refine as we go so agents work efficiently and accurately.

Other LLM prompts/rules/hinting: Add Cursor rules (e.g. .cursor/rules/), RULE.md files, or similar project-specific hints as needed so agents respect pnpm, PostCSS, dev container, a11y, and repo structure.

8. High-level architecture (conceptual)

flowchart LR
subgraph repo [Repo]
Data[content YAML/JSON]
Components[Components/Templates]
Styles[CSS chunks]
Script[Minimal JS]
end

subgraph build [Build]
Data --> Build
Components --> Build
Styles --> Build
Script --> Build
Build --> Critical[Critical CSS inline]
Build --> HTML[Static HTML]
Build --> Assets[CSS/JS assets]
end

subgraph deploy [Deploy]
HTML --> Container
Assets --> Container
Container --> Traefik[Traefik marina-net]
Traefik --> Users[mifi.dev / www.mifi.dev]
end

subgraph ci [Woodpecker CI]
Lint[Lint]
Unit[Vitest]
E2E[Playwright E2E + VR]
Lint --> Build
Unit --> Build
E2E --> Build
end

9. Suggested next steps (implementation)

Scaffold SvelteKit: Create project with TypeScript, pnpm, @sveltejs/adapter-static, PostCSS (nesting + preset-env), Prettier, ESLint, Stylelint, Vitest, Playwright; configure static prerender and critical CSS during scaffold (post-build step or Vite plugin).

Dev container: Add .devcontainer/ (Node + pnpm, Playwright with same Linux build as CI for consistent snapshot dimensions) and document in README how to open and use it.

README and AGENTS.md: Add README.md with full setup and script documentation; add AGENTS.md with project overview and conventions for LLM agents.

Content shape: Add JSON data file(s) (e.g. src/lib/data/links.json) and load in +page.server.ts / +page.ts so links/sections are data-driven placeholders.

Docker + Traefik: Add docker-compose with nginx static file server and Traefik labels for mifi.dev, www.mifi.dev, and marina-net.

Woodpecker: Add pipeline for lint → unit → e2e/visual regression → build; document webhook → Portainer deploy.

SEO and semantics: Semantic layout and JSON-LD in app.html / layout (CSP is set via Traefik middleware; no app-side CSP work).

A11y and design: Apply WCAG 2.2 AAA and your palette/imagery/emoji/fonts in Svelte components and styles.
