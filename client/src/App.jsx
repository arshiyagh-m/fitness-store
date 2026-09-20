// filepath: client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './pages/Login/Login';

const Home = () => (
  <div className="container mx-auto px-4 py-10 min-h-screen">
    <div className="bg-primary/10 border border-primary text-primary-dark p-6 rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-2">به فیت‌کالا خوش آمدید</h1>
      <p>فروشگاه تخصصی مکمل‌های ورزشی و بدنسازی - (فاز ۲: احراز هویت تکمیل شد)</p>
    </div>
  </div>
);

// کامپوننت کمکی برای مدیریت نمایش هدر و فوتر (Layout Wrapper)
const Layout = ({ children }) => {
  const location = useLocation();
  // در صفحه لاگین، هدر و فوتر نمایش داده نمی‌شود
  const isAuthPage = location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAuthPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAuthPage && <Footer />}
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
