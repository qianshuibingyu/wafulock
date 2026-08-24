# Phase 0：8 站资源入口同步基线

盘点日期：2026-08-22

## 1. 结论

- 目标站点已确认：`Cnwafu`、`Enwafu`、`Dewafu`、`FRwafu`、`Itwafu`、`Ptwafu`、`Ruwafu`、`Spainwafu`。
- 8 个站点均具备本轮 3 个入口页和 3 个页面专属 CSS 文件。
- Phase 0 未修改任何站点页面、CSS、JS 或资源文件；仅新增本基线报告。
- `Ptwafu` 当前目标文件干净，其余 7 个站点的目标文件存在既有修改，后续必须以当前状态为基线，禁止覆盖或回滚。
- 当前不能直接进行全站批量替换：各站的卡片包裹结构、SEO 串、产品技术资源网格和 slug 存在差异。

## 2. 站点与域名映射

| 目录 | 语言 | 域名 | 站点角色 | 目标文件状态 |
|---|---|---|---|---|
| `Cnwafu` | `zh-CN` | `wafulock.cn` | 国内站 | 目标文件已有修改 |
| `Enwafu` | `en` | `wafuen.com` | 国际主站 | 3 个 HTML 目标文件已有修改 |
| `Dewafu` | `de` | `wafulockde.com` | 外文站 | 3 个 HTML 目标文件已有修改 |
| `FRwafu` | `fr` | `wafulockfr.com` | 外文站 | 3 个 HTML 目标文件已有修改 |
| `Itwafu` | `it` | `wafulockit.com` | 外文站 | 3 个 HTML 目标文件已有修改 |
| `Ptwafu` | `pt-PT` | `wafulockpt.com` | API 表单外文站 | 目标文件干净 |
| `Ruwafu` | `ru` | `wafulockru.com` | 西里尔文外文站 | 目标文件已有修改 |
| `Spainwafu` | `es` | `wafulockes.com` | API 表单外文站 | 3 个 HTML 目标文件已有修改 |

所有站点均存在以下文件：

- `resource.html`
- `resource/technology.html`
- `products.html`
- `css/resource.css`
- `css/technology.css`
- `css/allproduct.css`

## 3. 当前结构差异

### `resource.html`

- `Cnwafu` 已具备“卡片整体下方文章胶囊”的参考结构。
- `Ptwafu` 的资源中心已有较复杂的文章入口串，需要按本地语言重新分组，不能直接套中文 HTML。
- `Enwafu`、`Dewafu`、`FRwafu`、`Itwafu`、`Ruwafu`、`Spainwafu` 仍主要使用外层链接包裹卡片的结构，后续新增卡片外部胶囊时必须避免嵌套链接。
- `Ruwafu` 当前 `resource.html` 没有标准 `page-seo-bar`，需要在 Phase 1 前单独确认其页面结构后再改。

### `resource/technology.html`

- 8 站均有技术文章列表。
- `page-seo-bar` 长度差异明显，部分站点包含多个系列和十余个链接。
- 目标是统一为简短说明 + 2–3 个重点文章胶囊，不删除完整文章列表。
- `Itwafu`、`Ptwafu` 的技术文章页面存在额外结构或内联样式，不能使用整段 CSS 覆盖。

### `products.html`

- `Cnwafu` 已改为胶囊入口参考形态。
- 其他站点仍以两列/多列技术资源卡片为主，部分 CSS 存在移动端和文件末尾的重复网格兜底规则。
- 产品页 B2B lead 文案各语言已本地化，后续只调整入口表现，不删除批发、OEM/ODM、定制、贴牌、模具买断等商业表达。

### CSS 风险

- `page-seo-bar` 仍存在 `white-space: nowrap` 的站点：`Cnwafu`、`FRwafu`、`Ptwafu`、`Spainwafu`。
- 产品技术资源仍存在网格规则的站点：`Enwafu`、`Dewafu`、`FRwafu`、`Itwafu`、`Ptwafu`、`Ruwafu`、`Spainwafu`；`Ruwafu` 有 3 组相关网格规则，需局部清理或提高选择器精度。
- 胶囊样式已存在于 `Cnwafu`，`Ruwafu` 也有一处圆角胶囊规则；其他站点应新增页面专属规则，不能假设 `components.css` 已提供统一样式。

## 4. 文章入口路径映射

以下映射只使用已确认存在的文件，后续同步不得凭英文 slug 猜路径。

| 主题 | Cn / En / Ru / Es | De / Fr / It / Pt | 备注 |
|---|---|---|---|
| B2B 批量采购指南 | `technology-fourteen` | `bulk-invisible-lock` | 已知别名 |
| 制造商选择 | `technology-twenty` | `invisible-lock-guide` | 已知别名 |
| 智能锁验厂 | `smart-lock-factory-audit-guide` | 同左 | 8 站均存在 |
| 欧盟市场验收 | `smart-lock-eu-market-entry-guide` | 同左 | 8 站均存在 |
| 门体兼容性 | `invisible-lock-compatibility-guide` | FR 使用 `invisible-lock-compatibility-issues` | FR 无标准 guide 文件 |
| 电池寿命 | `invisible-battery-life` | 同左 | 8 站均存在 |

技术文章总入口 `resource/technology` 在 8 站均存在，站内链接仍使用无 `.html` 后缀形式。

## 5. 本轮修改白名单

后续 Phase 1–4 只允许修改对应站点的：

- `resource.html`
- `resource/technology.html`
- `products.html`
- `css/resource.css`
- `css/technology.css`
- `css/allproduct.css`

禁止修改：

- 文章正文页、文章图片和文章脚本
- `index.html`
- `sitemap.xml`、`sitemap.html`
- `js/all.js`、`contact-form.js`、Functions
- 分享区、footer、浮动客服、语言切换
- canonical、hreflang、JSON-LD，除非入口链接检查发现明确错误

## 6. 既有改动保护清单

Phase 0 检查到以下目标文件已有改动：

- `Cnwafu`：3 个 HTML + 3 个 CSS 目标文件均有改动。
- `Enwafu`、`Dewafu`、`FRwafu`、`Itwafu`、`Ruwafu`、`Spainwafu`：3 个 HTML 目标文件有改动。
- `Ptwafu`：本轮 6 个目标文件均干净。

此外，各站还有文章、首页、sitemap、脚本、图片或临时素材改动。它们不属于本轮同步范围，禁止清理、覆盖或回滚。

## 7. Phase 0 验收结果

- [x] 8 个站点已确认。
- [x] 8 站目标 HTML 文件全部存在。
- [x] 8 站目标 CSS 文件全部存在。
- [x] 语言与域名映射已确认。
- [x] 重点文章路径和 DE/FR/IT/PT 别名已核对。
- [x] 结构差异和 CSS 风险已记录。
- [x] 修改白名单和非目标范围已记录。
- [x] 既有脏改动已记录，后续不得覆盖。
- [x] Phase 0 未修改站点代码。

## 8. Phase 1 进入条件

Phase 1 可以从 `Cnwafu` 开始，但必须遵守：

1. 只在本报告白名单文件内修改。
2. 先基于当前 Cnwafu 现状确认结构，不覆盖用户已有改动。
3. 每次修改后验证 FAQ 卡片不含技术文章入口。
4. 验证文章胶囊位于两张卡片整体下方，并与 footer 保持间距。
5. 通过移动端、桌面端、链接点击、无横向溢出和控制台检查后，才进入 Phase 2。
