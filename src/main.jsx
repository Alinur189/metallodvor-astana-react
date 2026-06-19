import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, matchPath } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.jsx';
import { routes } from './routes.jsx';
import './styles/global.css';

const container = document.getElementById('root');
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

function mount() {
  // Пререндеренные страницы гидрируются, чтобы не перерисовывать готовый HTML.
  if (container.hasChildNodes()) {
    ReactDOM.hydrateRoot(container, app);
  } else {
    ReactDOM.createRoot(container).render(app);
  }
}

// Маршруты ленивые: предзагружаем chunk текущей страницы до гидратации,
// чтобы разметка совпала с пререндеренной. Остальные маршруты подгрузятся
// при переходе.
const current = routes.find((route) => matchPath(route.path, window.location.pathname));
if (current) {
  current.Component.preload().then(mount, mount);
} else {
  mount();
}
