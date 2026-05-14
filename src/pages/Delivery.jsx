import { Link } from 'react-router-dom';
import { usePageMeta } from '../utils/usePageMeta.js';

const serviceCards = [
  {
    title: 'Доставка по Астане',
    text: 'Организуем доставку на строительный объект, склад, производство или частный адрес.',
  },
  {
    title: 'Комплектация заказа',
    text: 'Подбираем сетку, арматуру, проволоку и профильную трубу под один список закупки.',
  },
  {
    title: 'Погрузка со склада',
    text: 'Помогаем быстро подготовить товар к самовывозу или отправке транспортом.',
  },
  {
    title: 'Расчет под проект',
    text: 'Менеджер уточнит размеры, объем, назначение и предложит подходящую позицию.',
  },
];

export default function Delivery() {
  usePageMeta(
    'Доставка и услуги — МеталлоДвор Астана',
    'Доставка металлической сетки, арматуры и металлопроката по Астане. Комплектация заказов и расчет под объект.',
    'доставка металла Астана, доставка сетки, металлопрокат с доставкой, заказ сетки Астана',
  );

  return (
    <section className="container pageContent pageContent--single">
      <div className="pageHero">
        <span className="eyebrow">Доставка и услуги</span>
        <h1>Быстро доставим металлопродукцию по Астане</h1>
        <p>
          Стоимость доставки зависит от объема, адреса и типа транспорта. Для крупных заказов
          подбираем удобное время отгрузки и доставки на объект.
        </p>
      </div>

      <div className="serviceGrid">
        {serviceCards.map((card) => (
          <article className="infoCard" key={card.title}>
            <h2>{card.title}</h2>
            <p>{card.text}</p>
          </article>
        ))}
      </div>

      <section className="timeline">
        <h2>Как проходит заказ</h2>
        <ol>
          <li><strong>Заявка</strong><span>Вы отправляете список или выбираете товар в каталоге.</span></li>
          <li><strong>Расчет</strong><span>Менеджер уточняет наличие, объем и стоимость доставки.</span></li>
          <li><strong>Оплата</strong><span>Согласуем способ оплаты и подготавливаем документы.</span></li>
          <li><strong>Отгрузка</strong><span>Комплектуем заказ и доставляем по указанному адресу.</span></li>
        </ol>
      </section>

      <div className="ctaBanner">
        <div>
          <h2>Нужно доставить сегодня?</h2>
          <p>Позвоните менеджеру, чтобы уточнить наличие транспорта и ближайшее время отгрузки.</p>
        </div>
        <Link className="btn btn--light" to="/contacts">Связаться</Link>
      </div>
    </section>
  );
}
