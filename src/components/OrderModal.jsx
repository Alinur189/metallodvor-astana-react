import { useEffect, useState } from 'react';
import { trackEvent } from '../utils/analytics.js';

const initialForm = {
  name: '',
  phone: '',
  comment: '',
};

const WHATSAPP_NUMBER = '77015877127';

function buildWhatsAppLink(product, form) {
  const lines = [
    'Здравствуйте! Хочу оформить заявку с сайта.',
    `Товар: ${product.title} (${product.size})`,
    `Имя: ${form.name}`,
    `Телефон: ${form.phone}`,
  ];

  if (form.comment.trim()) {
    lines.push(`Комментарий: ${form.comment.trim()}`);
  }

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export default function OrderModal({ product, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (product) {
      setForm(initialForm);
      setIsSent(false);
      document.body.classList.add('modalOpen');
    } else {
      document.body.classList.remove('modalOpen');
    }

    return () => document.body.classList.remove('modalOpen');
  }, [product]);

  if (!product) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    trackEvent('order_submit', {
      product: product.title,
      product_size: product.size,
      product_category: product.category,
    });
    window.open(buildWhatsAppLink(product, form), '_blank', 'noopener');
    setIsSent(true);
  };

  return (
    <div className="modalBackdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="orderModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="orderModal__close" type="button" onClick={onClose} aria-label="Закрыть форму">
          ×
        </button>

        {isSent ? (
          <div className="orderModal__success">
            <span>✓</span>
            <h2>Заявка сформирована</h2>
            <p>
              Мы открыли WhatsApp с текстом вашей заявки — просто нажмите «Отправить» в чате,
              и менеджер ответит в рабочее время.
            </p>
            <p>
              Чат не открылся?{' '}
              <a href={buildWhatsAppLink(product, form)} target="_blank" rel="noopener noreferrer">
                Открыть WhatsApp вручную
              </a>{' '}
              или позвоните: <a href="tel:+77015877127">+7 701 587 7127</a>
            </p>
            <button className="btn btn--primary" type="button" onClick={onClose}>
              Понятно
            </button>
          </div>
        ) : (
          <>
            <span className="eyebrow">Быстрая заявка</span>
            <h2 id="order-modal-title">Заказать товар</h2>
            <p className="orderModal__product">{product.title} • {product.size}</p>

            <form className="form" onSubmit={handleSubmit}>
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
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  placeholder="Например: нужен объем на объект, доставка сегодня"
                  rows="4"
                />
              </label>

              <button className="btn btn--primary" type="submit">Отправить заявку</button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
