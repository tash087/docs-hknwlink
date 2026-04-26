// build.js - VitePress風ドキュメントポータルビルダー
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================
// ドキュメント定義 - 実際の規約ファイルに合わせて再構築
// ============================================================
const documents = [
    // ==================== 日本語ドキュメント ====================
    {
        id: 'terms',
        path: '/docs/terms',
        file: 'terms.md',
        lang: 'ja',
        category: 'basic',
        categoryName: '基本規約',
        title: '利用規約',
        description: '箱庭リンク（hknw.link）の利用規約です。サービスの利用条件、禁止行為、利用停止などについて定めています。',
        icon: '📋',
        order: 1,
        updatedAt: '2026-04-26'
    },
    {
        id: 'tokushoho',
        path: '/docs/tokushoho',
        file: 'tokushoho.md',
        lang: 'ja',
        category: 'basic',
        categoryName: '基本規約',
        title: '特定商取引法に基づく表記',
        description: '特定商取引法第11条に基づく法定表記です。運営者情報、価格、支払方法などを掲載しています。',
        icon: '🏪',
        order: 2,
        updatedAt: '2026-04-26'
    },
    {
        id: 'disclaimer',
        path: '/docs/disclaimer',
        file: 'disclaimer.md',
        lang: 'ja',
        category: 'basic',
        categoryName: '基本規約',
        title: '免責事項',
        description: '箱庭リンクの免責事項です。転送先URLの内容、エンドユーザーの損害、サービスの安定性などに関する免責を定めています。',
        icon: '⚠️',
        order: 3,
        updatedAt: '2026-04-23'
    },
    {
        id: 'privacy',
        path: '/docs/privacy',
        file: 'privacy.md',
        lang: 'ja',
        category: 'basic',
        categoryName: '基本規約',
        title: 'プライバシーポリシー',
        description: '個人情報の取り扱いについての方針です。収集する情報、収集しない情報、保存期間、第三者提供などを定めています。',
        icon: '🔒',
        order: 4,
        updatedAt: '2026-04-23'
    },
    {
        id: 'terms_en',
        path: '/docs/terms_en',
        file: 'terms_en.md',
        lang: 'en',
        category: 'english',
        categoryName: 'English',
        title: 'Terms of Service',
        description: 'Terms of Service for Hakoniwa Link (hknw.link) URL shortening service.',
        icon: '📋',
        order: 1,
        updatedAt: '2026-04-23'
    },
    {
        id: 'privacy_en',
        path: '/docs/privacy_en',
        file: 'privacy_en.md',
        lang: 'en',
        category: 'english',
        categoryName: 'English',
        title: 'Privacy Policy',
        description: 'Privacy policy for Hakoniwa Link (hknw.link). Information collection, retention, and data handling.',
        icon: '🔒',
        order: 2,
        updatedAt: '2026-04-23'
    },
    {
        id: 'disclaimer_en',
        path: '/docs/disclaimer_en',
        file: 'disclaimer_en.md',
        lang: 'en',
        category: 'english',
        categoryName: 'English',
        title: 'Disclaimer',
        description: 'Disclaimer for Hakoniwa Link (hknw.link). Limitation of liability and risk disclosure.',
        icon: '⚠️',
        order: 3,
        updatedAt: '2026-04-23'
    },
];

const categoryOrder = ['basic', 'english'];

const robotsTxt = `User-agent: *
Allow: /
Sitemap: https://docs-hknw.pages.dev/sitemap.xml`;

