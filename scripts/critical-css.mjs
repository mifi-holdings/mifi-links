/**
 * Post-build step: inline critical CSS in built HTML.
 * Reads <buildDir>/index.html, extracts critical CSS, inlines in <head>,
 * and defers non-critical styles (preload + link at end of body).
 *
 * Usage: node scripts/critical-css.mjs [buildDir]
 *   buildDir: path to build output (default: "build"). Use from repo root.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

const buildDir = join(cwd(), process.argv[2] || 'build');
const htmlPath = join(buildDir, 'index.html');

// critical/penthouse use a nested puppeteer; point it at our installed Chrome
try {
    const puppeteer = await import('puppeteer');
    const executablePath = puppeteer.default?.executablePath?.();
    if (executablePath) {
        process.env.PUPPETEER_EXECUTABLE_PATH = executablePath;
    }
} catch {
    // no top-level puppeteer or no executable; rely on env or default
}

try {
    const { generate } = await import('critical');
    const html = readFileSync(htmlPath, 'utf-8');
    const { html: outHtml } = await generate({
        base: buildDir,
        html,
        inline: { strategy: 'default' }, // preload in head + link at end of body (no inline JS, CSP-safe)
        dimensions: [{ width: 1280, height: 720 }],
        penthouse: { timeout: 30000 },
    });
    writeFileSync(htmlPath, outHtml, 'utf-8');
    console.log(`Critical CSS inlined in ${htmlPath}`);
} catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Critical CSS step failed:', msg);
    if (msg.includes('Browser is not downloaded')) {
        console.error('Install Chromium first: pnpm run critical-css:install');
        console.error('Or run "pnpm run build" without critical CSS.');
    }
    process.exit(1);
}
