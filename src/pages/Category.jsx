import { Navigate, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import SidebarCatalog from '../components/SidebarCatalog.jsx';
import { getCategoryBySlug } from '../data/categories.js';
import { getProductsByCategory } from '../data/products.js';
import { usePageMeta } from '../utils/usePageMeta.js';

export default function Category({ onOrder }) {
  const { category: categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return <Navigate to="/catalog" replace />;
  }

  const categoryProducts = getProductsByCategory(category.slug);

  usePageMeta(
    `${category.title} — купить в Астане | МеталлоДвор`,
    `${category.description} Цены и наличие в МеталлоДвор Астана.`,
  );

  return (
    <section className="container pageLayout">
      <SidebarCatalog />

      <div className="pageContent">
        <div className="pageHero pageHero--compact">
          <span className="eyebrow">Категория</span>
          <h1>{category.title}</h1>
          <p>{category.description}</p>
        </div>

        <div className="sectionHead sectionHead--tight">
          <div>
            <h2>Товары в категории</h2>
            <p>{categoryProducts.length} позиций в каталоге</p>
          </div>
          <Link className="textLink" to="/catalog">Все категории →</Link>
        </div>

        <div className="productGrid">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOrder={onOrder} />
          ))}
        </div>
      </div>
    </section>
  );
}
