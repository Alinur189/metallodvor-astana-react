import { Link } from 'react-router-dom';
import { getCategoryTitle } from '../data/categories.js';
import { products } from '../data/products.js';
import { usePageMeta } from '../utils/usePageMeta.js';

export default function PriceList({ onOrder }) {
  usePageMeta(
    'Прайс-лист — МеталлоДвор Астана',
    'Прайс-лист на металлическую сетку, рабицу, арматуру, проволоку и профильную трубу в Астане.',
  );

  return (
    <section className="container pageContent pageContent--single">
      <div className="pageHero">
        <span className="eyebrow">Прайс-лист</span>
        <h1>Ориентировочные цены на металлопродукцию</h1>
        <p>
          Цены могут меняться в зависимости от партии, наличия и условий доставки. Для точного
          коммерческого предложения отправьте заявку менеджеру.
        </p>
      </div>

      <div className="priceTableWrap">
        <table className="priceTable">
          <thead>
            <tr>
              <th>Товар</th>
              <th>Категория</th>
              <th>Размер</th>
              <th>Цена</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link to={`/product/${product.id}`}>{product.title}</Link>
                </td>
                <td>{getCategoryTitle(product.category)}</td>
                <td>{product.size}</td>
                <td><strong>{product.price}</strong></td>
                <td>
                  <button className="tableButton" type="button" onClick={() => onOrder(product)}>
                    Заказать
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ctaBanner ctaBanner--light">
        <div>
          <h2>Нужен прайс для закупки?</h2>
          <p>Позвоните или отправьте список — подготовим расчет по вашему объему.</p>
        </div>
        <a className="btn btn--primary" href="tel:+77771234567">Позвонить</a>
      </div>
    </section>
  );
}
