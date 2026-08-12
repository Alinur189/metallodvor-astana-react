import { Navigate, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import SidebarCatalog from '../components/SidebarCatalog.jsx';
import { getCategoryBySlug } from '../data/categories.js';
import { getProductsByCategory } from '../data/products.js';
import { usePageMeta } from '../utils/usePageMeta.js';
import { buildBreadcrumbJsonLd } from '../utils/jsonLd.js';

export default function Category({ onOrder }) {
  const { category: categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);

  if (!category) {
    return <Navigate to="/catalog" replace />;
  }

  return <CategoryView category={category} onOrder={onOrder} />;
}

function CategoryView({ category, onOrder }) {
  const categoryProducts = getProductsByCategory(category.slug);

  usePageMeta(
    `${category.title} — купить в Астане | МеталлоДвор`,
    `${category.description} Цены и наличие в МеталлоДвор Астана.`,
    undefined,
    `/catalog/${category.slug}`,
    buildBreadcrumbJsonLd([
      { name: 'Главная', path: '/' },
      { name: 'Каталог', path: '/catalog' },
      { name: category.title, path: `/catalog/${category.slug}` },
    ]),
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
          {categoryProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrder={onOrder}
              priority={index === 0}
            />
          ))}
        </div>

        {/* Контактный блок. Почти все заявки приходят кликом по tel: / wa.me,
            а не через форму, поэтому на странице, куда ведёт реклама, эти две
            ссылки должны быть прямо под товарами. */}
        <div className="ctaBanner ctaBanner--light">
          <div>
            <span className="eyebrow">Расчет за 5 минут</span>
            <h2>Уточнить цену: {category.title}</h2>
            <p>
              Назовите размер и объем — посчитаем стоимость с доставкой по Астане и скажем,
              что есть на складе сейчас.
            </p>
          </div>
          <div className="ctaBanner__actions">
            <a
              className="btn btn--whatsapp"
              href={`https://wa.me/77015877127?text=${encodeURIComponent(
                `Здравствуйте! Интересует ${category.title}. Подскажите цену и наличие.`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Узнать цену в WhatsApp
            </a>
            <a className="btn btn--primary" href="tel:+77015877127">Позвонить</a>
          </div>
        </div>
      </div>
    </section>
  );
}
