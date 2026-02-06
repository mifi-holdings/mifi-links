/**
 * Post-build step: inline critical CSS in built HTML.
 * Reads build/index.html, extracts critical CSS, inlines in <head>,
 * and defers non-critical styles (preload + link at end of body).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = join(__dirname, '..', 'build');
const htmlPath = join(buildDir, 'index.html');

try {
    const { generate } = await import('critical');
    const html = readFileSync(htmlPath, 'utf-8');
    const { html: outHtml } = await generate({
        base: buildDir,
        html,
        inline: true,
        dimensions: [{ width: 1280, height: 720 }],
        penthouse: { timeout: 30000 },
    });
    writeFileSync(htmlPath, outHtml, 'utf-8');
    console.log('Critical CSS inlined in build/index.html');
} catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Critical CSS step failed:', msg);
    if (msg.includes('Browser is not downloaded')) {
        console.error(
            'Install Chromium for critical CSS: pnpm exec puppeteer browsers install chromium',
        );
        console.error('Or run "pnpm run build" without critical CSS.');
    }
    process.exit(1);
}
