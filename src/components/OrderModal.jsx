import { useEffect, useState } from 'react';

const initialForm = {
  name: '',
  phone: '',
  comment: '',
};

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
            <h2>Заявка создана</h2>
            <p>
              Это демонстрационный frontend. После подключения backend заявку можно будет отправлять
              менеджеру или сохранять в CRM.
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
