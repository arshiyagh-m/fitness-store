import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home/Home';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import Login from './pages/Login/Login';
import Archive from './pages/Archive/Archive';
import Profile from './pages/Profile/Profile';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminAddProduct from './pages/Admin/AdminAddProduct';
import AdminCoupons from './pages/Admin/AdminCoupons';
import AdminSettings from './pages/Admin/AdminSettings';

const SafeFooter = () => (
  <footer className="bg-dark text-gray-400 text-sm text-center py-6 mt-12 border-t border-gray-800">کلیه حقوق برای فروشگاه Team 9 محفوظ است.</footer>
);

const AppRoutes = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLogin = location.pathname === '/login';

  if (isAdmin) {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AdminAddProduct />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isLogin && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      {!isLogin && <SafeFooter />}
    </div>
  );
};

function App() {
  return <Router><AppRoutes /></Router>;
}
export default App;
