import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import useWishlistStore from '../../store/wishlistStore';
import useAuthStore from '../../store/authStore';

const MobileBottomNav = () => {
  const { pathname } = useLocation();
  const { cartTotalItems } = useCartStore();
  const { wishlistItems } = useWishlistStore();
  const { user } = useAuthStore();

  const totalCart = cartTotalItems();
  const totalWishlist = wishlistItems.length;

  // در صفحات ادمین یا درگاه پرداخت این نوار پنهان شود
  if (pathname.startsWith('/admin') || pathname.startsWith('/payment')) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] font-sans" dir="rtl">
      <div className="flex justify-around items-center">
        
        {/* خانه */}
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home size={20} className={pathname === '/' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] font-black">خانه</span>
        </Link>

        {/* دسته‌بندی‌ها */}
        <Link 
          to="/archive" 
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname.startsWith('/archive') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Grid size={20} className={pathname.startsWith('/archive') ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] font-black">کاتالوگ</span>
        </Link>

        {/* سبد خرید با بج عددی */}
        <Link 
          to="/cart" 
          className={`flex flex-col items-center gap-1 relative transition-colors ${
            pathname === '/cart' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <ShoppingBag size={20} className={pathname === '/cart' ? 'stroke-[2.5]' : ''} />
            {totalCart > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-primary text-dark text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                {totalCart}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black">سبد خرید</span>
        </Link>

        {/* علاقه‌مندی‌ها */}
        <Link 
          to="/wishlist" 
          className={`flex flex-col items-center gap-1 relative transition-colors ${
            pathname === '/wishlist' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <div className="relative">
            <Heart size={20} className={pathname === '/wishlist' ? 'stroke-[2.5] text-rose-500 fill-rose-500' : ''} />
            {totalWishlist > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-sm">
                {totalWishlist}
              </span>
            )}
          </div>
          <span className="text-[10px] font-black">نشان‌شده‌ها</span>
        </Link>

        {/* پروفایل کاربری / ورود */}
        <Link 
          to={user ? "/profile" : "/login"} 
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/profile' || pathname === '/login' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User size={20} className={pathname === '/profile' ? 'stroke-[2.5]' : ''} />
          <span className="text-[10px] font-black">{user ? 'پروفایل' : 'ورود'}</span>
        </Link>

      </div>
    </div>
  );
};

export default MobileBottomNav;
