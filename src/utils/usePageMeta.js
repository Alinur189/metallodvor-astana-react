import { useEffect } from 'react';

export function usePageMeta(title, description, keywords) {
  useEffect(() => {
    document.title = title;

    setMeta('name', 'description', description);

    if (keywords) {
      setMeta('name', 'keywords', keywords);
    }
  }, [title, description, keywords]);
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
