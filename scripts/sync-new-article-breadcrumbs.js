const fs = require('fs');
const path = require('path');

const roots = [
  'D:\\WebSite\\Cnwafu', 'D:\\WebSite\\Enwafu', 'D:\\WebSite\\Dewafu', 'D:\\WebSite\\FRwafu',
  'D:\\WebSite\\Itwafu', 'D:\\WebSite\\Ptwafu', 'D:\\WebSite\\Ruwafu', 'D:\\WebSite\\Spainwafu'
];
const slugs = ['invisible-smart-lock-rfq-preparation', 'wf-026-redundant-hidden-lock-project-assessment'];

for (const root of roots) {
  for (const slug of slugs) {
    const file = path.join(root, 'resource', `${slug}.html`);
    let html = fs.readFileSync(file, 'utf8');
    const title = html.match(/<h1 class="wafu-article-title">([\s\S]*?)<\/h1>/)?.[1]?.trim();
    if (!title) throw new Error(`Article title missing: ${file}`);
    if (!/<span class="breadcrumb-current"[\s\S]*?<\/span>/.test(html)) throw new Error(`Breadcrumb missing: ${file}`);
    html = html.replace(/<span class="breadcrumb-current"[\s\S]*?<\/span>/, `<span class="breadcrumb-current">${title}</span>`);
    fs.writeFileSync(file, html, 'utf8');
  }
}
