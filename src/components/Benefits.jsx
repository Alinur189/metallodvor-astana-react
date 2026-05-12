const benefits = [
  {
    title: 'Доставка по Астане',
    text: 'Привезем заказ на объект, склад или частный адрес.',
    icon: '🚚',
  },
  {
    title: 'Сертифицированный товар',
    text: 'Работаем с проверенными поставщиками и понятными характеристиками.',
    icon: '✅',
  },
  {
    title: 'Быстрая погрузка',
    text: 'Помогаем оперативно собрать и отгрузить заказ со склада.',
    icon: '⚙️',
  },
  {
    title: 'Оптовые цены',
    text: 'Специальные условия для подрядчиков и регулярных закупок.',
    icon: '₸',
  },
];

export default function Benefits() {
  return (
    <section className="benefits" aria-label="Преимущества">
      {benefits.map((benefit) => (
        <article className="benefitCard" key={benefit.title}>
          <span className="benefitCard__icon">{benefit.icon}</span>
          <div>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
