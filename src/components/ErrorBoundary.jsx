import { Component } from 'react';

// Ловит ошибки рендера (в т.ч. сбой загрузки ленивого чанка после деплоя,
// когда у пользователя открыта старая вкладка) и показывает понятный экран
// с кнопкой обновления вместо белого экрана.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Не прячем ошибку — пишем в консоль, чтобы её было видно в логах.
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="container pageContent pageContent--single">
          <div className="pageHero pageHero--compact">
            <span className="eyebrow">Что-то пошло не так</span>
            <h1>Не удалось загрузить страницу</h1>
            <p>
              Обновите страницу — чаще всего это помогает. Если проблема
              повторяется, напишите нам, и мы поможем.
            </p>
          </div>
          <div className="productDetail__actions">
            <button
              className="btn btn--primary"
              type="button"
              onClick={() => window.location.reload()}
            >
              Обновить страницу
            </button>
            <a
              className="btn btn--whatsapp"
              href="https://wa.me/77015877127"
              target="_blank"
              rel="noopener noreferrer"
            >
              Написать в WhatsApp
            </a>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
