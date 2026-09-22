import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home/Home';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Login/Login';
import Archive from './pages/Archive/Archive';
import AdminOrders from './pages/Admin/AdminOrders';

const SafeFooter = () => (
  <footer className="bg-dark text-gray-400 text-sm text-center py-6 mt-12 border-t border-gray-800">
    کلیه حقوق برای فروشگاه Team 9 محفوظ است.
  </footer>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');

  // در صفحات لاگین و ادمین، هدر و فوتر اصلی فروشگاه رو نشون نده
  if (isAuthPage || isAdminPage) return <>{children}</>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">{children}</main>
      <SafeFooter />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;
