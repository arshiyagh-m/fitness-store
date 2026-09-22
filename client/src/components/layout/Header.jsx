import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, LogIn, Menu, Dumbbell, User as UserIcon, X, ArrowLeft, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import useProductStore from '../../store/productStore';
import useWishlistStore from '../../store/wishlistStore';
import { formatPrice } from '../../utils/formatters';

const Header = () => {
  const { cartTotalItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const { products } = useProductStore();
  const { wishlistItems } = useWishlistStore();
  const totalItems = cartTotalItems();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchTerm.trim().length >= 2
    ? products.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setIsOpen(false);
      navigate(`/archive?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100 font-sans">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="flex items-center gap-6 w-full lg:w-2/3">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-dark text-primary p-2 rounded-xl group-hover:bg-primary group-hover:text-dark transition-colors">
              <Dumbbell size={28} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-dark uppercase">Team 9</span>
          </Link>

          {/* سرچ بار زنده */}
          <div ref={searchRef} className="hidden lg:block relative w-full max-w-xl">
            <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 text-gray-600 border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search size={20} className="text-gray-400 shrink-0" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleSearchSubmit}
                placeholder="جستجو در مکمل‌های تیم ۹ (پروتئین، کراتین، برند...)" 
                className="bg-transparent border-none outline-none w-full mr-2 text-sm placeholder-gray-400 font-medium" 
              />
              {searchTerm && <button onClick={() => setSearchTerm('')}><X size={16} className="text-gray-400" /></button>}
            </div>

            {isOpen && searchTerm.trim().length >= 2 && (
              <div className="absolute top-full right-0 left-0 bg-white rounded-2xl shadow-2xl border border-gray-100 mt-2 overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-400">پیشنهادات لحظه‌ای:</div>
                    {searchResults.map((product) => {
                      const minPrice = product.variants?.[0]?.discountPrice || product.variants?.[0]?.price || 0;
                      return (
                        <Link
                          key={product._id}
                          to={`/product/${product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 border border-gray-200">
                              <Dumbbell size={18} className="text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors line-clamp-1">{product.title}</p>
                              <span className="text-xs text-gray-400 font-mono uppercase">{product.brand}</span>
                            </div>
                          </div>
                          <div className="text-xs font-black text-gray-900 shrink-0 mr-4">{formatPrice(minPrice)} تومان</div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-gray-500 font-medium">مکملی یافت نشد.</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* اکشن‌های سمت چپ (علاقه‌مندی‌ها، کاربر و سبد خرید) */}
        <div className="flex items-center gap-3 border-r border-gray-200 pr-4">
          
          {/* دکمه لیست علاقه‌مندی‌ها */}
          <Link to="/wishlist" className="relative p-2.5 bg-gray-50 hover:bg-rose-50 rounded-xl transition-colors border border-gray-200 text-gray-600 hover:text-rose-500" title="علاقه‌مندی‌ها">
            <Heart size={20} className={wishlistItems.length > 0 ? 'text-rose-500 fill-rose-500' : ''} />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                {wishlistItems.length}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 cursor-pointer group relative">
              <UserIcon size={20} className="text-gray-600" />
              <span className="text-sm font-bold text-gray-700 hidden sm:block">{user.name}</span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <Link to="/profile" className="block w-full text-right px-4 py-3 text-sm text-gray-700 font-bold hover:bg-gray-50 border-b border-gray-100">پروفایل من</Link>
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className="block w-full text-right px-4 py-3 text-sm text-primary font-bold hover:bg-gray-50 border-b border-gray-100 bg-dark">پنل مدیریت</Link>
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
          <Link to="/archive" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"><Menu size={18} /><span>همه محصولات</span></Link>
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
