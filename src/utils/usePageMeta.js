import { useEffect } from 'react';

const BASE_URL = 'https://metallodvorastana.kz';

export function usePageMeta(title, description, keywords, path) {
  useEffect(() => {
    document.title = title;

    setMeta('name', 'description', description);

    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }

    const canonicalPath = path || window.location.pathname;
    setCanonical(`${BASE_URL}${canonicalPath}`);
  }, [title, description, keywords, path]);
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
