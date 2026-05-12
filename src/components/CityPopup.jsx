import { useEffect, useState } from 'react';

export default function CityPopup() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const savedCity = localStorage.getItem('metallodvor-city-confirmed');
    if (!savedCity) {
      const timer = window.setTimeout(() => setVisible(true), 700);
      return () => window.clearTimeout(timer);
    }
  }, []);

  if (!visible) {
    return null;
  }

  const confirmCity = () => {
    localStorage.setItem('metallodvor-city-confirmed', 'astana');
    setVisible(false);
  };

  const chooseAnother = () => {
    setMessage('Сейчас основной город обслуживания — Астана. Для других городов уточните доставку у менеджера.');
  };

  return (
    <aside className="cityPopup" aria-label="Выбор города">
      <button className="cityPopup__close" type="button" onClick={() => setVisible(false)} aria-label="Закрыть">
        ×
      </button>
      <strong>Астана ваш город?</strong>
      <p>Покажем актуальные условия доставки и наличия для Астаны.</p>
      {message && <p className="cityPopup__note">{message}</p>}
      <div>
        <button className="btn btn--primary btn--small" type="button" onClick={confirmCity}>Да</button>
        <button className="btn btn--ghost btn--small" type="button" onClick={chooseAnother}>
          Выбрать другой город
        </button>
      </div>
    </aside>
  );
}
