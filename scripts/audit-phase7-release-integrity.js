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
const articles = [
  ['invisible-smart-lock-rfq-preparation', '2026-09-02'],
  ['wf-026-redundant-hidden-lock-project-assessment', '2026-09-05']
];
const errors = [];
let checkedLinks = 0;

function localTargetExists(siteRoot, source, href) {
  const pathname = href.split(/[?#]/)[0];
  if (!pathname || pathname.startsWith('mailto:') || pathname.startsWith('tel:') || pathname.startsWith('javascript:')) return true;
  if (/^(https?:)?\/\//i.test(pathname)) return true;
  const fromDir = path.dirname(source);
  const bare = pathname.startsWith('/') ? path.join(siteRoot, pathname.slice(1)) : path.resolve(fromDir, pathname);
  const candidates = [bare, `${bare}.html`, path.join(bare, 'index.html')];
  return candidates.some(candidate => fs.existsSync(candidate));
}

for (const site of sites) {
  for (const [slug, date] of articles) {
    const file = path.join(site.root, 'resource', `${slug}.html`);
    const html = fs.readFileSync(file, 'utf8');
    const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]);
    let publishedDate;
    try {
      const schemas = jsonLdBlocks.flatMap((block) => {
        const schema = JSON.parse(block);
        return Array.isArray(schema['@graph']) ? schema['@graph'] : [schema];
      });
      const articleSchema = schemas.find((schema) => schema['@type'] === 'Article');
      publishedDate = articleSchema?.datePublished;
      if (!articleSchema) errors.push(`${site.lang}/${slug}: Article JSON-LD missing`);
    } catch { errors.push(`${site.lang}/${slug}: unreadable JSON-LD`); }
    if (!html.includes(`datetime="${date}"`) || publishedDate !== date) errors.push(`${site.lang}/${slug}: publication date mismatch`);
    if (!html.includes(`<link rel="canonical" href="${site.domain}/resource/${slug}`)) errors.push(`${site.lang}/${slug}: canonical mismatch`);
    const links = [...html.matchAll(/<(?:a|img)\b[^>]+(?:href|src)="([^"]+)"/gi)].map(match => match[1]);
    for (const href of links) {
      if (!localTargetExists(site.root, file, href)) errors.push(`${site.lang}/${slug}: missing local target ${href}`);
      checkedLinks += 1;
    }
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`PASS: ${sites.length * articles.length} article pages, ${checkedLinks} local article links/assets, SEO dates and canonical URLs verified.`);
