import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Dumbbell, Ticket, Boxes, HelpCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const AdminLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { name: 'داشبورد مدیریتی', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'انبارداری و قفسه‌ها (WMS)', path: '/admin/inventory', icon: <Boxes size={20} /> },
    { name: 'سفارشات و بارنامه‌ها', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'کاتالوگ مکمل‌ها', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'پاسخ به سوالات مربی', path: '/admin/questions', icon: <HelpCircle size={20} /> },
    { name: 'مدیریت کاربران', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'کدهای تخفیف', path: '/admin/coupons', icon: <Ticket size={20} /> },
    { name: 'تنظیمات فروشگاه', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans" dir="rtl">
      <aside className="w-64 bg-dark text-gray-300 flex flex-col shrink-0">
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-dark p-2 rounded-xl"><Dumbbell size={24} strokeWidth={2.5} /></div>
            <span className="text-xl font-black text-white tracking-tighter">TEAM 9 ADMIN</span>
          </Link>
        </div>
        <div className="p-6 border-b border-gray-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-primary font-bold text-xl border border-gray-700">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{user?.name || 'مدیر کل'}</p>
            <p className="text-xs text-primary mt-1 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"></span> انبار فعال
            </p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto hide-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname.includes(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-sm transition-all ${
                  isActive ? 'bg-primary text-dark shadow-lg shadow-primary/20 scale-102' : 'hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-all font-bold text-sm">
            <LogOut size={20} /> خروج از سیستم
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
          <h2 className="text-lg font-black text-gray-800">
            {menuItems.find(m => pathname.includes(m.path))?.name || 'سامانه مدیریت و انبارداری'}
          </h2>
          <Link to="/" className="text-xs font-black text-dark bg-primary px-4 py-2.5 rounded-xl hover:bg-primary-hover transition-all">
            مشاهده ویترین فروشگاه
          </Link>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
