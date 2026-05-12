import { Link } from 'react-router-dom';
import { getCategoryTitle } from '../data/categories.js';

export default function ProductCard({ product, onOrder }) {
  return (
    <article className="productCard">
      <Link to={`/product/${product.id}`} className="productCard__imageWrap">
        <img src={product.image} alt={product.title} loading="lazy" />
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
            <dd>{product.price}</dd>
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
