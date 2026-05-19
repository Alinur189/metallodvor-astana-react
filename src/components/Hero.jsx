import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__content">
        <span className="eyebrow">Склад в Астане • опт и розница</span>
        <h1 id="hero-title">Сетка сварная для стяжки и кладки  для строительства</h1>
        <p>
          Сварная, кладочная, арматурная сетка, рабица, проволока, арматура и профильная
          труба. Комплектуем заказы для подрядчиков, складов и частных строителей.
        </p>

        <div className="hero__actions">
          <Link className="btn btn--primary" to="/catalog">Перейти в каталог</Link>
          <a className="btn btn--light" href="tel:+77021665051">Получить консультацию</a>
          <a
            className="btn btn--light"
            href="https://docs.google.com/spreadsheets/d/1OpseU3JsMv1ZPVDZ7VpHGfWppY7QsykH0dx1ZGgmC8w/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
          >
            Прайс-лист
          </a>
        </div>
      </div>

      <div className="hero__card" aria-label="Информация о наличии">
        <span>В наличии</span>
        <strong>120+ позиций</strong>
        <small>Быстрая погрузка и доставка по городу</small>
      </div>
    </section>
  );
}
