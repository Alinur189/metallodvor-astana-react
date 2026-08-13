# МеталлоДвор Астана — React/Vite сайт

Готовый фронтенд-сайт для компании по продаже металлической сетки и металлопроката.

## Как запустить

```bash
npm install
npm run dev
```

После запуска откройте адрес, который покажет Vite, обычно:

```bash
http://localhost:5173
```

## Сборка проекта

```bash
npm run build
npm run preview
```

## Стек

- React
- Vite
- JavaScript
- React Router
- Normal CSS
- Локальные массивы данных для товаров и категорий

## Структура

```text
src/
  components/
  pages/
  data/
  styles/
  utils/
```

## Медиафайлы

### Фотографии

Исходники — `.jpg` в `public/images` (товары) и `public/photos` (галерея завода).
После добавления или замены фото запустите:

```bash
npm run images
```

Скрипт создаст рядом WebP-варианты на 420w и 840w и перезапишет таблицу размеров
`src/data/imageMeta.json`. Компонент `<ProductImage>` берёт из неё `srcset`
и `width`/`height`. Результат коммитится вместе с исходниками — сборка ничего
не конвертирует.

### Видео

`public/videos/factory.mp4` должен быть **H.264 в контейнере mp4**. Видео с
iPhone сохраняется как HEVC в `.mov` — такой файл не играет ни в Chrome, ни
в Firefox. Перекодировать можно встроенным в macOS `avconvert` (ffmpeg не нужен):

```bash
avconvert --source исходник.mov --preset Preset640x480 \
          --output public/videos/factory.mp4 --replace
```

`Preset640x480` даёт 360×640 для вертикального ролика без матрицы поворота —
браузеры показывают его одинаково. Не добавляйте `--multiPass`: на файлах
с дорожкой пространственного звука (APAC) конвертация падает с «Cannot Encode».
