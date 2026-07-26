import { Suspense, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingButtons from './components/FloatingButtons.jsx';
import CityPopup from './components/CityPopup.jsx';
import OrderModal from './components/OrderModal.jsx';
import Analytics from './components/Analytics.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { routes } from './routes.jsx';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const openOrderModal = (product) => {
    setSelectedProduct(product);
  };

  const closeOrderModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="app">
      <Analytics />
      <Header />
      <main>
        <ErrorBoundary>
          <Suspense fallback={null}>
            <Routes>
              {routes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component onOrder={openOrderModal} />} />
              ))}
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <FloatingButtons />
      <CityPopup />
      <OrderModal product={selectedProduct} onClose={closeOrderModal} />
    </div>
  );
}
