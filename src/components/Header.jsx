import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const navItems = [
  { to: '/catalog', label: 'Каталог товаров' },
  { to: '/about', label: 'О компании' },
  { to: '/factory', label: 'Наш завод' },
  { to: '/delivery', label: 'Услуги' },
  { to: '/delivery', label: 'Доставка' },
  { to: '/contacts', label: 'Контакты' },
  { to: '/price-list', label: 'Прайс-лист' },
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
          <span>Металлическая сетка и металлопрокат в Астане</span>
          <a href="tel:+77015877127">+7 701 587 7127</a>
        </div>
      </div>

      <div className="container headerMain">
        <Link className="logo" to="/" aria-label="МеталлоДвор Астана — на главную">
          <span className="logo__mark">МД</span>
          <span>
            <strong>МеталлоДвор</strong>
            <small>Астана</small>
          </span>
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
        </div>
      </nav>
    </header>
  );
}
