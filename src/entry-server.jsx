import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';

// Используется скриптом scripts/prerender.mjs для генерации статического HTML.
export function render(url) {
  globalThis.__SSR_PAGE_META__ = null;

  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );

  return { html, meta: globalThis.__SSR_PAGE_META__ };
}
