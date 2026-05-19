import { Link, Navigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { getCategoryTitle } from '../data/categories.js';
import { getProductById, products } from '../data/products.js';
import { usePageMeta } from '../utils/usePageMeta.js';

export default function ProductDetail({ onOrder }) {
  const { id } = useParams();
  const product = getProductById(id);

  if (!product) {
    return <Navigate to="/catalog" replace />;
  }

  const similarProducts = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 3);

  usePageMeta(
    `${product.title} — МеталлоДвор Астана`,
    `${product.shortDescription} ${product.size}. Цены в прайс-листе.`,
  );

  return (
    <section className="container productDetail">
      <nav className="breadcrumbs" aria-label="Хлебные крошки">
        <Link to="/">Главная</Link>
        <span>/</span>
        <Link to="/catalog">Каталог</Link>
        <span>/</span>
        <Link to={`/catalog/${product.category}`}>{getCategoryTitle(product.category)}</Link>
      </nav>

      <div className="productDetail__grid">
        <div className="productDetail__image">
          <img src={product.image} alt={product.title} />
        </div>

        <article className="productDetail__info">
          <span className="eyebrow">{getCategoryTitle(product.category)}</span>
          <h1>{product.title}</h1>
          <p>{product.fullDescription}</p>

          <dl className="specTable">
            <div>
              <dt>Размер / характеристика</dt>
              <dd>{product.size}</dd>
            </div>
            <div>
              <dt>Цена</dt>
              <dd>
                <a
                  href="https://docs.google.com/spreadsheets/d/1OpseU3JsMv1ZPVDZ7VpHGfWppY7QsykH0dx1ZGgmC8w/edit?gid=0#gid=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="priceLink"
                >
                  см. прайс-лист
                </a>
              </dd>
            </div>
            <div>
              <dt>Город</dt>
              <dd>Астана</dd>
            </div>
            <div>
              <dt>Доступность</dt>
              <dd>В наличии и под заказ</dd>
            </div>
          </dl>

          <div className="productDetail__actions">
            <button className="btn btn--primary" type="button" onClick={() => onOrder(product)}>
              Заказать
            </button>
            <a className="btn btn--ghost" href="tel:+77021665051">Позвонить</a>
            <a
              className="btn btn--whatsapp"
              href={`https://wa.me/77021665051?text=${encodeURIComponent(`Здравствуйте! Интересует "${product.title}" (${product.size}). Уточните, пожалуйста, цену и наличие.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Узнать цену в WhatsApp
            </a>
          </div>
        </article>
      </div>

      {similarProducts.length > 0 && (
        <section className="section">
          <div className="sectionHead">
            <div>
              <span className="eyebrow">Похожие товары</span>
              <h2>Еще из этой категории</h2>
            </div>
          </div>

          <div className="productGrid productGrid--three">
            {similarProducts.map((item) => (
              <ProductCard key={item.id} product={item} onOrder={onOrder} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
