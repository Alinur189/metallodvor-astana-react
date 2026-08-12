// Генерация облегчённых вариантов фотографий товаров.
//
// Исходники в public/images/*.jpg весят по 100–220 КБ и отдаются как есть —
// на мобильных это основной вес страницы, а мобильные дают ~90 % заявок.
// Скрипт делает для каждой фотографии WebP в двух ширинах и записывает
// таблицу размеров в src/data/imageMeta.json, чтобы <ProductImage> мог
// проставить srcset и width/height (последнее убирает сдвиг вёрстки).
//
// Запускать вручную после добавления или замены фотографий:
//   npm run images
// Результат коммитится вместе с исходниками — сборка ничего не конвертирует.
import { readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(root, 'public/images');
const metaFile = path.join(root, 'src/data/imageMeta.json');

// 420 — карточка товара на телефоне, 840 — сетка на десктопе и retina.
const WIDTHS = [420, 840];
const WEBP_QUALITY = 78;

const files = (await readdir(imagesDir))
  .filter((name) => name.endsWith('.jpg'))
  .sort();

const meta = {};
let sourceBytes = 0;
let webpBytes = 0;

for (const name of files) {
  const source = path.join(imagesDir, name);
  const base = name.replace(/\.jpg$/, '');
  // metadata() не заполняет size при чтении с диска — берём его из stat.
  const { width, height } = await sharp(source).metadata();
  const { size } = await stat(source);
  sourceBytes += size;

  // Не апскейлим: если исходник уже, отдаём его настоящую ширину.
  const widths = [...new Set(WIDTHS.map((w) => Math.min(w, width)))].sort((a, b) => a - b);
  const variants = [];

  for (const targetWidth of widths) {
    const outName = `${base}-${targetWidth}.webp`;
    const info = await sharp(source)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(path.join(imagesDir, outName));

    webpBytes += info.size;
    variants.push({ width: targetWidth, src: `/images/${outName}` });
  }

  meta[`/images/${name}`] = { width, height, variants };

  console.log(
    `${name} ${width}×${height} ${(size / 1024).toFixed(0)} КБ → ` +
    variants.map((v) => `${v.width}w`).join(', '),
  );
}

await writeFile(metaFile, `${JSON.stringify(meta, null, 2)}\n`);

console.log(
  `\nГотово: ${files.length} фото, исходники ${(sourceBytes / 1024 / 1024).toFixed(2)} МБ ` +
  `→ webp ${(webpBytes / 1024 / 1024).toFixed(2)} МБ ` +
  `(−${(100 - (webpBytes / sourceBytes) * 100).toFixed(0)} %). ` +
  `Таблица размеров: ${path.relative(root, metaFile)}`,
);
