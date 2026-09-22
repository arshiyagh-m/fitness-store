import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// صفحات کلاینت
import Header from './components/layout/Header';
import Home from './pages/Home/Home';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import PaymentGateway from './pages/Checkout/PaymentGateway';
import OrderSuccess from './pages/Checkout/OrderSuccess';
import Login from './pages/Login/Login';
import Archive from './pages/Archive/Archive';
import Profile from './pages/Profile/Profile';
import Wishlist from './pages/Wishlist/Wishlist';
import Compare from './pages/Compare/Compare';
import NotFound from './pages/NotFound/NotFound';
import CompareFloatingBar from './components/common/CompareFloatingBar';

// صفحات ادمین
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminWarehouse from './pages/Admin/AdminWarehouse';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminOrderDetails from './pages/Admin/AdminOrderDetails';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminAddProduct from './pages/Admin/AdminAddProduct';
import AdminEditProduct from './pages/Admin/AdminEditProduct';
import AdminCoupons from './pages/Admin/AdminCoupons';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminQA from './pages/Admin/AdminQA';
import AdminSettings from './pages/Admin/AdminSettings';

const AppRoutes = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/login' || location.pathname.startsWith('/payment');

  if (isAdminPath) {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/" replace />;

    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/inventory" element={<AdminWarehouse />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/products/add" element={<AdminAddProduct />} />
          <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
          <Route path="/admin/questions" element={<AdminQA />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAuthPage && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/:id" element={<PaymentGateway />} />
          <Route path="/order/:id/success" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <CompareFloatingBar />

      {!isAuthPage && (
        <footer className="bg-dark text-gray-400 text-sm text-center py-6 mt-12 border-t border-gray-800">
          کلیه حقوق برای فروشگاه Team 9 محفوظ است.
        </footer>
      )}
    </div>
  );
};

function App() {
  useEffect(() => {
    const savedBanner = localStorage.getItem('site_banner');
    if (savedBanner) {
      const config = JSON.parse(savedBanner);
      if (config.theme) {
        document.documentElement.setAttribute('data-theme', config.theme);
      }
    }
  }, []);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
