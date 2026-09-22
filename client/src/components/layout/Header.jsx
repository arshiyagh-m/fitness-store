import React from 'react';
import { Search, ShoppingCart, LogIn, Menu, Dumbbell, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';

const Header = () => {
  const { cartTotalItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const totalItems = cartTotalItems();

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-6 w-full lg:w-2/3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-dark text-primary p-2 rounded-xl group-hover:bg-primary group-hover:text-dark transition-colors">
              <Dumbbell size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-dark uppercase">Team 9</span>
          </Link>

          <div className="hidden lg:flex items-center bg-gray-50 rounded-xl w-full max-w-xl px-4 py-2.5 text-gray-600 border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search size={20} className="text-gray-400" />
            <input type="text" placeholder="جستجو در تیم ۹..." className="bg-transparent border-none outline-none w-full mr-2 text-sm placeholder-gray-400" />
          </div>
        </div>

        <div className="flex items-center gap-4 border-r border-gray-200 pr-4">
          {user ? (
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 cursor-pointer group relative">
              <UserIcon size={20} className="text-gray-600" />
              <span className="text-sm font-bold text-gray-700 hidden sm:block">{user.name}</span>
              <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block w-full text-right px-4 py-3 text-sm text-gray-700 font-bold hover:bg-gray-50 border-b border-gray-100">پنل مدیریت</Link>
                )}
                <button onClick={logout} className="w-full text-right px-4 py-3 text-sm text-rose-500 font-bold hover:bg-rose-50 rounded-b-xl">خروج</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 bg-dark text-white rounded-xl px-5 py-2.5 hover:bg-gray-800 transition-colors shadow-md">
              <LogIn size={20} className="text-primary" />
              <span className="text-sm font-bold hidden sm:block">ورود</span>
            </Link>
          )}

          <Link to="/cart" className="relative p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
            <ShoppingCart size={22} className="text-dark" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-dark text-[11px] font-black h-5 w-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
      
      <nav className="border-t border-gray-100 hidden lg:block bg-dark">
        <div className="container mx-auto px-4 flex items-center gap-8 text-sm font-bold text-gray-300 h-12">
          {/* لینک شدن دکمه اصلی به صفحه آرشیو */}
          <Link to="/archive" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
            <Menu size={18} />
            <span>همه محصولات</span>
          </Link>
          <span className="text-gray-700">|</span>
          <Link to="/archive?category=whey" className="hover:text-white transition-colors">پروتئین وی</Link>
          <Link to="/archive?category=creatine" className="hover:text-white transition-colors">کراتین</Link>
          <Link to="/archive?category=gainer" className="hover:text-white transition-colors">گینر</Link>
          <Link to="/archive?category=amino" className="hover:text-white transition-colors">آمینو و BCAA</Link>
          <Link to="/archive?category=pre-workout" className="hover:text-white transition-colors">پمپ</Link>
        </div>
      </nav>
    </header>
  );
};
export default Header;
