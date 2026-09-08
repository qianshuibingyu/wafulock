const path = require('path');
const sharp = require('D:/WebSite/node_modules/sharp');

const root = path.resolve(__dirname, '..');
const source = (...segments) => path.join(root, 'images', 'webp', ...segments);
const article = (filename) => path.join(root, 'images', 'webp', 'articles', filename);
const W = 1600;
const H = 900;

function svgBackground(extra = '') {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f6f7f7"/><stop offset="1" stop-color="#e7eaec"/>
      </linearGradient>
      <filter id="blur"><feGaussianBlur stdDeviation="28"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#base)"/>
    <rect x="0" y="0" width="100%" height="15" fill="#caa66b"/>
    <rect x="0" y="790" width="100%" height="110" fill="#1d252b"/>
    <circle cx="1390" cy="105" r="175" fill="#d7e2e4" opacity=".55" filter="url(#blur)"/>
    <circle cx="180" cy="675" r="210" fill="#e6d6bd" opacity=".32" filter="url(#blur)"/>
    ${extra}
  </svg>`);
}

function studioCanvas() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff"/><stop offset="1" stop-color="#f1f4f5"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect x="72" y="78" width="7" height="744" fill="#c7a26c" opacity=".8"/>
    <rect x="80" y="815" width="1440" height="2" fill="#c7a26c" opacity=".6"/>
  </svg>`);
}

function techBackdrop() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07151d"/><stop offset=".56" stop-color="#102a35"/><stop offset="1" stop-color="#151616"/></linearGradient>
      <linearGradient id="line" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#57d7e4" stop-opacity="0"/><stop offset=".45" stop-color="#57d7e4" stop-opacity=".72"/><stop offset="1" stop-color="#d5ad70" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)"/>
    <path d="M0 120H1600M0 780H1600" stroke="url(#line)" stroke-width="2"/>
    <path d="M92 0V900M1508 0V900" stroke="#d5ad70" opacity=".55" stroke-width="2"/>
    <path d="M170 240H480L570 330H820M780 680H1050L1138 592H1425" fill="none" stroke="#4bd1e0" opacity=".38" stroke-width="2"/>
    <circle cx="480" cy="240" r="5" fill="#58dce8"/><circle cx="1138" cy="592" r="5" fill="#d5ad70"/>
  </svg>`);
}

function techSceneOverlay() {
  return Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#06151d" stop-opacity=".42"/><stop offset=".42" stop-color="#082631" stop-opacity=".08"/><stop offset="1" stop-color="#071319" stop-opacity=".36"/></linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#shade)"/>
    <path d="M88 115H412L488 191M1120 708H1490" fill="none" stroke="#61d5e1" stroke-opacity=".7" stroke-width="2"/>
    <path d="M88 132H345M1140 690H1490" stroke="#d5ad70" stroke-opacity=".66" stroke-width="2"/>
    <circle cx="488" cy="191" r="5" fill="#61d5e1"/><circle cx="1120" cy="708" r="5" fill="#d5ad70"/>
  </svg>`);
}

