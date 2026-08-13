// Генерация облегчённых вариантов фотографий.
//
// Исходные .jpg отдаются как есть и на мобильных составляют основной вес
// страницы, а мобильные дают ~90 % заявок. Скрипт делает для каждой
// фотографии WebP в нескольких ширинах и записывает таблицу размеров
// в src/data/imageMeta.json, чтобы <ProductImage> мог проставить srcset
// и width/height (последнее убирает сдвиг вёрстки).
//
// Обрабатываются две папки:
//   public/images — фото товаров (карточки каталога, страница товара)
//   public/photos — галерея на странице «Наш завод»
// hero.jpg тоже попадает в таблицу: сейчас он используется только как
// og:image (соцсети берут оригинальный .jpg), но если его когда-нибудь
// выведут на странице — варианты уже готовы.
//
// Запускать вручную после добавления или замены фотографий:
//   npm run images
// Результат коммитится вместе с исходниками — сборка ничего не конвертирует.
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const metaFile = path.join(root, 'src/data/imageMeta.json');

// Обе галереи выводят картинки шириной максимум ~390 CSS-пикселей, поэтому
// потолок — 840w (retina на десктопе), больше делать незачем.
// 630 — не «лишняя» ширина, а основная для телефонов: в галерее завода ячейка
// на телефоне ~171 CSS-пикселя, и при dpr 3 браузеру нужно ~513 px. Без 630
// он берёт 840w (156 КБ) вместо ~90 КБ. Мобильные дают ~90 % заявок.
const WIDTHS = [420, 630, 840];
const WEBP_QUALITY = 78;

const GROUPS = [
  { dir: 'public/images', urlBase: '/images' },
  { dir: 'public/photos', urlBase: '/photos' },
];

const meta = {};
const bytesByWidth = new Map();
let sourceBytes = 0;
let count = 0;

for (const group of GROUPS) {
  const dir = path.join(root, group.dir);
  const files = (await readdir(dir)).filter((name) => name.endsWith('.jpg')).sort();

  console.log(`\n${group.dir} — ${files.length} фото`);

  for (const name of files) {
    const source = path.join(dir, name);
    const base = name.replace(/\.jpg$/, '');
    // metadata() не заполняет size при чтении с диска — берём его из stat.
    const { width, height } = await sharp(source).metadata();
    const { size } = await stat(source);
    sourceBytes += size;
    count += 1;

    // Не апскейлим: если исходник уже, отдаём его настоящую ширину.
    const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))].sort((a, b) => a - b);
    const variants = [];

    for (const targetWidth of widths) {
      const outName = `${base}-${targetWidth}.webp`;
      const info = await sharp(source)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(path.join(dir, outName));

      const acc = bytesByWidth.get(targetWidth) || { bytes: 0, files: 0 };
      bytesByWidth.set(targetWidth, { bytes: acc.bytes + info.size, files: acc.files + 1 });
      variants.push({ width: targetWidth, src: `${group.urlBase}/${outName}` });
    }

    meta[`${group.urlBase}/${name}`] = { width, height, variants };

    console.log(
      `  ${name} ${width}×${height} ${(size / 1024).toFixed(0)} КБ → ` +
      variants.map((v) => `${v.width}w`).join(', '),
    );
  }
}

await writeFile(metaFile, `${JSON.stringify(meta, null, 2)}\n`);

// Считаем в пересчёте на одну картинку: браузер скачивает ровно один вариант,
// поэтому суммировать все ширины бессмысленно — так экономия выглядит меньше,
// чем она есть.
const avgSource = sourceBytes / count;
console.log(`\nГотово: ${count} фото. Средний вес одной картинки:`);
console.log(`  исходный .jpg  ${(avgSource / 1024).toFixed(0)} КБ`);
for (const width of [...bytesByWidth.keys()].sort((a, b) => a - b)) {
  // Узкие исходники не получают широких вариантов, поэтому усредняем
  // по числу реально созданных файлов этой ширины, а не по всем фото.
  const { bytes, files } = bytesByWidth.get(width);
  const avg = bytes / files;
  console.log(
    `  ${String(width).padStart(3)}w webp     ${(avg / 1024).toFixed(0).padStart(3)} КБ` +
    `  (−${(100 - (avg / avgSource) * 100).toFixed(0)} %, ${files} шт.)`,
  );
}
console.log(`Таблица размеров: ${path.relative(root, metaFile)}`);
