import { lazyWithPreload } from './utils/lazyWithPreload.js';

// Единый список маршрутов: каждая страница — свой ленивый chunk.
// Используется в App (рендер <Route>), entry-server (предзагрузка всех
// маршрутов перед пререндером) и main (предзагрузка текущего маршрута
// перед гидратацией).
export const routes = [
  { path: '/', Component: lazyWithPreload(() => import('./pages/Home.jsx')) },
  { path: '/catalog', Component: lazyWithPreload(() => import('./pages/Catalog.jsx')) },
  { path: '/catalog/:category', Component: lazyWithPreload(() => import('./pages/Category.jsx')) },
  { path: '/product/:id', Component: lazyWithPreload(() => import('./pages/ProductDetail.jsx')) },
  { path: '/about', Component: lazyWithPreload(() => import('./pages/About.jsx')) },
  { path: '/delivery', Component: lazyWithPreload(() => import('./pages/Delivery.jsx')) },
  { path: '/contacts', Component: lazyWithPreload(() => import('./pages/Contacts.jsx')) },
  { path: '/price-list', Component: lazyWithPreload(() => import('./pages/PriceList.jsx')) },
  { path: '/factory', Component: lazyWithPreload(() => import('./pages/Factory.jsx')) },
  {
    path: '/guide/svarnaya-setka-dlya-styazhki',
    Component: lazyWithPreload(() => import('./pages/GuideWeldedMesh.jsx')),
  },
  {
    path: '/guide/kladochnaya-setka',
    Component: lazyWithPreload(() => import('./pages/GuideMasonryMesh.jsx')),
  },
];

// Предзагрузить все маршруты (для пререндера на сервере).
export function preloadAll() {
  return Promise.all(routes.map((route) => route.Component.preload()));
}
