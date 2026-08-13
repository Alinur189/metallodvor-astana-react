import { Link } from 'react-router-dom';
import ProductImage from '../components/ProductImage.jsx';
import { usePageMeta } from '../utils/usePageMeta.js';

// Галерея: 3 колонки на десктопе, 2 на планшете и телефоне.
// Контейнер съедает 32px отступов, между колонками — 16px.
const PHOTO_SIZES =
  '(max-width: 900px) calc((100vw - 48px) / 2), (max-width: 1232px) calc((100vw - 64px) / 3), 389px';

const capabilities = [
  { title: 'Сварная сетка', desc: 'Производим сварную сетку любых типоразмеров — для ограждений, армирования и технических нужд.' },
  { title: 'Кладочная сетка', desc: 'Кладочная сетка для армирования кирпичной и блочной кладки — в наличии и под заказ.' },
  { title: 'Арматурная сетка', desc: 'Сетка для армирования фундаментов, плит перекрытий и стяжки пола.' },
  { title: 'Сетка рабица', desc: 'Плетёная сетка-рабица оцинкованная и покрытая ПВХ — для заборов и ограждений.' },
  { title: 'Профильная труба', desc: 'Профильная труба прямоугольного и квадратного сечения — для металлоконструкций.' },
  { title: 'Металлопрокат', desc: 'Широкий ассортимент металлопроката: арматура, уголок, швеллер, полоса.' },
];

const benefits = [
  { icon: '✔', title: 'Контроль качества', desc: 'Каждая партия проверяется на соответствие стандартам перед отгрузкой.' },
  { icon: '⚡', title: 'Быстрая отгрузка', desc: 'Отгружаем в течение 1–2 рабочих дней с момента подтверждения заказа.' },
  { icon: '📦', title: 'Работа с оптом', desc: 'Специальные условия для строительных компаний и постоянных клиентов.' },
  { icon: '🚚', title: 'Доставка по Астане', desc: 'Собственный транспорт — доставляем прямо на объект по всей Астане.' },
];

export default function Factory() {
  usePageMeta(
    'Производство сварной сетки в Астане — наш завод | МеталлоДвор',
    'Собственное производство металлической сетки и металлопроката в Астане. Сварная, кладочная, арматурная сетка, рабица, профильная труба.',
    'производство сетки Астана, завод металлопрокат, сварная сетка производитель, металлоконструкции Астана',
    '/factory',
  );

  return (
    <section className="container pageContent pageContent--single">
      <div className="pageHero">
        <span className="eyebrow">Производство</span>
        <h1>Наш завод</h1>
        <p>Собственное производство и склад металлопроката в Астане</p>
      </div>

      <div className="infoCard" style={{ marginBottom: '2.5rem' }}>
        <p style={{ fontSize: '1.05rem', lineHeight: '1.75', margin: 0 }}>
          МеталлоДвор Астана — это собственное производство металлической сетки и склад металлопроката.
          Мы выпускаем сварную, кладочную и арматурную сетку, сетку-рабицу, а также поставляем
          проволоку, профильную трубу и металлопрокат. Полный цикл от производства до доставки
          позволяет нам держать конкурентные цены и обеспечивать постоянное наличие на складе.
        </p>
      </div>

      {/* ── Фото производства ── */}
      <h2 className="factorySection__title">Фото производства</h2>
      <div className="factoryPhotos">
        {[
          { file: 'IMG_1686.jpg', alt: 'Производство металлосетки' },
          { file: 'IMG_1687.jpg', alt: 'Склад металлопроката' },
          { file: 'IMG_1691.jpg', alt: 'Сварная сетка' },
          { file: 'IMG_1692.jpg', alt: 'Продукция завода' },
          { file: 'IMG_1693.jpg', alt: 'Металлоизделия' },
          { file: 'IMG_1696.jpg', alt: 'Кладочная сетка' },
          { file: 'IMG_1701.jpg', alt: 'Арматурная сетка' },
          { file: 'IMG_1702.jpg', alt: 'Сетка рабица' },
          { file: 'IMG_1705.jpg', alt: 'Металлопрокат Астана' },
        ].map((photo) => (
          <div className="factoryPhoto" key={photo.file}>
            <ProductImage src={`/photos/${photo.file}`} alt={photo.alt} sizes={PHOTO_SIZES} />
          </div>
        ))}
      </div>

      {/* ── Видео о заводе ── */}
      <h2 className="factorySection__title">Видео о заводе</h2>
      <div className="factoryVideo">
        <video
          controls
          playsInline
          preload="metadata"
          poster="/photos/IMG_1701-420.webp"
        >
          {/* Только H.264 в mp4 — он играет во всех браузерах. Исходник с телефона
              был HEVC в контейнере .mov: такой файл не воспроизводят ни Chrome,
              ни Firefox, поэтому видео на странице было мёртвым. Перекодировка —
              см. «Видео» в README (7.4 МБ → 2.0 МБ). */}
          <source src="/videos/factory.mp4" type="video/mp4" />
          <p className="factoryVideo__fallback">
            Видео не воспроизводится в вашем браузере.{' '}
            <a href="/videos/factory.mp4" download>
              Скачать видео
            </a>
          </p>
        </video>
      </div>

      <h2 className="factorySection__title">Производственные возможности</h2>
      <div className="aboutGrid factoryGrid">
        {capabilities.map((item) => (
          <article className="infoCard factoryCard" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </article>
        ))}
      </div>

      <h2 className="factorySection__title">Почему выбирают нас</h2>
      <div className="factoryBenefits">
        {benefits.map((item) => (
          <div className="factoryBenefit" key={item.title}>
            <span className="factoryBenefit__icon">{item.icon}</span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ctaBanner ctaBanner--light">
        <div>
          <h2>Нужна сетка под ваш объект?</h2>
          <p>Наши менеджеры подберут нужные позиции и рассчитают стоимость под ваш объём.</p>
        </div>
        <div className="factoryCta__buttons">
          <a className="btn btn--primary" href="https://wa.me/77015877127" target="_blank" rel="noreferrer">
            Получить консультацию
          </a>
          <Link className="btn btn--ghost" to="/catalog">
            Перейти в каталог
          </Link>
        </div>
      </div>
    </section>
  );
}