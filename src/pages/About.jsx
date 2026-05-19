import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/usePageMeta.js';

export default function About() {
  usePageMeta(
    'О компании — поставщик сварной сетки и металла в Астане | МеталлоДвор',
    'МеталлоДвор Астана поставляет металлическую сетку, арматуру и металлопрокат для строительных объектов и частных заказчиков.',
    null,
    '/about',
  );

  return (
    <section className="container pageContent pageContent--single">
      <div className="pageHero">
        <span className="eyebrow">О компании</span>
        <h1>МеталлоДвор Астана — надежный поставщик металлоизделий</h1>
        <p>
          Мы помогаем строительным компаниям, подрядчикам, складам и частным строителям быстро
          закрывать потребность в металлической сетке, арматуре и профильной трубе.
        </p>
      </div>

      <div className="aboutGrid">
        <article className="infoCard">
          <h2>Что мы продаем</h2>
          <p>
            В каталоге представлены сварная, кладочная, арматурная сетка, рабица, ПВЛ,
            проволока, арматура и профильная труба. Подбираем позиции под задачи объекта.
          </p>
        </article>

        <article className="infoCard">
          <h2>Для кого работаем</h2>
          <p>
            Основные клиенты — строительные компании, снабженцы, монтажные бригады, склады,
            подрядчики и частные заказчики, которым нужен понятный сервис и быстрая отгрузка.
          </p>
        </article>

        <article className="infoCard">
          <h2>Наш подход</h2>
          <p>
            Мы делаем акцент на наличии, понятной консультации, аккуратной комплектации заказа
            и своевременной доставке по Астане.
          </p>
        </article>
      </div>

      <div className="stats">
        <div><strong>120+</strong><span>позиций в каталоге</span></div>
        <div><strong>24 ч</strong><span>быстрая обработка заявок</span></div>
        <div><strong>Опт</strong><span>условия для постоянных клиентов</span></div>
      </div>

      <div className="ctaBanner ctaBanner--light">
        <div>
          <h2>Хотите получить коммерческое предложение?</h2>
          <p>Перейдите в каталог или свяжитесь с менеджером для расчета по вашему списку.</p>
        </div>
        <Link className="btn btn--primary" to="/catalog">Открыть каталог</Link>
      </div>
    </section>
  );
}
