import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import SidebarCatalog from '../components/SidebarCatalog.jsx';
import { categories } from '../data/categories.js';
import { products } from '../data/products.js';
import { searchProducts } from '../utils/fuzzySearch.js';
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

  const normalizedQuery = query.trim();

  const searchedProducts = normalizedQuery ? searchProducts(normalizedQuery) : products;
  const filteredProducts = searchedProducts.filter(
    (product) => !activeCategory || product.category === activeCategory,
  );

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
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onOrder={onOrder}
                priority={index === 0}
              />
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
