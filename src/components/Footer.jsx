import { Link } from 'react-router-dom';
import { categories } from '../data/categories.js';
import logo from '../assets/logo.jpg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Link className="logo logo--footer" to="/">
            <img src={logo} alt="МеталлоДвор Астана" className="logo__img" />
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
            <li><a href="https://docs.google.com/spreadsheets/d/1OpseU3JsMv1ZPVDZ7VpHGfWppY7QsykH0dx1ZGgmC8w/edit?gid=0#gid=0" target="_blank" rel="noopener noreferrer">Прайс-лист</a></li>
            <li><Link to="/contacts">Контакты</Link></li>
          </ul>

        </div>




        <div>
          <h3>Контакты</h3>
          <ul>
            <li><a href="tel:+7 701 587 7127">+7 701 587 7127</a></li>
            <li><a href="mailto:metallodvorastana@gmail.com">metallodvorastana@gmail.com</a></li>
            <li>Астана, Рынок "Эталон ряд 15, место 13"</li>
          </ul>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© 2026 МеталлоДвор Астана</span>
        <span>Астана, Рынок «Эталон», ряд 15, место 13</span>
      </div>
    </footer>
  );
}
