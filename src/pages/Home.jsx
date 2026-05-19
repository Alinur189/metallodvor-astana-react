import { Link } from 'react-router-dom';
import Benefits from '../components/Benefits.jsx';
import Hero from '../components/Hero.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SidebarCatalog from '../components/SidebarCatalog.jsx';
import { categories } from '../data/categories.js';
import { products } from '../data/products.js';
import { usePageMeta } from '../utils/usePageMeta.js';

export default function Home({ onOrder }) {
  usePageMeta(
    'Купить сварную сетку в Астане — опт и розница | МеталлоДвор',
    'Купить сварную сетку, кладочную сетку, рабицу, арматуру и металлопрокат в Астане. Опт и розница. 120+ позиций в наличии. Быстрая доставка.',
    'сварная сетка Астана, кладочная сетка, рабица купить, арматура Астана, металлопрокат Астана, профильная труба, сетка для стяжки, сетка для кладки',
    '/',
  );

  const popularProducts = products.slice(0, 6);

  return (
    <>
      <section className="container homeIntro">
        <SidebarCatalog />
        <Hero />
      </section>

      <div className="container">
        <Benefits />
      </div>

      <section className="section container">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Популярные позиции</span>
            <h2>Товары со склада в Астане</h2>
          </div>
          <Link className="textLink" to="/catalog">Смотреть весь каталог →</Link>
        </div>

        <div className="productGrid">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} onOrder={onOrder} />
          ))}
        </div>
      </section>

      <section className="section container">
        <div className="sectionHead">
          <div>
            <span className="eyebrow">Категории</span>
            <h2>Подберите металлопродукцию под задачу</h2>
          </div>
        </div>

        <div className="categoryGrid">
          {categories.map((category) => (
            <Link className="categoryCard" key={category.slug} to={`/catalog/${category.slug}`}>
              <span>{category.title}</span>
              <p>{category.description}</p>
              <strong>Перейти →</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="container ctaBanner">
        <div>
          <span className="eyebrow">Для подрядчиков и снабжения</span>
          <h2>Нужен расчет объема или поставка на объект?</h2>
          <p>Отправьте заявку, и менеджер подберет сетку, арматуру и сопутствующий металлопрокат.</p>
        </div>
        <a className="btn btn--light" href="tel:+77015877127">Получить консультацию</a>
      </section>
    </>
  );
}
