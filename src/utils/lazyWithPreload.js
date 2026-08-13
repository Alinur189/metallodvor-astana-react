import { createElement } from 'react';

// Замена React.lazy, которая после предзагрузки модуля умеет рендериться
// синхронно. Это нужно для двух вещей в нашей сборке:
//   1) пререндер через renderToString (синхронный) — компоненты должны быть
//      готовы заранее, иначе в статический HTML попадёт только fallback;
//   2) гидратация на клиенте без рассинхронизации разметки — текущий маршрут
//      предзагружается до hydrateRoot.
// Остальные маршруты подгружаются своим chunk-ом при переходе.
export function lazyWithPreload(factory) {
  let status = 'idle';
  let result;
  let error;
  let pending;

  const load = () => {
    if (status === 'resolved' || status === 'rejected') return pending;
    if (!pending) {
      status = 'pending';
      pending = factory().then(
        (mod) => {
          status = 'resolved';
          result = mod.default;
        },
        (err) => {
          status = 'rejected';
          error = err;
          throw err;
        },
      );
    }
    return pending;
  };

  const Component = (props) => {
    // Чанк не загрузился (чаще всего — деплой выкатился, пока вкладка была
    // открыта, и старого файла на CDN уже нет). Бросать здесь отклонённый
    // промис нельзя: React повесит на него обработчик, снова получит reject,
    // снова отрендерит — и так по кругу, а до ErrorBoundary ошибка не дойдёт.
    // Бросаем саму ошибку, чтобы сработал ErrorBoundary.
    if (status === 'rejected') throw error;

    if (status !== 'resolved') {
      // Бросаем промис — Suspense покажет fallback и перерендерит после загрузки.
      throw load();
    }
    return createElement(result, props);
  };

  Component.preload = load;
  return Component;
}
