import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import FloatingButtons from './components/FloatingButtons.jsx';
import CityPopup from './components/CityPopup.jsx';
import OrderModal from './components/OrderModal.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import Category from './pages/Category.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About.jsx';
import Delivery from './pages/Delivery.jsx';
import Contacts from './pages/Contacts.jsx';
import PriceList from './pages/PriceList.jsx';
import Factory from './pages/Factory.jsx';

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
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home onOrder={openOrderModal} />} />
          <Route path="/catalog" element={<Catalog onOrder={openOrderModal} />} />
          <Route path="/catalog/:category" element={<Category onOrder={openOrderModal} />} />
          <Route path="/product/:id" element={<ProductDetail onOrder={openOrderModal} />} />
          <Route path="/about" element={<About />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/price-list" element={<PriceList onOrder={openOrderModal} />} />
          <Route path="/factory" element={<Factory />} />
        </Routes>
      </main>
      <Footer />
      <FloatingButtons />
      <CityPopup />
      <OrderModal product={selectedProduct} onClose={closeOrderModal} />
    </div>
  );
}
