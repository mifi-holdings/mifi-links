/**
 * Post-build step: inline critical CSS in built HTML.
 * Reads <buildDir>/index.html, extracts critical CSS, inlines in <head>,
 * and defers non-critical styles (preload + link at end of body).
 *
 * Usage: node scripts/critical-css.mjs [buildDir]
 *   buildDir: path to build output (default: "build"). Use from repo root.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir, platform } from 'node:os';
import { join } from 'node:path';
import { cwd } from 'node:process';

const buildDir = join(cwd(), process.argv[2] || 'build');
const htmlPath = join(buildDir, 'index.html');

// critical/penthouse use a nested puppeteer; point at an installed Chrome/Chromium.
// Only set PUPPETEER_EXECUTABLE_PATH if the path exists. Prefer Playwright's Chromium
// on arm64 so we use the native binary (Puppeteer's default can be x86 on ARM hosts e.g. OrbStack).
function getPlaywrightChromePath() {
    const cacheBase =
        process.env.PLAYWRIGHT_BROWSERS_PATH || join(homedir(), '.cache', 'ms-playwright');
    if (!existsSync(cacheBase)) return null;
    const dirs = readdirSync(cacheBase, { withFileTypes: true });
    for (const d of dirs) {
        if (!d.isDirectory() || !d.name.startsWith('chromium-')) continue;
        const sub = join(cacheBase, d.name);
        const rel =
            platform() === 'win32'
                ? 'chrome-win\\chrome.exe'
                : platform() === 'darwin'
                  ? 'chrome-mac/Chromium.app/Contents/MacOS/Chromium'
                  : 'chrome-linux/chrome';
        const candidate = join(sub, rel);
        if (existsSync(candidate)) return candidate;
    }
    return null;
}
async function resolveChromePath() {
    const isArm64 = process.arch === 'arm64';
    if (isArm64) {
        const pw = getPlaywrightChromePath();
        if (pw) return pw;
    }
    try {
        const puppeteer = await import('puppeteer');
        const path = puppeteer.default?.executablePath?.();
        if (path && existsSync(path)) return path;
    } catch {
        // ignore
    }
    if (!isArm64) {
        const pw = getPlaywrightChromePath();
        if (pw) return pw;
    }
    return null;
}
const chromePath = await resolveChromePath();
if (chromePath) process.env.PUPPETEER_EXECUTABLE_PATH = chromePath;

try {
    const { generate } = await import('critical');
    const html = readFileSync(htmlPath, 'utf-8');
    const { html: outHtml } = await generate({
        base: buildDir,
        html,
        inline: { strategy: 'default' }, // preload in head + link at end of body (no inline JS, CSP-safe)
        dimensions: [
            { width: 375, height: 667 }, // mobile (iPhone SE)
            { width: 768, height: 1024 }, // tablet
            { width: 1280, height: 720 }, // desktop
        ],
        penthouse: { timeout: 30000 },
    });
    // Ensure _app asset paths stay absolute (critical may rewrite; host-based routing needs /_app/...)
    const normalized = outHtml.replace(/\.\/_app\//g, '/_app/');
    writeFileSync(htmlPath, normalized, 'utf-8');
    console.log(`Critical CSS inlined in ${htmlPath}`);
} catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Critical CSS step failed:', msg);
    if (
        msg.includes('Browser is not downloaded') ||
        msg.includes('did not find any executable') ||
        msg.includes('Could not find Chrome')
    ) {
        console.error('Install Chromium first: pnpm run critical-css:install');
        console.error(
            '(Dev container: Playwright Chromium is also used if present in ~/.cache/ms-playwright.)',
        );
        console.error('Or run "pnpm run build" (without critical CSS) for a working build.');
    }
    process.exit(1);
}
