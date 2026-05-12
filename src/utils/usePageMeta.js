import { useEffect } from 'react';

export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title;

    let descriptionTag = document.querySelector('meta[name="description"]');

    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute('content', description);
  }, [title, description]);
}
