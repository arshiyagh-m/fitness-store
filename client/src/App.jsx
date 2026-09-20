// filepath: client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// کامپوننت موقت برای صفحه اصلی
const Home = () => (
  <div className="container mx-auto px-4 py-10 min-h-screen">
    <div className="bg-primary/10 border border-primary text-primary-dark p-6 rounded-lg text-center">
      <h1 className="text-2xl font-bold mb-2">به فیت‌کالا خوش آمدید</h1>
      <p>فروشگاه تخصصی مکمل‌های ورزشی و بدنسازی - پروژه در حال توسعه (فاز ۱)</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* مسیرهای بعدی اینجا اضافه می‌شوند */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;