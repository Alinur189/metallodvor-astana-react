import imageMeta from '../data/imageMeta.json';

// Фотография товара с WebP-вариантами из scripts/optimize-images.mjs.
// Исходный .jpg остаётся в <img> как запасной вариант: <picture> скачивает
// ровно один файл, поэтому тяжёлый jpg достаётся только браузерам без WebP.
//
// sizes обязателен — без него браузер считает, что картинка шириной во весь
// экран, и на телефоне тянет вариант 840w вместо 420w.
//
// priority — картинка выше сгиба (LCP). Такой нельзя ставить loading="lazy":
// браузер отложит запрос до раскладки страницы. Остальные грузим лениво.
// fetchpriority пишем строчными: React 18.2 не знает camelCase-вариант
// и ругается в консоль (нативная поддержка с 18.3). Передаём его спредом —
// так же, как это делал ProductCard до появления этого компонента.
export default function ProductImage({ src, alt, sizes, className, priority = false }) {
  const meta = imageMeta[src];
  const loadingProps = priority ? { fetchpriority: 'high' } : { loading: 'lazy' };

  // SVG и фотографии без сгенерированных вариантов отдаём как есть.
  if (!meta) {
    return <img src={src} alt={alt} className={className} {...loadingProps} />;
  }

  return (
    <picture>
      <source
        type="image/webp"
        sizes={sizes}
        srcSet={meta.variants.map((variant) => `${variant.src} ${variant.width}w`).join(', ')}
      />
      <img
        src={src}
        alt={alt}
        className={className}
        width={meta.width}
        height={meta.height}
        {...loadingProps}
      />
    </picture>
  );
}
