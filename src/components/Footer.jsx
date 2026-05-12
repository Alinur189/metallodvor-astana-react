import { Link } from 'react-router-dom';
import { categories } from '../data/categories.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Link className="logo logo--footer" to="/">
            <span className="logo__mark">МД</span>
            <span>
              <strong>МеталлоДвор</strong>
              <small>Астана</small>
            </span>
          </Link>
          <p>
            Поставляем металлическую сетку, арматуру и металлопрокат для строительных компаний,
            подрядчиков, складов и частных объектов в Астане.
          </p>
        </div>

        <div>
          <h3>Каталог</h3>
          <ul>
            {categories.slice(0, 5).map((category) => (
              <li key={category.slug}>
                <Link to={`/catalog/${category.slug}`}>{category.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Навигация</h3>
          <ul>
            <li><Link to="/about">О компании</Link></li>
            <li><Link to="/delivery">Доставка</Link></li>
            <li><Link to="/price-list">Прайс-лист</Link></li>
            <li><Link to="/contacts">Контакты</Link></li>
          </ul>
        </div>

        <div>
          <h3>Контакты</h3>
          <ul>
            <li><a href="tel:+7 701 587 7127">+7 701 587 7127</a></li>
            <li><a href="mailto:sales@metallodvor.kz">sales@metallodvor.kz</a></li>
            <li>Астана, складская зона, ул. Индустриальная 25</li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© 2026 МеталлоДвор Астана</span>
        <span>Сайт-каталог без backend и базы данных</span>
      </div>
    </footer>
  );
}
