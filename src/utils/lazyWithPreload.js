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
          result = err;
          throw err;
        },
      );
    }
    return pending;
  };

  const Component = (props) => {
    if (status !== 'resolved') {
      // Бросаем промис — Suspense покажет fallback и перерендерит после загрузки.
      throw load();
    }
    return createElement(result, props);
  };

  Component.preload = load;
  return Component;
}
