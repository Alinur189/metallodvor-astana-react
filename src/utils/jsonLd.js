import { getCategoryTitle } from '../data/categories.js';

export const BASE_URL = 'https://metallodvorastana.kz';

// items: [{ name, path }] — путь от главной до текущей страницы включительно.
export function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

export function buildProductJsonLd(product) {
  // Цена в данных хранится как «от 14 500 ₸» — берём числовую часть
  // как стартовую цену предложения.
  const priceDigits = String(product.price || '').replace(/\D/g, '');

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.fullDescription,
    image: `${BASE_URL}${product.image}`,
    category: getCategoryTitle(product.category),
    brand: { '@type': 'Brand', name: 'МеталлоДвор' },
    ...(priceDigits && {
      offers: {
        '@type': 'Offer',
        priceCurrency: 'KZT',
        price: priceDigits,
        availability: 'https://schema.org/InStock',
        url: `${BASE_URL}/product/${product.id}`,
        seller: { '@type': 'Organization', name: 'МеталлоДвор Астана' },
      },
    }),
  };
}
