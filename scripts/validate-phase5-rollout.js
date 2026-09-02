const fs = require('fs');
const path = require('path');

const sites = [
  { root: 'D:\\WebSite\\Cnwafu', domain: 'https://wafulock.cn', lang: 'zh-CN' },
  { root: 'D:\\WebSite\\Enwafu', domain: 'https://wafuen.com', lang: 'en' },
  { root: 'D:\\WebSite\\Dewafu', domain: 'https://wafulockde.com', lang: 'de' },
  { root: 'D:\\WebSite\\FRwafu', domain: 'https://wafulockfr.com', lang: 'fr' },
  { root: 'D:\\WebSite\\Itwafu', domain: 'https://wafulockit.com', lang: 'it' },
  { root: 'D:\\WebSite\\Ptwafu', domain: 'https://wafulockpt.com', lang: 'pt-PT' },
  { root: 'D:\\WebSite\\Ruwafu', domain: 'https://wafulockru.com', lang: 'ru' },
  { root: 'D:\\WebSite\\Spainwafu', domain: 'https://wafulockes.com', lang: 'es' }
];
const slugs = ['invisible-smart-lock-rfq-preparation', 'wf-026-redundant-hidden-lock-project-assessment'];
const requiredHreflangs = ['en', 'de', 'pt', 'es', 'fr', 'it', 'ru', 'zh-CN', 'x-default'];
const imageNames = [
  'invisible-smart-lock-rfq-product-family-v2.webp',
  'invisible-smart-lock-rfq-sample-verification-v2.webp',
  'wf-026-redundant-hidden-lock-hero-v2.webp',
  'wf-026-interior-installation-maintenance-v2.webp'
];
const failures = [];

for (const site of sites) {
  for (const slug of slugs) {
    const file = path.join(site.root, 'resource', `${slug}.html`);
    if (!fs.existsSync(file)) {
      failures.push(`${site.lang}/${slug}: missing file`);
      continue;
    }
    const bytes = fs.readFileSync(file);
    const html = bytes.toString('utf8');
    if (bytes.subarray(0, 3).equals(Buffer.from([0xef, 0xbb, 0xbf]))) failures.push(`${site.lang}/${slug}: BOM`);
    if (!html.includes(`<html lang="${site.lang}"`)) failures.push(`${site.lang}/${slug}: lang mismatch`);
    if (!html.includes(`${site.domain}/resource/${slug}`)) failures.push(`${site.lang}/${slug}: own-domain URL missing`);
    for (const language of requiredHreflangs) if (!new RegExp(`hreflang="${language}"`).test(html)) failures.push(`${site.lang}/${slug}: missing hreflang ${language}`);
    const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    try { JSON.parse(schemaMatch?.[1] || ''); } catch { failures.push(`${site.lang}/${slug}: invalid JSON-LD`); }
    if (/<a\s+[^>]*href="[^"]+\.html(?:[#?][^"]*)?"/i.test(html)) failures.push(`${site.lang}/${slug}: internal .html link`);
  }
  for (const image of imageNames) if (!fs.existsSync(path.join(site.root, 'images', 'webp', 'articles', image))) failures.push(`${site.lang}: missing ${image}`);
  const technology = fs.readFileSync(path.join(site.root, 'resource', 'technology.html'), 'utf8');
  const resource = fs.readFileSync(path.join(site.root, 'resource.html'), 'utf8');
  const sitemap = fs.readFileSync(path.join(site.root, 'sitemap.html'), 'utf8');
  const xml = fs.readFileSync(path.join(site.root, 'sitemap.xml'), 'utf8');
  for (const slug of slugs) {
    if (!technology.includes(slug)) failures.push(`${site.lang}/${slug}: technology entry missing`);
    if (!resource.includes(slug)) failures.push(`${site.lang}/${slug}: resource entry missing`);
    if (!sitemap.includes(slug)) failures.push(`${site.lang}/${slug}: HTML sitemap entry missing`);
    if (!xml.includes(`/resource/${slug}</loc>`)) failures.push(`${site.lang}/${slug}: XML sitemap entry missing`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`PASS: ${sites.length} sites, ${slugs.length} new articles/site, hreflang, schema, images and entry points verified.`);
