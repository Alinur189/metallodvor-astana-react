import { useState } from 'react';
import { usePageMeta } from '../utils/usePageMeta.js';

const initialForm = {
  name: '',
  phone: '',
  message: '',
};

export default function Contacts() {
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);

  usePageMeta(
    'Контакты — купить сварную сетку в Астане | МеталлоДвор',
    'Контакты МеталлоДвор Астана: телефон, WhatsApp, адрес склада и форма обратной связи.',
    'МеталлоДвор Астана контакты, телефон склада металла Астана, адрес рынок Эталон Астана',
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
    setForm(initialForm);
  };

  return (
    <section className="container pageContent pageContent--single">
      <div className="pageHero">
        <span className="eyebrow">Контакты</span>
        <h1>Свяжитесь с МеталлоДвор Астана</h1>
        <p>Уточните наличие, цену, доставку или отправьте список закупки для расчета.</p>
      </div>




      <div className="contactsGrid">
        <div className="contactCards">
          <article className="contactCard">
            <span>Телефон</span>
            <a href="tel:+77015877127">+7 701 587 7127</a>
          </article>

          <article className="contactCard">
            <span>WhatsApp</span>
            <a href="https://wa.me/77771234567" target="_blank" rel="noreferrer">
              Написать в WhatsApp
            </a>
          </article>

          <article className="contactCard">
            <span>Email</span>
            <a href="mailto:metallodvorastana@gmail.com">metallodvorastana@gmail.com</a>
          </article>

          <article className="contactCard">
            <span>Адрес</span>
            <p>Астана, Рынок "Эталон"</p>
          </article>
        </div>

        <form className="form contactForm" onSubmit={handleSubmit}>
          <h2>Форма обратной связи</h2>
          {sent && <p className="successMessage">Заявка подготовлена. После подключения backend она будет отправляться менеджеру.</p>}

          <label>
            Имя
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ваше имя"
              required
            />
          </label>

          <label>
            Телефон
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+7 ___ ___ __ __"
              required
            />
          </label>

          <label>
            Комментарий
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              placeholder="Что нужно рассчитать?"
              required
            />
          </label>

          <button className="btn btn--primary" type="submit">Отправить</button>
        </form>
      </div>

      <div className="mapPlaceholder" role="img" aria-label="Карта расположения склада МеталлоДвор Астана">
        <div>
          <strong>МеталлоДвор Астана</strong>
          <span>Складская зона • удобный подъезд для погрузки</span>
        </div>
      </div>
    </section>
  );
}
