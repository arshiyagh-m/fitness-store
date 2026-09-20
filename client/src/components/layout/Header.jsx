// filepath: client/src/components/layout/Header.jsx
import React from 'react';
import { Search, ShoppingCart, LogIn, Menu, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm">
      {/* بخش بالایی هدر */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* لوگو و سرچ‌بار */}
        <div className="flex items-center gap-6 w-full lg:w-2/3">
          <Link to="/" className="flex items-center gap-1 text-primary">
            {/* SVG داخلی برای لوگو (بدون نیاز به فایل خارجی) */}
            <Dumbbell size={32} strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight">فیت‌کالا</span>
          </Link>

          <div className="hidden lg:flex items-center bg-gray-100 rounded-md w-full max-w-xl px-4 py-2 text-gray-600">
            <Search size={20} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="جستجو در فیت‌کالا..." 
              className="bg-transparent border-none outline-none w-full mr-2 text-sm placeholder-gray-500"
            />
          </div>
        </div>

        {/* دکمه‌های ورود و سبد خرید */}
        <div className="flex items-center gap-4 border-r border-gray-200 pr-4">
          <Link to="/login" className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
            <LogIn size={20} className="text-gray-700" />
            <span className="text-sm font-medium text-gray-700 hidden sm:block">ورود | ثبت‌نام</span>
          </Link>
          <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <ShoppingCart size={24} className="text-gray-700" />
            <span className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
              ۰
            </span>
          </Link>
        </div>
      </div>

      {/* مگا منو (نویگیشن پایین هدر) */}
      <nav className="border-t border-gray-100 hidden lg:block">
        <div className="container mx-auto px-4 flex items-center gap-6 text-sm font-medium text-gray-600 h-10">
          <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors font-bold">
            <Menu size={18} />
            <span>دسته‌بندی کالاها</span>
          </div>
          <span className="text-gray-300">|</span>
          <Link to="/archive?category=whey" className="hover:text-primary transition-colors">پروتئین وی</Link>
          <Link to="/archive?category=creatine" className="hover:text-primary transition-colors">کراتین</Link>
          <Link to="/archive?category=gainer" className="hover:text-primary transition-colors">گینر و کربوهیدرات</Link>
          <Link to="/archive?category=amino" className="hover:text-primary transition-colors">آمینو و BCAA</Link>
          <Link to="/archive?category=pre-workout" className="hover:text-primary transition-colors">پمپ و قبل تمرین</Link>
          <Link to="/archive?category=fat-burner" className="hover:text-primary transition-colors">چربی‌سوز</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;