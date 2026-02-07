/**
 * Post-build: minify JS and CSS under build/assets (files copied from static/).
 * Usage: node scripts/minify-static-assets.mjs [buildDir]
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import * as esbuild from 'esbuild';

const buildDir = join(cwd(), process.argv[2] || 'build');
const assetsDir = join(buildDir, 'assets');

function* walk(dir, base = '') {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
        const rel = join(base, name.name);
        if (name.isDirectory()) yield* walk(join(dir, name.name), rel);
        else yield rel;
    }
}

async function minifyAll() {
    if (!existsSync(assetsDir)) return;
    for (const rel of walk(assetsDir, '')) {
        const path = join(assetsDir, rel);
        const ext = rel.slice(rel.lastIndexOf('.'));
        if (ext === '.js') {
            const code = readFileSync(path, 'utf-8');
            const out = await esbuild.transform(code, { minify: true, loader: 'js' });
            writeFileSync(path, out.code);
        } else if (ext === '.css') {
            const code = readFileSync(path, 'utf-8');
            const out = await esbuild.transform(code, { minify: true, loader: 'css' });
            writeFileSync(path, out.code);
        }
    }
}

minifyAll().catch((e) => {
    console.error(e);
    process.exit(1);
});
