// filepath: client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Login from './pages/Login/Login';
import AdminProducts from './pages/Admin/AdminProducts';
import Home from './pages/Home/Home';

const Layout = ({ children }) => {
  const location = useLocation();
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
