import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/usePageMeta.js';

export default function NotFound() {
  usePageMeta(
    'Страница не найдена (404) | МеталлоДвор Астана',
    'К сожалению, такой страницы нет. Перейдите в каталог сварной сетки и металлопроката или вернитесь на главную.',
    null,
    null,
    null,
    null,
    true, // noindex — не индексируем несуществующие URL
  );

  return (
    <section className="container pageContent pageContent--single">
      <div className="pageHero pageHero--compact">
        <span className="eyebrow">Ошибка 404</span>
        <h1>Страница не найдена</h1>
        <p>
          Возможно, ссылка устарела или страница была перемещена. Давайте вернёмся
          к тому, что точно работает.
        </p>
      </div>

      <div className="productDetail__actions">
        <Link className="btn btn--primary" to="/catalog">В каталог</Link>
        <Link className="btn btn--ghost" to="/">На главную</Link>
        <a className="btn btn--whatsapp" href="https://wa.me/77015877127" target="_blank" rel="noopener noreferrer">
          Написать в WhatsApp
        </a>
      </div>
    </section>
  );
}
