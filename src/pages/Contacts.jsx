import { useState } from 'react';
import { usePageMeta } from '../utils/usePageMeta.js';
import { trackEvent } from '../utils/analytics.js';

const initialForm = {
  name: '',
  phone: '',
  message: '',
};

const WHATSAPP_NUMBER = '77015877127';

function buildWhatsAppLink(form) {
  const lines = [
    'Здравствуйте! Заявка с сайта (форма обратной связи).',
    `Имя: ${form.name}`,
    `Телефон: ${form.phone}`,
  ];

  if (form.message.trim()) {
    lines.push(`Сообщение: ${form.message.trim()}`);
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function Contacts() {
  const [form, setForm] = useState(initialForm);
  const [sent, setSent] = useState(false);
  const [submittedLink, setSubmittedLink] = useState('');

  usePageMeta(
    'Контакты — купить сварную сетку в Астане | МеталлоДвор',
    'Контакты МеталлоДвор Астана: телефон, WhatsApp, адрес склада и форма обратной связи.',
    'МеталлоДвор Астана контакты, телефон склада металла Астана, адрес рынок Эталон Астана',
    '/contacts',
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const link = buildWhatsAppLink(form);
    trackEvent('form_submit', { form: 'contacts' });
    window.open(link, '_blank', 'noopener');
    setSubmittedLink(link);
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
            <span>Қуаныш</span>
            <a href="tel:+77021665051">+7 702 166 5051</a>
          </article>

          <article className="contactCard">
            <span>Нуржан - вопросы о сетке</span>
            <a href="tel:+77015877127">+7 701 587 7127</a>
          </article>
          <article className="contactCard">
            <span>WhatsApp — Нуржан</span>
            <a href="https://wa.me/77015877127" target="_blank" rel="noreferrer">
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
          {sent && (
            <p className="successMessage">
              Мы открыли WhatsApp с текстом вашей заявки — нажмите «Отправить» в чате.{' '}
              Чат не открылся?{' '}
              <a href={submittedLink} target="_blank" rel="noopener noreferrer">
                Открыть WhatsApp вручную
              </a>{' '}
              или позвоните: <a href="tel:+77015877127">+7 701 587 7127</a>.
            </p>
          )}

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
