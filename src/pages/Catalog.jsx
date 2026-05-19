import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import SidebarCatalog from '../components/SidebarCatalog.jsx';
import { categories, getCategoryTitle } from '../data/categories.js';
import { products } from '../data/products.js';
import { usePageMeta } from '../utils/usePageMeta.js';

export default function Catalog({ onOrder }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const activeCategory = searchParams.get('category') || '';

  usePageMeta(
    'Каталог сварной сетки и металлопроката в Астане | МеталлоДвор',
    'Каталог металлической сетки, рабицы, арматурной сетки, проволоки, арматуры и профильной трубы в Астане.',
    'каталог сетки Астана, купить рабицу, арматурная сетка цена, проволока вязальная, профильная труба Астана, металл опт',
    '/catalog',
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const categoryTitle = getCategoryTitle(product.category).toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      product.title.toLowerCase().includes(normalizedQuery) ||
      product.shortDescription.toLowerCase().includes(normalizedQuery) ||
      categoryTitle.includes(normalizedQuery);

    const matchesCategory = !activeCategory || product.category === activeCategory;

    return matchesQuery && matchesCategory;
  });

  const updateCategory = (slug) => {
    const nextParams = new URLSearchParams(searchParams);
    if (slug) {
      nextParams.set('category', slug);
    } else {
      nextParams.delete('category');
    }
    setSearchParams(nextParams);
  };

  return (
    <section className="container pageLayout">
      <SidebarCatalog />

      <div className="pageContent">
        <div className="pageHero pageHero--compact">
          <span className="eyebrow">Каталог</span>
          <h1>Сетка сварная для стяжки и кладки </h1>
          <p>
            Используйте поиск или фильтр по категориям. Цены указаны ориентировочно — точную стоимость
            и наличие уточняйте у менеджера.
          </p>
        </div>

        <div className="filterBar" aria-label="Фильтр категорий">
          <button
            className={!activeCategory ? 'filterChip filterChip--active' : 'filterChip'}
            type="button"
            onClick={() => updateCategory('')}
          >
            Все товары
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              className={activeCategory === category.slug ? 'filterChip filterChip--active' : 'filterChip'}
              type="button"
              onClick={() => updateCategory(category.slug)}
            >
              {category.title}
            </button>
          ))}
        </div>

        {query && (
          <p className="resultLine">
            Поиск по запросу: <strong>{query}</strong>. Найдено: {filteredProducts.length}
          </p>
        )}

        {filteredProducts.length > 0 ? (
          <div className="productGrid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onOrder={onOrder} />
            ))}
          </div>
        ) : (
          <div className="emptyState">
            <h2>Товары не найдены</h2>
            <p>Попробуйте изменить запрос или перейти в общий каталог.</p>
            <Link className="btn btn--primary" to="/catalog">Сбросить фильтр</Link>
          </div>
        )}
      </div>
    </section>
  );
}
