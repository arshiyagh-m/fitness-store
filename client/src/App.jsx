// filepath: client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './pages/Login/Login';
import AdminProducts from './pages/Admin/AdminProducts';

const Home = () => (
  <div className="container mx-auto px-4 py-10 min-h-screen">
    <div className="bg-primary/10 border border-primary text-primary-dark p-6 rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-2">به فیت‌کالا خوش آمدید</h1>
      <p>فاز ۳ انجام شد: پایگاه داده مکمل‌ها ایجاد شد.</p>
      <p className="mt-4 text-sm text-gray-600">
        برای مشاهده پنل مدیریت محصولات، به آدرس 
        <a href="/admin/products" className="text-blue-600 font-bold mx-1 hover:underline">/admin/products</a>
        بروید.
      </p>
    </div>
  </div>
);

const Layout = ({ children }) => {
  const location = useLocation();
  // صفحات لاگین و ادمین، هدر و فوتر فروشگاهی ندارند (ادمین هدر اختصاصی نیاز دارد که بعدا اضافه می‌شود)
  const isMinimalPage = location.pathname === '/login' || location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isMinimalPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isMinimalPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
