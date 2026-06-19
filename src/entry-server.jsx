import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { preloadAll } from './routes.jsx';

// Используется скриптом scripts/prerender.mjs для генерации статического HTML.
// Маршруты ленивые, поэтому перед синхронным renderToString их нужно
// предзагрузить — иначе в HTML попадёт только Suspense fallback.
export async function render(url) {
  await preloadAll();

  globalThis.__SSR_PAGE_META__ = null;

  const html = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );

  return { html, meta: globalThis.__SSR_PAGE_META__ };
}
