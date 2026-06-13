import { useEffect } from 'react';

const BASE_URL = 'https://metallodvorastana.kz';

export function usePageMeta(title, description, keywords, path, jsonLd) {
  // При пререндере (scripts/prerender.mjs) эффекты не выполняются,
  // поэтому мета-данные страницы передаются наружу через globalThis.
  if (import.meta.env.SSR) {
    globalThis.__SSR_PAGE_META__ = { title, description, keywords, path, jsonLd };
  }

  // jsonLd — объект, который пересоздаётся на каждый рендер; сериализуем,
  // чтобы зависимость эффекта была стабильной по содержимому.
  const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : null;

  useEffect(() => {
    document.title = title;

    setMeta('name', 'description', description);

    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }

    const canonicalPath = path || window.location.pathname;
    setCanonical(`${BASE_URL}${canonicalPath}`);

    setJsonLd(jsonLdString);
  }, [title, description, keywords, path, jsonLdString]);
}

function setMeta(attr, value, content) {
  let tag = document.querySelector(`meta[${attr}="${value}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, value);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

function setCanonical(href) {
  let tag = document.querySelector('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

// Поддерживает один скрипт структурированных данных на страницу.
// При навигации между страницами без jsonLd тег удаляется.
function setJsonLd(content) {
  let tag = document.querySelector('script[data-page-jsonld]');
  if (!content) {
    if (tag) tag.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement('script');
    tag.setAttribute('type', 'application/ld+json');
    tag.setAttribute('data-page-jsonld', '');
    document.head.appendChild(tag);
  }
  tag.textContent = content;
}
