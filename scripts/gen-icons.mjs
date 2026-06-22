/**
 * Generates all PWA + app icons from the Hookerra logo source.
 * Uses sharp (bundled with Next.js) — no extra installs needed.
 * Run: node scripts/gen-icons.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const appDir    = path.join(root, 'app');
const src       = path.join(publicDir, 'hookerra-logo-src.png');

fs.mkdirSync(publicDir, { recursive: true });

// ── Helpers ────────────────────────────────────────────────────────────────

/** Resize logo to `size`×`size`, returns a Buffer */
async function resizeLogo(size) {
  return sharp(src)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .flatten({ background: { r: 0, g: 0, b: 0 } })
    .png()
    .toBuffer();
}

/**
 * Maskable icon: shrink logo to 80% of canvas (safe zone),
 * centred on a black background — Android adaptive icons won't clip it.
 */
async function maskableLogo(size) {
  const inner = Math.round(size * 0.80);
  const offset = Math.round((size - inner) / 2);

  const logoBuf = await sharp(src)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .flatten({ background: { r: 0, g: 0, b: 0 } })
    .png()
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .composite([{ input: logoBuf, top: offset, left: offset }])
    .png()
    .toBuffer();
}

// ── Generate ───────────────────────────────────────────────────────────────

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), await resizeLogo(192));
console.log('✓ public/icon-192.png');

fs.writeFileSync(path.join(publicDir, 'icon-512.png'), await resizeLogo(512));
console.log('✓ public/icon-512.png');

fs.writeFileSync(path.join(publicDir, 'icon-maskable.png'), await maskableLogo(512));
console.log('✓ public/icon-maskable.png');

// app/ — Next.js static icon routes (auto-picked up as favicon & apple-touch-icon)
fs.writeFileSync(path.join(appDir, 'icon.png'), await resizeLogo(32));
console.log('✓ app/icon.png  (favicon 32×32)');

fs.writeFileSync(path.join(appDir, 'apple-icon.png'), await resizeLogo(180));
console.log('✓ app/apple-icon.png  (iOS 180×180)');

console.log('\nAll icons generated from hookerra-logo-src.png ✓');
