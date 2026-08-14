import { Link } from 'react-router-dom';
import { getCategoryTitle } from '../data/categories.js';
import { products } from '../data/products.js';
import { usePageMeta } from '../utils/usePageMeta.js';

// Развёрнутый прайс в Google-таблице. Раньше на неё вели все три кнопки
// «Прайс-лист» (шапка, футер, главный экран) — человек уходил с сайта, где
// не работают ни кнопки заявки, ни аналитика. Теперь кнопки ведут сюда,
// а таблица осталась ссылкой со страницы, для тех кому нужен полный список.
const FULL_PRICE_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1OpseU3JsMv1ZPVDZ7VpHGfWppY7QsykH0dx1ZGgmC8w/preview';

export default function PriceList({ onOrder }) {
  usePageMeta(
    'Прайс-лист на сварную сетку и металлопрокат в Астане | МеталлоДвор',
    'Прайс-лист на металлическую сетку, рабицу, арматуру, проволоку и профильную трубу в Астане.',
    null,
    '/price-list',
  );

  return (
    <section className="container pageContent pageContent--single">
      <div className="pageHero">
        <span className="eyebrow">Прайс-лист</span>
        <h1>Ориентировочные цены на металлопродукцию</h1>
        <p>
          Цены указаны как «от» и могут меняться в зависимости от объёма, наличия и условий
          доставки. Для точной цены напишите в{' '}
          <a href="https://wa.me/77015877127" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>{' '}
          или позвоните: <a href="tel:+77015877127">+7 701 587 7127</a>.
        </p>
        <p>
          Нужен развёрнутый список позиций?{' '}
          <a href={FULL_PRICE_SHEET_URL} target="_blank" rel="noopener noreferrer">
            Полный прайс-лист в таблице →
          </a>
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
                <td className="priceValue">{product.price}</td>
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
        <a className="btn btn--primary" href="tel:+77015877127">Позвонить</a>
      </div>
    </section>
  );
}

