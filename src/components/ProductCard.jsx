import { Link } from 'react-router-dom';
import ProductImage from './ProductImage.jsx';
import { getCategoryTitle } from '../data/categories.js';

// Сетка карточек: 3 колонки, с 1100px — 2, с 520px — одна.
// Контейнер съедает 32px отступов, поэтому одна колонка — не ровно 100vw.
const CARD_SIZES = '(max-width: 520px) calc(100vw - 32px), (max-width: 1100px) 50vw, 360px';

// priority — карточка стоит в первом видимом ряду (выше сгиба), подробности
// про загрузку и fetchpriority — в ProductImage.jsx.
export default function ProductCard({ product, onOrder, priority = false }) {
  const isPhoto = !product.image.endsWith('.svg');

  return (
    <article className="productCard">
      <Link
        to={`/product/${product.id}`}
        className={`productCard__imageWrap ${isPhoto ? 'productCard__imageWrap--photo' : ''}`}
      >
        <ProductImage
          src={product.image}
          alt={product.title}
          sizes={CARD_SIZES}
          priority={priority}
        />
      </Link>

      <div className="productCard__body">
        <span className="productCard__category">{getCategoryTitle(product.category)}</span>
        <h3>
          <Link to={`/product/${product.id}`}>{product.title}</Link>
        </h3>
        <p>{product.shortDescription}</p>

        <dl className="productCard__specs">
          <div>
            <dt>Размер</dt>
            <dd>{product.size}</dd>
          </div>
          <div>
            <dt>Цена</dt>
            <dd className="priceValue">{product.price}</dd>
          </div>
        </dl>

        <div className="productCard__actions">
          <button className="btn btn--primary btn--small" type="button" onClick={() => onOrder(product)}>
            Заказать
          </button>
          <Link className="btn btn--ghost btn--small" to={`/product/${product.id}`}>
            Подробнее
          </Link>
        </div>
      </div>
    </article>
  );
}
