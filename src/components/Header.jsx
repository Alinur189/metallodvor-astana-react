import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const PRICE_LIST_URL = 'https://docs.google.com/spreadsheets/d/1OpseU3JsMv1ZPVDZ7VpHGfWppY7QsykH0dx1ZGgmC8w/edit?gid=0#gid=0';

const navItems = [
  { to: '/catalog', label: 'Каталог товаров' },
  { to: '/about', label: 'О компании' },
  { to: '/factory', label: 'Наш завод' },
  { to: '/delivery', label: 'Услуги' },
  { to: '/delivery', label: 'Доставка' },
  { to: '/contacts', label: 'Контакты' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('q') || '');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const query = searchValue.trim();

    if (query) {
      navigate(`/catalog?q=${encodeURIComponent(query)}`);
    } else {
      navigate('/catalog');
    }
  };

  return (
    <header className="siteHeader">
      <div className="topStrip">
        <div className="container topStrip__inner">
          <span>Сетка сварная для стяжки и кладки  в Астане</span>
          <a href="tel:+77021665051">+7 702 166 5051</a>
        </div>
      </div>

      <div className="container headerMain">
        <Link className="logo" to="/" aria-label="МеталлоДвор Астана — на главную">
          <img src={logo} alt="МеталлоДвор Астана" className="logo__img" />
        </Link>

        <form className="searchBar" onSubmit={handleSubmit} role="search">
          <input
            type="search"
            placeholder="Поиск: сварная сетка, рабица, арматура..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            aria-label="Поиск товаров"
          />
          <button type="submit">Найти</button>
        </form>

        <button className="cartButton" type="button" aria-label="Корзина">
          <span>🛒</span>
          <strong>Корзина пуста</strong>
        </button>

        <button
          className="burger"
          type="button"
          aria-label="Открыть меню"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className={`mainNav ${menuOpen ? 'mainNav--open' : ''}`} aria-label="Главная навигация">
        <div className="container mainNav__inner">
          {navItems.map((item, index) => (
            <NavLink
              key={`${item.to}-${item.label}-${index}`}
              to={item.to}
              className={({ isActive }) => (isActive ? 'navLink navLink--active' : 'navLink')}
            >
              {item.label}
            </NavLink>
          ))}
          <a
            href={PRICE_LIST_URL}
            className="navLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            Прайс-лист
          </a>
        </div>
      </nav>
    </header>
  );
}
