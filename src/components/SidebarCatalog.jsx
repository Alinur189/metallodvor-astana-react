import { NavLink } from 'react-router-dom';
import { categories } from '../data/categories.js';

export default function SidebarCatalog() {
  return (
    <aside className="sidebarCatalog" aria-label="Каталог категорий">
      <div className="sidebarCatalog__head">
        <span>☰</span>
        <strong>Каталог товаров</strong>
      </div>

      <div className="sidebarCatalog__list">
        {categories.map((category) => (
          <NavLink
            key={category.slug}
            to={`/catalog/${category.slug}`}
            className={({ isActive }) =>
              isActive ? 'sidebarCatalog__link sidebarCatalog__link--active' : 'sidebarCatalog__link'
            }
          >
            <span>{category.title}</span>
            <span aria-hidden="true">→</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebarCatalog__manager">
        <span>Нужен расчет?</span>
        <strong>Подберем сетку под ваш объект</strong>
        <a href="tel:+77021665051">Позвонить</a>
      </div>
    </aside>
  );
}