function shadow(left, top, width, height, radius = 28, opacity = 0.16) {
  return { input: Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="14" width="${width - 20}" height="${height - 20}" rx="${radius}" fill="#172027" fill-opacity="${opacity}"/></svg>`), left, top };
}

async function crop(file, rect, options = {}) {
  let pipeline = sharp(file).extract(rect);
  // Materialize before rotation: Sharp otherwise reorders rotate before extract.
  if (options.rotate) pipeline = sharp(await pipeline.toBuffer()).rotate(options.rotate, { background: '#ffffff' });
  if (options.trim) pipeline = pipeline.trim({ background: '#ffffff', threshold: 14 });
  if (options.width || options.height) pipeline = pipeline.resize(options.width, options.height, { fit: options.fit || 'contain', background: '#ffffff' });
  return pipeline.png().toBuffer();
}

async function cutout(file, rect, options = {}) {
  const image = sharp(file).extract(rect).ensureAlpha();
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    const white = Math.min(data[i], data[i + 1], data[i + 2]);
    data[i + 3] = white >= 249 ? 0 : white <= 232 ? 255 : Math.round((249 - white) * (255 / 17));
  }
  let result = sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } });
  if (options.rotate) result = result.rotate(options.rotate, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  return result.resize(options.width, options.height, { fit: 'contain' }).png().toBuffer();
}

async function make010Installation() {
  // Existing installation scene shows the verified, horizontal lock-to-strike relationship.
  await sharp(source('articles', 'invisible-lock-retrofit-wafu-product-scene-v2.webp'))
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .composite([{ input: techSceneOverlay() }])
    .webp({ quality: 91 })
    .toFile(article('invisible-smart-lock-rfq-product-family.webp'));
}

async function make010Kit() {
  const src = source('019', '14.webp');
  const kit = await crop(src, { left: 18, top: 125, width: 754, height: 755 }, { width: 1180, height: 760, fit: 'contain' });
  await sharp(techBackdrop())
    .composite([
      { input: Buffer.from('<svg width="1220" height="800" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="1200" height="780" rx="0" fill="#ffffff"/><rect x="0" y="0" width="1220" height="800" fill="none" stroke="#d5ad70" stroke-width="2"/></svg>'), left: 190, top: 48 },
      { input: kit, left: 210, top: 62 }
    ])
    .flatten({ background: '#eef0f0' })
    .webp({ quality: 91 })
    .toFile(article('invisible-smart-lock-rfq-sample-verification.webp'));
}

async function make026Kit() {
  // This is a WF-026 interior-side scenario, intentionally distinct from the sample-kit image.
  await sharp(source('026', '5.webp'))
    .extract({ left: 150, top: 0, width: 640, height: 587 })
    .resize(W, H, { fit: 'cover', position: 'attention' })
    .composite([{ input: techSceneOverlay() }])
    .webp({ quality: 91 })
    .toFile(article('wf-026-redundant-hidden-lock-hero.webp'));
}

async function make026Installation() {
  const src = source('026', '06.webp');
  // Keep one original, horizontal door-installation scene rather than a tiled collage.
  const installed = await crop(src, { left: 325, top: 350, width: 425, height: 340 }, { width: 1350, height: 760, fit: 'cover' });
  const backdrop = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#172127"/><stop offset=".48" stop-color="#31474d"/><stop offset="1" stop-color="#9b6b3e"/></linearGradient><filter id="b"><feGaussianBlur stdDeviation="36"/></filter></defs>
    <rect width="100%" height="100%" fill="url(#g)"/><rect x="0" y="0" width="100%" height="100%" fill="#122126" opacity=".22"/>
    <rect x="92" y="85" width="520" height="728" rx="26" fill="#d6d1c9" opacity=".18"/><rect x="655" y="85" width="850" height="728" rx="26" fill="#f4eadb" opacity=".16"/>
    <circle cx="1470" cy="95" r="210" fill="#e0a762" opacity=".35" filter="url(#b)"/><path d="M0 765h1600" stroke="#d1a86d" stroke-width="3" opacity=".7"/>
  </svg>`);
  await sharp(backdrop)
    .composite([
      { input: installed, left: 125, top: 70 },
      { input: Buffer.from('<svg width="1300" height="80" xmlns="http://www.w3.org/2000/svg"><path d="M0 35h1300" stroke="#d1a86d" opacity=".7" stroke-width="2"/></svg>'), left: 150, top: 800 }
    ])
    .flatten({ background: '#1d2b30' })
    .webp({ quality: 91 })
    .toFile(article('wf-026-interior-installation-maintenance.webp'));
}

async function main() {
  await Promise.all([make010Installation(), make010Kit(), make026Kit(), make026Installation()]);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
