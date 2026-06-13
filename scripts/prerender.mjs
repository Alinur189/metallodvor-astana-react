// Пререндер всех маршрутов в статический HTML после `vite build`.
// Каждая страница получает готовый контент и свои мета-теги,
// чтобы поисковики и мессенджеры видели её без выполнения JS.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const distServer = path.join(root, 'dist-server');
const BASE_URL = 'https://metallodvorastana.kz';

const { render } = await import(pathToFileURL(path.join(distServer, 'entry-server.js')));
const { categories } = await import(pathToFileURL(path.join(root, 'src/data/categories.js')));
const { products } = await import(pathToFileURL(path.join(root, 'src/data/products.js')));

const routes = [
  '/',
  '/catalog',
  '/about',
  '/delivery',
  '/contacts',
  '/price-list',
  '/factory',
  '/guide/svarnaya-setka-dlya-styazhki',
  '/guide/kladochnaya-setka',
  ...categories.map((c) => `/catalog/${c.slug}`),
  ...products.map((p) => `/product/${p.id}`),
];

const escapeHtml = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

const template = await readFile(path.join(dist, 'index.html'), 'utf8');

for (const route of routes) {
  const { html, meta } = render(route);

  let page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  if (meta) {
    const title = escapeHtml(meta.title);
    const description = escapeHtml(meta.description);
    const canonical = `${BASE_URL}${meta.path || route}`;

    page = page
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
      .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`);

    if (meta.keywords) {
      page = page.replace(
        /(<meta name="keywords" content=")[^"]*(")/,
        `$1${escapeHtml(meta.keywords)}$2`,
      );
    }

    if (meta.jsonLd) {
      // Экранируем `<`, чтобы содержимое не могло закрыть тег <script>.
      const json = JSON.stringify(meta.jsonLd).replace(/</g, '\\u003c');
      const script = `<script type="application/ld+json" data-page-jsonld>${json}</script>`;
      page = page.replace('</head>', `    ${script}\n  </head>`);
    }
  }

  // `/catalog/armatura` → dist/catalog/armatura.html: GitHub Pages отдаёт
  // .html-файл по URL без расширения напрямую, без 301-редиректа на слэш.
  const outFile =
    route === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.slice(1)}.html`);
  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, page);
}

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((r) => `  <url>\n    <loc>${BASE_URL}${r}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
  .join('\n')}
</urlset>
`;
await writeFile(path.join(dist, 'sitemap.xml'), sitemap);

await rm(distServer, { recursive: true, force: true });

console.log(`Prerendered ${routes.length} routes + sitemap.xml`);
