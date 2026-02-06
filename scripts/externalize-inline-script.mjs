/**
 * Post-build: extract SvelteKit's inline bootstrap script to an external file
 * and replace it with <script src="..."> so CSP can use script-src 'self' without unsafe-inline.
 *
 * Usage: node scripts/externalize-inline-script.mjs [buildDir]
 *   buildDir: path to build output (default: "build"). Use from repo root.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { cwd } from 'node:process';

const buildDir = join(cwd(), process.argv[2] || 'build');
const htmlPath = join(buildDir, 'index.html');

function findSvelteKitInlineScript(html) {
    // Find <script> without src= whose content contains __sveltekit_ (the bootstrap)
    let scriptStart = html.indexOf('<script>');
    while (scriptStart !== -1) {
        const result = extractScriptContent(html, scriptStart);
        if (result && result.content.includes('__sveltekit_')) return result;
        scriptStart = html.indexOf('<script>', scriptStart + 1);
    }
    return null;
}

function extractScriptContent(html, scriptStart) {
    if (scriptStart === -1) return null;
    const contentStart = scriptStart + '<script>'.length;
    let pos = contentStart;
    let inString = null;
    let escape = false;
    const endTag = '</script>';
    while (pos < html.length) {
        if (escape) {
            escape = false;
            pos++;
            continue;
        }
        if (inString) {
            if (html[pos] === '\\') {
                escape = true;
                pos++;
                continue;
            }
            if (html[pos] === inString) {
                inString = null;
            }
            pos++;
            continue;
        }
        if (html[pos] === '"' || html[pos] === "'") {
            inString = html[pos];
            pos++;
            continue;
        }
        if (html.slice(pos, pos + endTag.length) === endTag) {
            return {
                start: scriptStart,
                end: pos + endTag.length,
                content: html.slice(contentStart, pos),
            };
        }
        pos++;
    }
    return null;
}

try {
    let html = readFileSync(htmlPath, 'utf-8');
    const found = findSvelteKitInlineScript(html);
    if (!found) {
        console.log('No SvelteKit inline bootstrap script found in', htmlPath);
        process.exit(0);
    }
    const content = found.content;
    const hash = createHash('sha256').update(content).digest('hex').slice(0, 8);
    const filename = `bootstrap.${hash}.js`;
    const immutableDir = join(buildDir, '_app', 'immutable');
    mkdirSync(immutableDir, { recursive: true });
    const scriptPath = join(immutableDir, filename);
    writeFileSync(scriptPath, content.trimStart(), 'utf-8');
    const scriptTag = `<script src="./_app/immutable/${filename}"></script>`;
    html = html.slice(0, found.start) + scriptTag + html.slice(found.end);
    writeFileSync(htmlPath, html, 'utf-8');
    console.log('Externalized SvelteKit bootstrap to', scriptPath);
} catch (err) {
    console.error(
        'externalize-inline-script failed:',
        err instanceof Error ? err.message : String(err),
    );
    process.exit(1);
}