function generateSitemap() {
    const urls = documents.map(doc => `
  <url>
    <loc>https://docs-hknw.pages.dev${doc.path}</loc>
    <lastmod>${doc.updatedAt}</lastmod>
    <priority>${doc.path === '/docs/terms' ? '1.0' : '0.8'}</priority>
  </url>`).join('');
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

function generateIndexPage() {
    const groupedDocs = {};
    for (const doc of documents) {
        if (!groupedDocs[doc.category]) groupedDocs[doc.category] = [];
        groupedDocs[doc.category].push(doc);
    }
    for (const category in groupedDocs) {
        groupedDocs[category].sort((a, b) => a.order - b.order);
    }
    const sortedCategories = [];
    for (const catId of categoryOrder) {
        if (groupedDocs[catId]) {
            const catName = groupedDocs[catId][0]?.categoryName || catId;
            sortedCategories.push({ id: catId, name: catName, docs: groupedDocs[catId] });
        }
    }
    const renderDocList = (docs) => {
        return docs.map(doc => `
      <a href="${doc.path}" class="doc-link">
        <span class="doc-icon">${doc.icon}</span>
        <div class="doc-info">
          <span class="doc-title">${escapeHtml(doc.title)}</span>
          <span class="doc-desc">${escapeHtml(doc.description)}</span>
        </div>
        <span class="doc-arrow">→</span>
      </a>
    `).join('');
    };
    const categoriesHtml = sortedCategories.map(category => `
    <div class="category">
      <h2 class="category-title">${escapeHtml(category.name)}</h2>
      <div class="doc-list">
        ${renderDocList(category.docs)}
      </div>
    </div>
  `).join('');

    return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/images/hakoniwa_link_icon.png" type="image/png">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="HAKONIWA Linkの公式ドキュメント。利用規約、プライバシーポリシー、サーバールールなど。">
  <meta name="robots" content="index, follow">
  <title>ドキュメント | HAKONIWA Link</title>
  <style>
/* ============================================================
   ドキュメント一覧ページ用スタイル
   ============================================================ */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  background: #f5f5f7;
  color: #1a1a2e;
  line-height: 1.6;
}
.site-header {
  background: #2c2c2e;
  border-bottom: 1px solid #3a3a3c;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.logo a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}
.logo-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.logo-icon {
  width: 36px;
  height: 36px;
  display: block;
  object-fit: contain;
}
.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.logo-main {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
}
.logo-sub {
  font-size: 0.65rem;
  color: #a0aec0;
  letter-spacing: 0.3px;
}
.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.nav-link {
  color: #cbd5e0;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
  padding: 0.5rem 0;
}
.nav-link:hover { color: white; }
.nav-link.active {
  color: white;
  border-bottom: 2px solid white;
}
.nav-link.discord {
  background: #5865f2;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  color: white;
}
.nav-link.discord:hover { background: #4752c4; }
.main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}
.page-title {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
}
.page-title h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a1a2e;
}
.stats {
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8ec;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}
.stat {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}
.stat-number {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c2c2e;
}
.stat-label {
  font-size: 0.8rem;
  color: #888;
}
.search {
  margin-bottom: 2rem;
}
.search input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  outline: none;
}
.search input:focus { border-color: #2c2c2e; }
.category { margin-bottom: 2rem; }
.category-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c2c2e;
  margin-bottom: 0.75rem;
  padding-left: 0.5rem;
  border-left: 3px solid #2c2c2e;
}
.doc-list {
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8ec;
  overflow: hidden;
}
.doc-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  text-decoration: none;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}
.doc-link:last-child { border-bottom: none; }
.doc-link:hover { background: #f8f8fa; }
.doc-icon {
  font-size: 1.25rem;
  min-width: 28px;
}
.doc-info { flex: 1; }
.doc-title {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a1a2e;
  margin-bottom: 0.2rem;
}
.doc-desc {
  display: block;
  font-size: 0.8rem;
  color: #888;
}
.doc-arrow {
  color: #ccc;
  font-size: 0.9rem;
  transition: transform 0.2s;
}
.doc-link:hover .doc-arrow {
  transform: translateX(3px);
  color: #2c2c2e;
}
.no-results {
  text-align: center;
  padding: 3rem;
  color: #888;
}
.site-footer {
  border-top: 1px solid #e0e0e0;
  background: white;
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
}
.footer-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.footer-links a {
  color: #555;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: #2c2c2e;
  text-decoration: underline;
}
.footer-info {
  font-size: 0.75rem;
  color: #aaa;
  line-height: 1.6;
}
.footer-info a {
  color: #888;
  text-decoration: none;
}
.footer-info a:hover {
  color: #2c2c2e;
  text-decoration: underline;
}
@media (prefers-color-scheme: dark) {
  body { background: #1a1a2e; }
  .doc-list { background: #2d2d44; border-color: #3a3a5a; }
  .doc-link { border-bottom-color: #3a3a5a; }
  .doc-link:hover { background: #3a3a5a; }
  .doc-title { color: #e2e8f0; }
  .doc-desc { color: #a0aec0; }
  .stats { background: #2d2d44; border-color: #3a3a5a; }
  .stat-number { color: #e2e8f0; }
  .stat-label { color: #a0aec0; }
  .search input { background: #2d2d44; border-color: #3a3a5a; color: white; }
  .page-title { border-bottom-color: #3a3a5a; }
  .page-title h1 { color: #e2e8f0; }
  .category-title { color: #e2e8f0; border-left-color: #a0aec0; }
  .site-footer { border-top-color: #3a3a5a; background: #1a1a2e; }
  .footer-links a { color: #9ca3af; }
  .footer-links a:hover { color: #e2e8f0; }
  .footer-info { color: #6b7280; }
  .footer-info a { color: #9ca3af; }
  .footer-info a:hover { color: #e2e8f0; }
  .doc-arrow { color: #4a5568; }
  .doc-link:hover .doc-arrow { color: #a0aec0; }
  .logo-sub { color: #9ca3af; }
}
@media (max-width: 768px) {
  .main { padding: 1rem; }
  .page-title h1 { font-size: 1.4rem; }
  .stats { flex-direction: column; gap: 0.75rem; }
  .header-inner { flex-direction: column; text-align: center; }
  .logo a { justify-content: center; }
  .logo-icon { width: 28px; height: 28px; }
  .logo-main { font-size: 0.95rem; }
  .logo-sub { font-size: 0.55rem; }
  .nav-links { justify-content: center; gap: 1rem; }
  .nav-link { font-size: 0.8rem; }
  .nav-link.discord { padding: 0.3rem 0.8rem; }
  .doc-link { padding: 0.75rem 1rem; }
  .doc-desc { display: none; }
  .footer-links { flex-direction: column; gap: 0.5rem; align-items: center; }
}
@media print {
  body { background: white; }
  .site-header, .search, .stats, .site-footer { display: none; }
  .doc-list { border: none; }
  .doc-link { border-bottom: 1px solid #ccc; }
}
    </style>
</head>
<body>
  <div class="site-header">
    <div class="header-inner">
      <div class="logo">
        <a href="/">
          <div class="logo-icon-wrapper">
            <img src="/images/hakoniwa_link_icon.png" alt="HAKONIWA Studio" class="logo-icon">
          </div>
          <div class="logo-text">
            <span class="logo-main">HAKONIWA Link</span>
            <span class="logo-sub">URL Shortener</span>
          </div>
        </a>
      </div>
      <div class="nav-links">
        <a href="/" class="nav-link active">
          <div class="logo-icon-wrapper"><img src="/images/docs_icon.png" alt="ドキュメント" class="logo-icon"></div>
          ドキュメント
        </a>
        <a href="https://hknw.link" target="_blank" class="nav-link">
          <div class="logo-icon-wrapper"><img src="/images/service_icon.png" alt="サービス" class="logo-icon"></div>
          サービス
        </a>
        <a href="#" class="nav-link">
          <div class="logo-icon-wrapper"><img src="/images/github_icon.png" alt="GitHub" class="logo-icon"></div>
          GitHub(準備中)
        </a>
        <a href="#" class="nav-link discord">
          <div class="logo-icon-wrapper"><img src="/images/discord_icon.png" alt="Discord" class="logo-icon"></div>
          Discord(準備中)
        </a>
      </div>
    </div>
  </div>
  
  <div class="main">
    <div class="page-title">
      <h1>📚 ドキュメント</h1>
    </div>
    
    <div class="stats">
      <div class="stat">
        <span class="stat-number">${documents.length}</span>
        <span class="stat-label">ドキュメント</span>
      </div>
      <div class="stat">
        <span class="stat-number">${Object.keys(groupedDocs).length}</span>
        <span class="stat-label">カテゴリー</span>
      </div>
      <div class="stat">
        <span class="stat-number">${new Date().getFullYear()}</span>
        <span class="stat-label">開設</span>
      </div>
    </div>
    
    <div class="search">
      <input type="text" id="searchInput" placeholder="ドキュメントを検索..." autocomplete="off">
    </div>
    
    <div id="categoriesContainer">
      ${categoriesHtml}
    </div>
    
    <div id="noResults" class="no-results" style="display: none;">
      <p>🔍 検索結果が見つかりませんでした</p>
      <p style="font-size: 0.85rem; margin-top: 0.5rem;">別のキーワードで試してみてください</p>
    </div>
  </div>
  
  <div class="site-footer">
    <div class="footer-nav">
      <div class="footer-links">
        <a href="/docs/tokushoho">📋 特定商取引法に基づく表記</a>
      </div>
      <div class="footer-links">
        <a href="/docs/terms">📋 利用規約</a>
        <a href="/docs/disclaimer">⚠️ 免責事項</a>
        <a href="/docs/privacy">🔒 プライバシーポリシー</a>
      </div>
      <div class="footer-links">
        <a href="/docs/terms_en">📋 Terms of Service</a>
        <a href="/docs/disclaimer_en">⚠️ Disclaimer</a>
        <a href="/docs/privacy_en">🔒 Privacy Policy</a>
      </div>
    </div>
    <div class="footer-info">
      <p>© 2026 HAKONIWA Studio All Rights Reserved.<br>Designed and Developed by HAKONIWA Studio.</p>
      <p>
        <a href="mailto:legal@hknw.link">legal@hknw.link</a> | 
        <a href="mailto:abuse@hknw.link">abuse@hknw.link</a>
      </p>
    </div>
  </div>
  
  <script>
    const searchInput = document.getElementById('searchInput');
    const categoriesContainer = document.getElementById('categoriesContainer');
    const noResults = document.getElementById('noResults');
    
    const allDocs = ${JSON.stringify(documents.map(doc => ({
        title: doc.title,
        description: doc.description,
        path: doc.path,
        category: doc.category,
        categoryName: doc.categoryName,
        icon: doc.icon
    })))};
    
    const categoryOrder = ${JSON.stringify(categoryOrder)};
    
    function renderDocList(docs) {
      return docs.map(doc => \`
        <a href="\${doc.path}" class="doc-link">
          <span class="doc-icon">\${doc.icon}</span>
          <div class="doc-info">
            <span class="doc-title">\${escapeHtml(doc.title)}</span>
            <span class="doc-desc">\${escapeHtml(doc.description)}</span>
          </div>
          <span class="doc-arrow">→</span>
        </a>
      \`).join('');
    }
    
    function renderCategories(docs) {
      const grouped = {};
      for (const doc of docs) {
        if (!grouped[doc.category]) grouped[doc.category] = [];
        grouped[doc.category].push(doc);
      }
      let html = '';
      for (const catId of categoryOrder) {
        if (grouped[catId] && grouped[catId].length > 0) {
          const catName = grouped[catId][0].categoryName;
          html += \`
            <div class="category">
              <h2 class="category-title">\${escapeHtml(catName)}</h2>
              <div class="doc-list">
                \${renderDocList(grouped[catId])}
              </div>
            </div>
          \`;
        }
      }
      return html;
    }
    
    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    function performSearch() {
      const query = searchInput.value.toLowerCase().trim();
      if (query === '') {
        categoriesContainer.innerHTML = renderCategories(allDocs);
        noResults.style.display = 'none';
        return;
      }
      const filtered = allDocs.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.description.toLowerCase().includes(query) ||
        doc.categoryName.toLowerCase().includes(query)
      );
      if (filtered.length === 0) {
        categoriesContainer.innerHTML = '';
        noResults.style.display = 'block';
        return;
      }
      noResults.style.display = 'none';
      categoriesContainer.innerHTML = renderCategories(filtered);
    }
    
    searchInput.addEventListener('input', performSearch);
  </script>
</body>
</html>`;
}

// ============================================================
// 個別ドキュメントページを生成
// ============================================================
function renderMarkdownToHtml(markdown, doc, currentPath) {
    let html = markdown;

    // コードブロック退避
    const codeBlocks = [];
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const index = codeBlocks.length;
        codeBlocks.push({ lang, code: code.trim() });
        return `__CODE_BLOCK_${index}__`;
    });

    // インラインコード退避
    const inlineCodes = [];
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        const index = inlineCodes.length;
        inlineCodes.push(code);
        return `__INLINE_CODE_${index}__`;
    });

    // 見出し
    html = html.replace(/^###### (.*$)/gm, "<h6>$1</h6>");
    html = html.replace(/^##### (.*$)/gm, "<h5>$1</h5>");
    html = html.replace(/^#### (.*$)/gm, "<h4>$1</h4>");
    html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*$)/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*$)/gm, "<h1>$1</h1>");

    // 装飾
    html = html.replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
    html = html.replace(/~~(.*?)~~/g, "<del>$1</del>");
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">');

    // 水平線
    html = html.replace(/^---$/gm, "<hr>");
    html = html.replace(/^___$/gm, "<hr>");
    html = html.replace(/^\*\*\*$/gm, "<hr>");

    // テーブル処理
    html = processTables(html);

<<<<<<< HEAD
    // ★★★ 修正済みリスト処理（インデントを考慮） ★★★
=======
    // リスト処理（修正版）
>>>>>>> cf9716546bca58afb482ffc655ce8442f2b980e4
    html = processLists(html);

    // 引用
    html = html.replace(/^&gt; (.*$)/gm, "<blockquote>$1</blockquote>");
    html = html.replace(/^> (.*$)/gm, "<blockquote>$1</blockquote>");

    // 改行 → 段落
    const lines = html.split("\n");
    let processedLines = [];
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.trim() === "") {
            processedLines.push("");
        } else if (line.startsWith("<h") || line.startsWith("<ul") || line.startsWith("<ol") ||
            line.startsWith("<blockquote") || line.startsWith("<hr") ||
            line.startsWith("__CODE_BLOCK_") || line.startsWith("<table")) {
            processedLines.push(line);
        } else {
            processedLines.push(line);
        }
    }

    let tempHtml = processedLines.join("\n");
    const paragraphParts = tempHtml.split(/\n\s*\n/);
    tempHtml = paragraphParts.map((part) => {
        if (part.trim() === "") return "";
        if (part.startsWith("<h") || part.startsWith("<ul") || part.startsWith("<ol") ||
            part.startsWith("<blockquote") || part.startsWith("<hr") ||
            part.startsWith("__CODE_BLOCK_") || part.startsWith("<table")) {
            return part;
        }
        let inlineText = part.replace(/\n/g, "<br>");
        return `<p>${inlineText}</p>`;
    }).join("\n\n");

    // コード復元
    tempHtml = tempHtml.replace(/__INLINE_CODE_(\d+)__/g, (match, index) => {
        const code = inlineCodes[parseInt(index)];
        return `<code>${escapeHtml(code)}</code>`;
    });
    tempHtml = tempHtml.replace(/__CODE_BLOCK_(\d+)__/g, (match, index) => {
        const block = codeBlocks[parseInt(index)];
        return `<pre><code>${escapeHtml(block.code)}</code></pre>`;
    });

    const breadcrumb = `
    <div class="breadcrumb">
      <a href="/">ホーム</a>
      <span class="separator">›</span>
      <span>${escapeHtml(doc.title)}</span>
    </div>`;
    const backLink = `<div class="back-link"><a href="/">← ドキュメント一覧に戻る</a></div>`;
    const relatedDocs = documents.filter(d => d.category === doc.category && d.id !== doc.id).slice(0, 3);
    const relatedHtml = relatedDocs.length > 0 ? `
    <div class="related">
      <h3 class="related-title">関連ドキュメント</h3>
      <div class="related-list">
        ${relatedDocs.map(d => `<a href="${d.path}" class="related-link"><span>${d.icon}</span><span>${escapeHtml(d.title)}</span></a>`).join('')}
      </div>
    </div>` : '';

    return `<!DOCTYPE html>
<html lang="${doc.lang}">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="/images/hakoniwa_link_icon.png" type="image/png">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHtml(doc.description)}">
  <meta name="robots" content="index, follow">
  <title>${escapeHtml(doc.title)} | HAKONIWA Link</title>
  <style>
 /* ============================================================
   個別ドキュメントページ用スタイル
   ============================================================ */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  background: #f5f5f7;
  color: #1a1a2e;
  line-height: 1.7;
}
.site-header {
  background: #2c2c2e;
  border-bottom: 1px solid #3a3a3c;
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  max-width: 1000px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.logo a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}
.logo-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.logo-icon {
  width: 36px;
  height: 36px;
  display: block;
  object-fit: contain;
}
.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}
.logo-main {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  letter-spacing: 0.5px;
}
.logo-sub {
  font-size: 0.65rem;
  color: #a0aec0;
  letter-spacing: 0.3px;
}
.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}
.nav-link {
  color: #cbd5e0;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
  padding: 0.5rem 0;
}
.nav-link:hover { color: white; }
.nav-link.active {
  color: white;
  border-bottom: 2px solid white;
}
.nav-link.discord {
  background: #5865f2;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  color: white;
}
.nav-link.discord:hover { background: #4752c4; }
.main {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}
.content-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e8e8ec;
  overflow: hidden;
}
.breadcrumb {
  padding: 1rem 2rem;
  background: #fafafc;
  border-bottom: 1px solid #e8e8ec;
  font-size: 0.85rem;
  color: #888;
}
.breadcrumb a {
  color: #666;
  text-decoration: none;
}
.breadcrumb a:hover {
  color: #2c2c2e;
  text-decoration: underline;
}
.breadcrumb .separator {
  margin: 0 0.5rem;
  color: #ccc;
}
.back-link {
  padding: 1rem 2rem 0 2rem;
}
.back-link a {
  display: inline-block;
  color: #888;
  text-decoration: none;
  font-size: 0.85rem;
}
.back-link a:hover { color: #2c2c2e; }
.content { padding: 2rem; }
.content h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 1rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e8e8ec;
}
.content h2 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 1.5rem 0 0.75rem 0;
  padding-left: 0.75rem;
  border-left: 3px solid #2c2c2e;
}
.content h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c2c2e;
  margin: 1.25rem 0 0.5rem 0;
}
.content h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #3a3a3e;
  margin: 1rem 0 0.5rem 0;
}
.content p {
  margin-bottom: 1rem;
  color: #3a3a3e;
  line-height: 1.7;
}
.content ul, .content ol {
  margin: 0.75rem 0 1rem 1.5rem;
}
.content li {
  margin-bottom: 0.25rem;
  color: #3a3a3e;
}
.content blockquote {
  background: #f8f8fa;
  border-left: 3px solid #2c2c2e;
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  color: #555;
  font-size: 0.9rem;
}
.content code {
  background: #f0f0f4;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-size: 0.85rem;
  color: #c0392b;
}
.content pre {
  background: #1e1e2e;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
}
.content pre code {
  background: none;
  color: #e2e8f0;
  padding: 0;
  font-size: 0.85rem;
}
.content table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  border: 1px solid #e8e8ec;
}
.content th {
  background: #f8f8fa;
  padding: 0.75rem;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid #e8e8ec;
}
.content td {
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}
.content tr:last-child td { border-bottom: none; }
.content hr {
  margin: 1.5rem 0;
  border: none;
  height: 1px;
  background: #e8e8ec;
}
.content a {
  color: #2c2c2e;
  text-decoration: none;
  border-bottom: 1px solid #d0d0d0;
}
.content a:hover { border-bottom-color: #2c2c2e; }
.related {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e8e8ec;
}
.related-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #888;
  margin-bottom: 0.75rem;
}
.related-list {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.related-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: #f0f0f4;
  border-radius: 20px;
  text-decoration: none;
  font-size: 0.85rem;
  color: #3a3a3e;
  transition: background 0.2s;
}
.related-link:hover {
  background: #e8e8ec;
  border-bottom: none;
}
.updated {
  margin-top: 1.5rem;
  padding-top: 1rem;
  font-size: 0.75rem;
  color: #aaa;
  text-align: right;
  border-top: 1px solid #e8e8ec;
}
.site-footer {
  border-top: 1px solid #e0e0e0;
  background: white;
  padding: 2rem;
  text-align: center;
  margin-top: 2rem;
}
.footer-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.footer-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.footer-links a {
  color: #555;
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.2s;
}
.footer-links a:hover {
  color: #2c2c2e;
  text-decoration: underline;
}
.footer-info {
  font-size: 0.75rem;
  color: #aaa;
  line-height: 1.6;
}
.footer-info a {
  color: #888;
  text-decoration: none;
}
.footer-info a:hover {
  color: #2c2c2e;
  text-decoration: underline;
}
@media (prefers-color-scheme: dark) {
  body { background: #1a1a2e; }
  .content-card { background: #2d2d44; border-color: #3a3a5a; }
  .breadcrumb { background: #25253a; border-bottom-color: #3a3a5a; }
  .breadcrumb a { color: #a0aec0; }
  .breadcrumb a:hover { color: #e2e8f0; }
  .content h1 { color: #e2e8f0; border-bottom-color: #3a3a5a; }
  .content h2 { color: #e2e8f0; border-left-color: #a0aec0; }
  .content h3 { color: #cbd5e0; }
  .content p, .content li { color: #cbd5e0; }
  .content blockquote { background: #25253a; color: #a0aec0; }
  .content code { background: #25253a; color: #fc8181; }
  .content pre { background: #0f0f1a; }
  .content table { border-color: #3a3a5a; }
  .content th { background: #25253a; color: #e2e8f0; border-bottom-color: #3a3a5a; }
  .content td { border-bottom-color: #3a3a5a; color: #cbd5e0; }
  .content hr { background: #3a3a5a; }
  .content a { color: #a0aec0; border-bottom-color: #4a5568; }
  .content a:hover { border-bottom-color: #a0aec0; }
  .related { border-top-color: #3a3a5a; }
  .related-title { color: #888; }
  .related-link { background: #25253a; color: #cbd5e0; }
  .related-link:hover { background: #3a3a5a; }
  .updated { border-top-color: #3a3a5a; color: #666; }
  .site-footer { border-top-color: #3a3a5a; background: #1a1a2e; }
  .footer-links a { color: #9ca3af; }
  .footer-links a:hover { color: #e2e8f0; }
  .footer-info { color: #6b7280; }
  .footer-info a { color: #9ca3af; }
  .footer-info a:hover { color: #e2e8f0; }
  .back-link a { color: #888; }
  .back-link a:hover { color: #e2e8f0; }
  .logo-sub { color: #9ca3af; }
}
@media (max-width: 768px) {
  .main { padding: 1rem; }
  .content { padding: 1.25rem; }
  .breadcrumb { padding: 0.75rem 1.25rem; }
  .back-link { padding: 0.75rem 1.25rem 0 1.25rem; }
  .content h1 { font-size: 1.4rem; }
  .content h2 { font-size: 1.2rem; }
  .header-inner { flex-direction: column; text-align: center; }
  .logo a { justify-content: center; }
  .nav-links { justify-content: center; gap: 1rem; }
  .nav-link { font-size: 0.8rem; }
  .nav-link.discord { padding: 0.3rem 0.8rem; }
  .related-list { flex-direction: column; gap: 0.5rem; }
  .related-link { display: flex; justify-content: center; }
  .logo-icon { width: 28px; height: 28px; }
  .logo-main { font-size: 0.95rem; }
  .logo-sub { font-size: 0.55rem; }
  .footer-links { flex-direction: column; gap: 0.5rem; align-items: center; }
}
@media print {
  body { background: white; }
  .site-header, .breadcrumb, .back-link, .related, .site-footer { display: none; }
  .content-card { border: none; }
  .content { padding: 0; }
  .content a { color: black; border-bottom: none; }
}
  </style>
</head>
<body>
  <div class="site-header">
    <div class="header-inner">
      <div class="logo">
        <a href="/">
          <div class="logo-icon-wrapper"><img src="/images/hakoniwa_link_icon.png" alt="HAKONIWA Studio" class="logo-icon"></div>
          <div class="logo-text"><span class="logo-main">HAKONIWA Link</span><span class="logo-sub">URL Shortener</span></div>
        </a>
      </div>
      <div class="nav-links">
        <a href="/" class="nav-link active"><div class="logo-icon-wrapper"><img src="/images/docs_icon.png" alt="ドキュメント" class="logo-icon"></div>ドキュメント</a>
        <a href="https://hknw.link" target="_blank" class="nav-link"><div class="logo-icon-wrapper"><img src="/images/service_icon.png" alt="サービス" class="logo-icon"></div>サービス</a>
        <a href="#" class="nav-link"><div class="logo-icon-wrapper"><img src="/images/github_icon.png" alt="GitHub" class="logo-icon"></div>GitHub(準備中)</a>
        <a href="#" class="nav-link discord"><div class="logo-icon-wrapper"><img src="/images/discord_icon.png" alt="Discord" class="logo-icon"></div>Discord(準備中)</a>
      </div>
    </div>
  </div>
  
  <div class="main">
    <div class="content-card">
      ${breadcrumb}
      ${backLink}
      <div class="content">
        ${tempHtml}
        <div class="updated">最終更新日: ${doc.updatedAt}</div>
        ${relatedHtml}
      </div>
    </div>
  </div>
  
  <div class="site-footer">
    <div class="footer-nav">
      <div class="footer-links"><a href="/docs/tokushoho">📋 特定商取引法に基づく表記</a></div>
      <div class="footer-links">
        <a href="/docs/terms">📋 利用規約</a>
        <a href="/docs/disclaimer">⚠️ 免責事項</a>
        <a href="/docs/privacy">🔒 プライバシーポリシー</a>
      </div>
      <div class="footer-links">
        <a href="/docs/terms_en">📋 Terms of Service</a>
        <a href="/docs/disclaimer_en">⚠️ Disclaimer</a>
        <a href="/docs/privacy_en">🔒 Privacy Policy</a>
      </div>
    </div>
    <div class="footer-info">
      <p>© 2026 HAKONIWA Studio All Rights Reserved.<br>Designed and Developed by HAKONIWA Studio.</p>
      <p><a href="mailto:legal@hknw.link">legal@hknw.link</a> | <a href="mailto:abuse@hknw.link">abuse@hknw.link</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ============================================================
// ユーティリティ関数
// ============================================================
function processTables(text) {
    const lines = text.split("\n");
    let inTable = false;
    let tableRows = [];
    let result = [];
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith("|") && line.endsWith("|")) {
            if (!inTable) { inTable = true; tableRows = []; }
            tableRows.push(line);
        } else {
            if (inTable && tableRows.length > 0) {
                result.push(convertTableToHtml(tableRows));
                tableRows = [];
                inTable = false;
            }
            result.push(lines[i]);
        }
    }
    if (inTable && tableRows.length > 0) result.push(convertTableToHtml(tableRows));
    return result.join("\n");
}

function convertTableToHtml(rows) {
    let html = "<table>\n";
    let isHeader = true;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.split("|").filter((cell) => cell.trim() !== "");
        if (cells.length > 0 && cells[0].match(/^\s*[-:]+\s*$/)) {
            isHeader = false;
            continue;
        }
        const formatCellContent = (content) => {
            let text = content.trim();
            text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
            text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
            text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
            return text;
        };
        if (isHeader && i === 0) {
            html += "  <thead>\n    <tr>\n";
            for (const cell of cells) html += `      <th>${formatCellContent(cell)}</th>\n`;
            html += "    </tr>\n  </thead>\n";
        } else {
            if (isHeader) { html += "  <tbody>\n"; isHeader = false; }
            html += "    <tr>\n";
            for (const cell of cells) html += `      <td>${formatCellContent(cell)}</td>\n`;
            html += "    </td>\n";
        }
    }
    if (!isHeader) html += "  </tbody>\n";
    html += "</table>";
    return html;
}

<<<<<<< HEAD
// ★★★ 完全修正版：インデント（スペース）を考慮したリスト処理 ★★★
function processLists(text) {
    const lines = text.split(/\r?\n/);
    const stack = [];  // 要素: { type: 'ol'/'ul', indent: number }
    const result = [];
=======
// ★★★ 修正済み processLists 関数（ネストされたリストを正しく処理） ★★★
function processLists(text) {
    const lines = text.split(/\r?\n/);
    const stack = []; // 開いている親リスト情報を管理
    const result = [];
    let inList = false;
>>>>>>> cf9716546bca58afb482ffc655ce8442f2b980e4

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim() === '') {
<<<<<<< HEAD
            // 空行で全てのリストを閉じる
            while (stack.length) {
                const frame = stack.pop();
                result.push(`</${frame.type}>`);
            }
=======
            // 空行: すべてのリストを終了
            while (stack.length) {
                const { type } = stack.pop();
                result.push(`</li></${type}>`);
            }
            inList = false;
>>>>>>> cf9716546bca58afb482ffc655ce8442f2b980e4
            result.push('');
            continue;
        }

<<<<<<< HEAD
        // 行頭のスペース数をカウント（インデントレベル）
        const leadingSpaces = line.match(/^ +/)?.[0].length || 0;
        const indentLevel = Math.floor(leadingSpaces / 2);  // スペース2個で1レベル

=======
        const leadingSpaces = line.match(/^ +/)?.[0].length || 0;
        const indentLevel = Math.floor(leadingSpaces / 2);
>>>>>>> cf9716546bca58afb482ffc655ce8442f2b980e4
        const trimmed = line.trim();
        const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        const unorderedMatch = trimmed.match(/^[\*\-]\s+(.*)$/);

        if (orderedMatch || unorderedMatch) {
            const isOrdered = !!orderedMatch;
            const content = isOrdered ? orderedMatch[2] : unorderedMatch[1];
            const currentType = isOrdered ? 'ol' : 'ul';

<<<<<<< HEAD
            // 1. 現在のインデントより深いリストは閉じる
            while (stack.length > 0 && stack[stack.length - 1].indent > indentLevel) {
                const frame = stack.pop();
                result.push(`</${frame.type}>`);
            }

            // 2. 同じ深さでタイプが異なる場合、前のリストを閉じる
            if (stack.length > 0 && stack[stack.length - 1].indent === indentLevel && stack[stack.length - 1].type !== currentType) {
                const frame = stack.pop();
                result.push(`</${frame.type}>`);
            }

            // 3. 新しいリストを開始するか、同じリストの次のアイテムか判定
            if (stack.length === 0 || stack[stack.length - 1].indent < indentLevel) {
                // 新しいリストを開始
                result.push(`<${currentType}>`);
                stack.push({ type: currentType, indent: indentLevel });
                result.push(`<li>${content}</li>`);
            } else if (stack[stack.length - 1].indent === indentLevel && stack[stack.length - 1].type === currentType) {
                // 同じリストの次のアイテム
                result.push(`<li>${content}</li>`);
            } else {
                // その他のケース（通常はここには来ないが、安全のため）
                result.push(`<li>${content}</li>`);
            }
        } else {
            // リストではない行 → 全てのリストを閉じる
            while (stack.length) {
                const frame = stack.pop();
                result.push(`</${frame.type}>`);
            }
            result.push(line);
        }
    }
    // ファイル末尾で未閉じのリストを閉じる
    while (stack.length) {
        const frame = stack.pop();
        result.push(`</${frame.type}>`);
    }
=======
            // 現在の深さより深いリストをすべて閉じる
            while (stack.length > 0 && stack[stack.length - 1].indent >= indentLevel) {
                const { type } = stack.pop();
                result.push(`</li></${type}>`);
            }

            // 同じ階層で新しいリストタイプなら、直前のアイテムを閉じて新規開始
            if (stack.length === 0 || stack[stack.length - 1].indent < indentLevel) {
                // 親があれば、親のliを閉じる前に子リストを開く準備
                if (stack.length > 0 && !stack[stack.length - 1].childOpened) {
                    // ここでは何もしない（子リストはこれから）
                }
                result.push(`<${currentType}>`);
                stack.push({ type: currentType, indent: indentLevel, childOpened: false });
                result.push(`<li>${content}`);
            } 
            else if (stack[stack.length - 1].type === currentType) {
                // 同じタイプの次のアイテム
                result.push(`</li><li>${content}`);
            } 
            else {
                // 異なるタイプ（例: ol → ul）: 一旦閉じて新しいタイプ開始
                const { type } = stack.pop();
                result.push(`</li></${type}>`);
                result.push(`<${currentType}>`);
                stack.push({ type: currentType, indent: indentLevel, childOpened: false });
                result.push(`<li>${content}`);
            }
        } else {
            // リスト外テキスト: リストをすべて閉じる
            while (stack.length) {
                const { type } = stack.pop();
                result.push(`</li></${type}>`);
            }
            inList = false;
            result.push(line);
        }
    }

    while (stack.length) {
        const { type } = stack.pop();
        result.push(`</li></${type}>`);
    }

>>>>>>> cf9716546bca58afb482ffc655ce8442f2b980e4
    return result.join('\n');
}

function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

async function fetchMarkdown(fileName) {
    const localPath = path.join(__dirname, 'contents', fileName);
    if (fs.existsSync(localPath)) {
        return fs.readFileSync(localPath, 'utf-8');
    }
    const githubUrl = `https://raw.githubusercontent.com/hknw/docs/main/contents/${fileName}`;
    try {
        const response = await fetch(githubUrl);
        if (!response.ok) {
            return `# ${fileName.replace('.md', '')}\n\nここにドキュメントの内容が入ります。\n\n- 項目1\n- 項目2\n\n## セクション\n\n詳細な内容を記述してください。`;
        }
        return response.text();
    } catch {
        return `# ${fileName.replace('.md', '')}\n\nここにドキュメントの内容が入ります。`;
    }
}

async function build() {
    const outputDir = path.join(__dirname, 'dist');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const imagesDir = path.join(outputDir, 'images');
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

    console.log('🚀 Building static documentation site...\n');

    console.log('  📄 Generating index page (document portal)...');
    const indexHtml = generateIndexPage();
    fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml, 'utf-8');

    // /docs/index.html リダイレクトページを生成
    const docsIndexHtml = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta http-equiv="refresh" content="0;url=/"><title>Redirecting...</title></head>
<body><p>Redirecting to <a href="/">Home</a>...</p></body>
</html>`;
    const docsDir = path.join(outputDir, 'docs');
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    fs.writeFileSync(path.join(docsDir, 'index.html'), docsIndexHtml, 'utf-8');

    for (const doc of documents) {
        console.log(`  📄 Generating ${doc.path}...`);
        try {
            const markdown = await fetchMarkdown(doc.file);
            const html = renderMarkdownToHtml(markdown, doc, doc.path);
            const dirPath = path.join(outputDir, doc.path.replace(/^\/+/, ''));
            if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
            fs.writeFileSync(path.join(dirPath, 'index.html'), html, 'utf-8');
        } catch (error) {
            console.error(`  ❌ Error: ${doc.path} - ${error.message}`);
        }
    }

    console.log('  📄 Generating robots.txt...');
    fs.writeFileSync(path.join(outputDir, 'robots.txt'), robotsTxt);
    console.log('  📄 Generating sitemap.xml...');
    fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), generateSitemap());

<<<<<<< HEAD
    const sourceImagesDir = path.join(__dirname, 'public', 'images');
    const destImagesDir = path.join(outputDir, 'images');
    if (!fs.existsSync(destImagesDir)) fs.mkdirSync(destImagesDir, { recursive: true });

    const imageFiles = ['hakoniwa_link_icon.png', 'docs_icon.png', 'service_icon.png', 'github_icon.png', 'discord_icon.png'];
=======
    // 4. 画像ファイルのコピー
    const sourceImagesDir = path.join(__dirname, 'public', 'images');
    const destImagesDir = path.join(outputDir, 'images');
    
    if (!fs.existsSync(destImagesDir)) {
        fs.mkdirSync(destImagesDir, { recursive: true });
    }
    
    const imageFiles = [
        'hakoniwa_link_icon.png',
        'docs_icon.png',
        'service_icon.png',
        'github_icon.png',
        'discord_icon.png',
    ];
    
>>>>>>> cf9716546bca58afb482ffc655ce8442f2b980e4
    let copiedCount = 0;
    for (const imageFile of imageFiles) {
        const sourcePath = path.join(sourceImagesDir, imageFile);
        const destPath = path.join(destImagesDir, imageFile);
        if (fs.existsSync(sourcePath)) {
            fs.copyFileSync(sourcePath, destPath);
            console.log(`  🖼️  Copied ${imageFile} to dist/images/`);
            copiedCount++;
        } else {
            console.log(`  ⚠️  Warning: ${imageFile} not found at`, sourcePath);
        }
    }
    if (copiedCount === 0) console.log('  ⚠️  No image files copied. Place images in public/images/');

    console.log('\n✅ Build complete!');
    console.log(`   Output: ${outputDir}`);
    console.log(`   Pages: ${documents.length + 2} (${documents.length} docs + index + redirect)`);
}

build().catch(console.error);