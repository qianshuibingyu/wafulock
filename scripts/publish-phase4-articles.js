const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const resource = path.join(root, 'resource');
const template = fs.readFileSync(path.join(resource, 'invisible-smart-lock-distributor-first-order.html'), 'utf8');

const articles = [
  {
    md: 'invisible-smart-lock-rfq-preparation.md',
    out: 'invisible-smart-lock-rfq-preparation.html',
    slug: 'invisible-smart-lock-rfq-preparation',
    date: '2026-09-02',
    title: '隐形智能锁询价前要准备什么：门型、数量、开锁方式与目标市场资料清单',
    description: '面向项目采购、经销商和品牌方，整理隐形智能锁询价前应准备的门型、数量、开锁方式、目标市场、包装与售后资料，帮助供应商形成可执行的配置与报价。',
    tags: ['隐形智能锁', 'RFQ', '项目采购'],
    previous: { href: './wf-026-redundant-hidden-lock-project-assessment', text: 'WF-026 双系统双电机隐形锁项目评估框架' },
    next: { href: './invisible-smart-lock-distributor-first-order', text: '海外经销商首次采购隐形智能锁准备清单' },
    related: [
      ['./wf-026-redundant-hidden-lock-project-assessment', 'WF-026 双系统双电机项目评估框架'],
      ['./invisible-smart-lock-distributor-first-order', '海外经销商首单采购准备清单'],
      ['./invisible-smart-lock-retrofit-assessment', '隐形智能锁项目改造核验清单'],
      ['./smart-lock-oem-sample-approval-change-control', 'OEM 样品确认与变更控制']
    ],
    image: 'invisible-smart-lock-rfq-product-family-v2.webp'
  },
  {
    md: 'wf-026-redundant-hidden-lock-project-assessment.md',
    out: 'wf-026-redundant-hidden-lock-project-assessment.html',
    slug: 'wf-026-redundant-hidden-lock-project-assessment',
    date: '2026-09-05',
    title: 'WF-026 双系统双电机隐形锁适合哪些项目：从单系统升级到双系统双电机的评估框架',
    description: '从项目维护成本、管理需求、样品验证、供电、备件和版本控制出发，帮助采购团队评估 WF-026 双系统双电机隐形锁是否值得进入项目方案。',
    tags: ['WF-026', '双系统', '项目采购'],
    previous: null,
    next: { href: './invisible-smart-lock-rfq-preparation', text: '隐形智能锁询价前资料清单' },
    related: [
      ['./invisible-smart-lock-rfq-preparation', '隐形智能锁询价前资料清单'],
      ['./invisible-smart-lock-retrofit-assessment', '隐形智能锁项目改造核验清单'],
      ['./smart-lock-oem-sample-approval-change-control', 'OEM 样品确认与变更控制'],
      ['./smart-lock-oem-after-sales-support-checklist', '智能锁 OEM 售后支持清单']
    ],
    image: 'wf-026-redundant-hidden-lock-hero-v2.webp'
  }
];

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function inline(value) {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}
function renderMarkdown(raw) {
  const content = raw.replace(/^---[\s\S]*?---\s*/, '').replace(/<!--[^]*?-->/g, '');
  const lines = content.split(/\r?\n/);
  let html = '';
  let index = 0;
  let leadDone = false;
  let toc = false;
  let inFaq = false;
  const faq = [];
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line || line === '>' || line.startsWith('> **配图位置')) { index += 1; continue; }
    if (line.startsWith('# ')) { index += 1; continue; }
    if (line === '## 目录') {
      toc = true; index += 1;
      const links = [];
      while (index < lines.length && !lines[index].trim()) index += 1;
      while (index < lines.length && /^\d+\. /.test(lines[index].trim())) {
        const match = lines[index].trim().match(/^\d+\. \[([^\]]+)\]\(#([^)]+)\)/);
        if (match) links.push(`<li><a href="#${match[2]}">${match[1]}</a></li>`);
        index += 1;
      }
      html += `<nav class="wafu-toc" aria-label="文章目录"><h2>目录</h2><ol>${links.join('')}</ol></nav>`;
      toc = false; continue;
    }
    const heading = line.match(/^##\s+(?:<a id="([^"]+)"><\/a>)?\s*(.+)$/);
    if (heading) {
      const id = heading[1] || '';
      const title = heading[2];
      inFaq = id === 'faq' || title === '常见问题';
      html += `<h2 class="wafu-heading-2"${id ? ` id="${id}"` : ''}>${inline(title.replace(/^第[一二三四五六七八九十]+部分\s*[—-]\s*/, ''))}</h2>`;
      index += 1; continue;
    }
    const subheading = line.match(/^###\s+(.+)$/);
    if (subheading) {
      const title = subheading[1];
      html += `<h3 class="wafu-heading-3">${inline(title)}</h3>`;
      if (inFaq) faq.push({ name: title, text: '' });
      index += 1; continue;
    }
    const image = line.match(/^!\[([^\]]+)\]\(([^)]+)\)/);
    if (image) {
      const caption = lines[index + 1] && lines[index + 1].trim().match(/^\*(.+)\*$/);
      html += `<figure class="wafu-image-box"><img src="${image[2]}" alt="${escapeHtml(image[1])}" loading="lazy" width="1200" height="675">${caption ? `<figcaption>${inline(caption[1])}</figcaption>` : ''}</figure>`;
      index += caption ? 2 : 1; continue;
    }
    if (/^\|/.test(line) && /^\|/.test((lines[index + 1] || '').trim())) {
      const cells = (row) => row.trim().replace(/^\||\|$/g, '').split('|').map((cell) => cell.trim());
      const header = cells(line);
      index += 2;
      const rows = [];
      while (index < lines.length && /^\|/.test(lines[index].trim())) { rows.push(cells(lines[index])); index += 1; }
      html += `<div class="wafu-table-wrap"><table class="wafu-table"><thead><tr>${header.map((cell) => `<th>${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
      continue;
    }
    if (/^[-*] /.test(line) || /^\d+\. /.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items = [];
      while (index < lines.length && (ordered ? /^\d+\. /.test(lines[index].trim()) : /^[-*] /.test(lines[index].trim()))) {
        items.push(lines[index].trim().replace(ordered ? /^\d+\. / : /^[-*] /, ''));
        index += 1;
      }
      html += `<${ordered ? 'ol' : 'ul'} class="wafu-list ${ordered ? 'wafu-ordered-list' : ''}">${items.map((item) => `<li class="wafu-list-item">${inline(item)}</li>`).join('')}</${ordered ? 'ol' : 'ul'}>`;
      continue;
    }
    if (line.startsWith('> ')) { html += `<blockquote class="wafu-article-note">${inline(line.slice(2))}</blockquote>`; index += 1; continue; }
    const paragraph = [line]; index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#|>|!\[|\||[-*] |\d+\. )/.test(lines[index].trim())) { paragraph.push(lines[index].trim()); index += 1; }
    const text = inline(paragraph.join(' '));
    html += `<p${leadDone ? '' : ' class="wafu-lead-text"'}>${text}</p>`;
    if (inFaq && faq.length && !faq[faq.length - 1].text) faq[faq.length - 1].text = paragraph.join(' ');
    leadDone = true;
  }
  html = html.replace(/<figure class="wafu-image-box">([\s\S]*?)<\/figure><p>\*([^*]+)\*<\/p>/g, '<figure class="wafu-image-box">$1<figcaption>$2</figcaption></figure>');
  return { html, faq };
}
function navLink(direction, item, disabled) {
  const arrow = direction === '上一篇' ? '❮' : '❯';
  const classes = `wafu-nav-${direction === '上一篇' ? 'prev' : 'next'}${disabled ? ' wafu-nav-disabled' : ''}`;
  const content = `<span class="wafu-nav-content"><span class="wafu-nav-label">${direction}</span><span class="wafu-nav-text">${item ? item.text : '敬请期待'}</span></span>`;
  if (disabled) return `<span class="${classes}" aria-disabled="true">${direction === '上一篇' ? `<span class="wafu-nav-arrow">${arrow}</span>${content}` : `${content}<span class="wafu-nav-arrow">${arrow}</span>`}</span>`;
  return `<a class="${classes}" href="${item.href}">${direction === '上一篇' ? `<span class="wafu-nav-arrow">${arrow}</span>${content}` : `${content}<span class="wafu-nav-arrow">${arrow}</span>`}</a>`;
}
function related(items) {
  return items.map(([href, text]) => `<li class="wafu-related-item"><a class="wafu-related-link" href="${href}">${text}</a></li>`).join('');
}
function pageBody(article, body) {
  const tags = article.tags.map((tag) => `<em class="wafu-tag">${tag}</em>`).join('');
  const shareUrl = encodeURIComponent(`https://wafulock.cn/resource/${article.slug}`);
  const shareTitle = encodeURIComponent(article.title);
  return `<section class="wafu-tech-article"><article class="wafu-main-content"><header class="wafu-article-header"><h1 class="wafu-article-title">${article.title}</h1><div class="wafu-article-meta"><time datetime="${article.date}">${article.date.replace(/-(\d{2})-(\d{2})/, '年$1月$2日').replace(/月0/g, '月').replace(/年0/g, '年')}</time><span class="wafu-article-author">WAFU 技术中心</span><span class="wafu-article-tags">${tags}</span></div></header><div class="wafu-article-body">${body.html}</div><footer class="wafu-article-footer"><section class="wafu-share-section"><h4 class="wafu-share-title">分享本文</h4><div class="wafu-share-buttons"><a href="https://service.weibo.com/share/share.php?url=${shareUrl}&title=${shareTitle}" class="social-icon weibo" aria-label="分享到微博" target="_blank" rel="noopener noreferrer"></a><button type="button" class="social-icon wechat wafu-share-copy" aria-label="复制链接到微信"></button><a href="https://v.douyin.com/0wUlMqC9nM4/" class="social-icon douyin" aria-label="抖音" target="_blank" rel="noopener noreferrer"></a><a href="https://space.bilibili.com/3546585736677604" class="social-icon bilibili" aria-label="哔哩哔哩" target="_blank" rel="noopener noreferrer"></a><a href="https://www.xiaohongshu.com/search_result?keyword=WAFU%E6%99%BA%E8%83%BD%E9%94%81" class="social-icon xiaohongshu" aria-label="小红书" target="_blank" rel="noopener noreferrer"></a><a href="https://www.zhihu.com/search?q=WAFU%E6%99%BA%E8%83%BD%E9%94%81" class="social-icon zhihu" aria-label="知乎" target="_blank" rel="noopener noreferrer"></a></div></section><nav class="wafu-article-nav">${navLink('上一篇', article.previous, !article.previous)}${navLink('下一篇', article.next, !article.next)}</nav></footer></article><aside class="wafu-side-bar"><section class="wafu-about-card"><img class="wafu-brand-logo" src="../images/logo.png" alt="WAFU 智能锁"><h3 class="wafu-brand-name">WAFU</h3><p class="wafu-brand-desc">面向品牌、渠道与工程项目提供智能锁 OEM/ODM 方案。</p><a href="../contact" class="wafu-more-link">申请项目咨询</a></section><section class="wafu-related-articles"><h4 class="wafu-side-title">相关文章</h4><ul class="wafu-related-list">${related(article.related)}</ul></section><section class="wafu-hot-products"><h4 class="wafu-side-title">相关产品</h4><ul class="wafu-related-list"><li class="wafu-related-item"><a class="wafu-related-link" href="../products/product-010">WF-010 隐形智能锁</a></li><li class="wafu-related-item"><a class="wafu-related-link" href="../products/product-019">WF-019 隐形遥控锁</a></li><li class="wafu-related-item"><a class="wafu-related-link" href="../products/product-026">WF-026 双系统隐形锁</a></li></ul></section><section class="wafu-consult-card"><h4 class="wafu-consult-title">产品咨询与 OEM/ODM</h4><p class="wafu-consult-desc">提交门型、目标市场、项目数量和所需开锁方式，获取适配建议。</p><a class="wafu-consult-btn" href="../contact">立即联系我们</a></section></aside></section>`;
}
function buildPage(article) {
  const body = renderMarkdown(fs.readFileSync(path.join(resource, article.md), 'utf8'));
  const canonical = `https://wafulock.cn/resource/${article.slug}`;
  const faq = body.faq.filter((item) => item.text).map((item) => ({ '@type': 'Question', name: item.name, acceptedAnswer: { '@type': 'Answer', text: item.text } }));
  const schema = { '@context': 'https://schema.org', '@graph': [{ '@type': 'Article', headline: article.title, description: article.description, datePublished: article.date, dateModified: article.date, author: { '@type': 'Organization', name: 'WAFU 技术中心' }, publisher: { '@type': 'Organization', name: '深圳市华府智能科技有限公司' }, mainEntityOfPage: canonical, url: canonical, inLanguage: 'zh-CN', image: [`https://wafulock.cn/images/webp/articles/${article.image}`] }, { '@type': 'FAQPage', mainEntity: faq } ] };
  let page = template;
  page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>${article.title} | 华府智能 WAFU</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${article.description}" />`)
    .replace(/<meta\s+name="keywords"[\s\S]*?\/>/, `<meta name="keywords" content="${article.tags.join('，')},WAFU" />`)
    .replace(/<link\s+rel="canonical"[\s\S]*?\/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<link\s+rel="alternate"[\s\S]*?\/>/, `<link rel="alternate" hreflang="zh-CN" href="${canonical}" />`)
    .replace(/<meta\s+property="og:title"[\s\S]*?\/>/, `<meta property="og:title" content="${article.title}" />`)
    .replace(/<meta\s+property="og:description"[\s\S]*?\/>/, `<meta property="og:description" content="${article.description}" />`)
    .replace(/<meta\s+property="og:url"[\s\S]*?\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/(<meta property="og:url"[^>]*\/>)/, `$1\n    <meta property="og:image" content="https://wafulock.cn/images/webp/articles/${article.image}" />`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n    </script>`)
    .replace(/<span class="breadcrumb-current">[\s\S]*?<\/span>/, `<span class="breadcrumb-current">${article.title}</span>`)
    .replace(/<section class="wafu-tech-article">[\s\S]*?<\/section>\s*<\/main>/, `${pageBody(article, body)}</main>`);
  fs.writeFileSync(path.join(resource, article.out), page, 'utf8');
}
for (const article of articles) buildPage(article);

const distributorPath = path.join(resource, 'invisible-smart-lock-distributor-first-order.html');
let distributor = fs.readFileSync(distributorPath, 'utf8');
distributor = distributor.replace(/<span class="wafu-nav-prev wafu-nav-disabled"[\s\S]*?<\/span\s*>\s*<a\s+class="wafu-nav-next"/, `<a class="wafu-nav-prev" href="./invisible-smart-lock-rfq-preparation"><span class="wafu-nav-arrow">❮</span><span class="wafu-nav-content"><span class="wafu-nav-label">上一篇</span><span class="wafu-nav-text">隐形智能锁询价前资料清单</span></span></a><a class="wafu-nav-next"`);
if (!distributor.includes('href="./wf-026-redundant-hidden-lock-project-assessment"')) distributor = distributor.replace(/(<section class="wafu-related-articles">[\s\S]*?<ul class="wafu-related-list">)/, '$1<li class="wafu-related-item"><a class="wafu-related-link" href="./wf-026-redundant-hidden-lock-project-assessment">WF-026 双系统双电机项目评估框架</a></li><li class="wafu-related-item"><a class="wafu-related-link" href="./invisible-smart-lock-rfq-preparation">隐形智能锁询价前资料清单</a></li>');
fs.writeFileSync(distributorPath, distributor, 'utf8');

const articleCards = `            <li class="news-item">\n                <a href="./wf-026-redundant-hidden-lock-project-assessment" class="news-link">\n                    <div class="news-txt">\n                        <h2 class="news-title">WF-026 双系统双电机隐形锁适合哪些项目：项目评估框架</h2>\n                        <p class="news-date">2026年9月5日</p>\n                        <p class="news-desc">面向<strong>项目采购、物业运营与 OEM 团队</strong>，从<strong>门体适配、样品验证、供电、备件与总拥有成本</strong>评估 WF-026 双系统双电机隐形锁是否适合进入项目方案。</p>\n                    </div>\n                </a>\n            </li>\n            <li class="news-item">\n                <a href="./invisible-smart-lock-rfq-preparation" class="news-link">\n                    <div class="news-txt">\n                        <h2 class="news-title">隐形智能锁询价前要准备什么：项目采购资料清单</h2>\n                        <p class="news-date">2026年9月2日</p>\n                        <p class="news-desc">面向<strong>项目采购、经销商和品牌方</strong>，整理<strong>门型、数量、开锁方式、目标市场、包装与售后资料</strong>，帮助供应商形成可执行的配置与报价。</p>\n                    </div>\n                </a>\n            </li>\n`;
const technologyPath = path.join(resource, 'technology.html');
let technology = fs.readFileSync(technologyPath, 'utf8');
if (!technology.includes('href="./wf-026-redundant-hidden-lock-project-assessment">WF-026 项目评估</a>')) technology = technology.replace('<a href="./invisible-smart-lock-distributor-first-order">经销商首单采购准备</a>', '<a href="./wf-026-redundant-hidden-lock-project-assessment">WF-026 项目评估</a>\n            <a href="./invisible-smart-lock-rfq-preparation">隐形锁询价资料清单</a>\n            <a href="./invisible-smart-lock-distributor-first-order">经销商首单采购准备</a>');
if (!technology.includes('<h2 class="news-title">WF-026 双系统双电机隐形锁适合哪些项目：项目评估框架</h2>')) technology = technology.replace('            <li class="news-item">\n                <a href="./invisible-smart-lock-distributor-first-order"', articleCards + '            <li class="news-item">\n                <a href="./invisible-smart-lock-distributor-first-order"');
fs.writeFileSync(technologyPath, technology, 'utf8');

const resourcePath = path.join(root, 'resource.html');
let resourcePage = fs.readFileSync(resourcePath, 'utf8');
if (!resourcePage.includes('href="./resource/wf-026-redundant-hidden-lock-project-assessment"')) resourcePage = resourcePage.replace('<a href="./resource/invisible-smart-lock-distributor-first-order">经销商首单准备</a>', '<a href="./resource/wf-026-redundant-hidden-lock-project-assessment">WF-026 项目评估</a>\n                    <a href="./resource/invisible-smart-lock-rfq-preparation">隐形锁询价资料清单</a>\n                    <a href="./resource/invisible-smart-lock-distributor-first-order">经销商首单准备</a>');
fs.writeFileSync(resourcePath, resourcePage, 'utf8');

const sitemapHtmlPath = path.join(root, 'sitemap.html');
let sitemapHtml = fs.readFileSync(sitemapHtmlPath, 'utf8');
const siteLinks = `                            <a href="resource/wf-026-redundant-hidden-lock-project-assessment" class="site-link">\n                                <img src="./icons/cogs.svg" alt="WF-026 双系统双电机隐形锁项目评估框架" class="link-icon">\n                                <span class="link-text">WF-026 双系统双电机隐形锁适合哪些项目：项目评估框架</span>\n                            </a>\n                            <a href="resource/invisible-smart-lock-rfq-preparation" class="site-link">\n                                <img src="./icons/cogs.svg" alt="隐形智能锁询价前资料清单" class="link-icon">\n                                <span class="link-text">隐形智能锁询价前要准备什么：项目采购资料清单</span>\n                            </a>\n`;
if (!sitemapHtml.includes('href="resource/wf-026-redundant-hidden-lock-project-assessment"')) sitemapHtml = sitemapHtml.replace('                            <a href="resource/invisible-smart-lock-retrofit-assessment"', siteLinks + '                            <a href="resource/invisible-smart-lock-retrofit-assessment"');
fs.writeFileSync(sitemapHtmlPath, sitemapHtml, 'utf8');

const sitemapXmlPath = path.join(root, 'sitemap.xml');
let sitemapXml = fs.readFileSync(sitemapXmlPath, 'utf8');
const xmlLinks = (slug, date) => `  <url>\n    <loc>https://wafulock.cn/resource/${slug}</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n    <xhtml:link rel="alternate" hreflang="zh-CN" href="https://wafulock.cn/resource/${slug}"/>\n  </url>\n`;
if (!sitemapXml.includes('resource/invisible-smart-lock-rfq-preparation')) sitemapXml = sitemapXml.replace('</urlset>', xmlLinks('wf-026-redundant-hidden-lock-project-assessment', '2026-09-05') + xmlLinks('invisible-smart-lock-rfq-preparation', '2026-09-02') + '</urlset>');
fs.writeFileSync(sitemapXmlPath, sitemapXml, 'utf8');
