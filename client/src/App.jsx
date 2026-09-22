import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Home from './pages/Home/Home';
import ProductDetail from './pages/ProductDetail/ProductDetail';

// یک فوتر موقت امن برای جلوگیری از خطای نبودن فایل فوتر
const SafeFooter = () => (
  <footer className="bg-dark text-gray-400 text-sm text-center py-6 mt-12 border-t border-gray-800">
    کلیه حقوق برای فروشگاه Team 9 محفوظ است.
  </footer>
);

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
