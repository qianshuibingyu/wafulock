const fs = require('fs');
const path = require('path');

const root = 'D:\\WebSite\\Cnwafu';
const articles = [
  {
    slug: 'invisible-smart-lock-rfq-preparation',
    title: '隐形智能锁询价前要准备什么：门型、数量、开锁方式与目标市场资料清单',
    date: '2026-09-02',
    dateText: '2026年9月2日',
    tags: ['隐形智能锁', 'RFQ', '项目采购']
  },
  {
    slug: 'wf-026-redundant-hidden-lock-project-assessment',
    title: 'WF-026 双系统双电机隐形锁适合哪些项目：从单系统升级到双系统双电机的评估框架',
    date: '2026-09-05',
    dateText: '2026年9月5日',
    tags: ['WF-026', '双系统', '项目采购']
  }
];

for (const article of articles) {
  const file = path.join(root, 'resource', `${article.slug}.html`);
  let html = fs.readFileSync(file, 'utf8');
  const tags = article.tags.map((tag) => `<em class="wafu-tag">${tag}</em>`).join('');
  const expectedHeader = `<h1 class="wafu-article-title">${article.title}</h1>`;

  if (html.includes(expectedHeader)) continue;

  const brokenHeader = new RegExp(
    `(<span class="breadcrumb-current">${article.title}<\\/span>)[\\s\\S]*?(<div class="wafu-article-body">)`,
    'm'
  );
  const replacement = `$1</div></nav><main><section class="wafu-tech-article"><article class="wafu-main-content"><header class="wafu-article-header">${expectedHeader}<div class="wafu-article-meta"><time datetime="${article.date}">${article.dateText}</time><span class="wafu-article-author">WAFU 技术中心</span><span class="wafu-article-tags">${tags}</span></div></header>$2`;
  if (!brokenHeader.test(html)) throw new Error(`Unable to locate broken article header: ${file}`);
  html = html.replace(brokenHeader, replacement);
  fs.writeFileSync(file, html, 'utf8');
}
