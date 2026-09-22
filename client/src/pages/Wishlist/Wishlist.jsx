import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, ArrowRight, Trash2, ArrowLeft, Dumbbell } from 'lucide-react';
import useWishlistStore from '../../store/wishlistStore';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../utils/formatters';

const Wishlist = () => {
  const { wishlistItems, toggleWishlist, clearWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleMoveToCart = (product) => {
    const variant = product.variants?.[0] || { sku: product._id, price: 0, stock: 10 };
    addToCart(product, variant, 1);
    toggleWishlist(product);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4 font-sans">
        <div className="w-24 h-24 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mb-4">
          <Heart size={44} />
        </div>
        <h1 className="text-2xl font-black text-gray-800 mb-2">لیست علاقه‌مندی‌های شما خالی است!</h1>
        <p className="text-gray-500 mb-6 text-sm max-w-md">
          مکمل‌هایی که برای دوره‌های بعدی خود مد نظر دارید را با کلیک روی آیکون قلب ذخیره کنید.
        </p>
        <Link to="/archive" className="bg-dark text-primary font-bold px-6 py-3 rounded-2xl hover:bg-gray-800 transition-colors text-sm flex items-center gap-2">
          مشاهده کاتالوگ مکمل‌ها <ArrowLeft size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100"><ArrowRight size={20}/></Link>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Heart className="text-rose-500 fill-rose-500" size={26} /> مکمل‌های مورد علاقه من
            </h1>
            <span className="text-xs bg-rose-100 text-rose-700 font-bold px-3 py-1 rounded-full">{wishlistItems.length} مکمل</span>
          </div>
          <button onClick={clearWishlist} className="text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors">
            پاک کردن همه
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const minPrice = product.variants?.[0]?.discountPrice || product.variants?.[0]?.price || 0;
            return (
              <div key={product._id} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 left-4 p-2 bg-gray-50 hover:bg-rose-50 text-rose-500 rounded-xl transition-colors z-10"
                  title="حذف از نشان‌شده‌ها"
                >
                  <Trash2 size={16} />
                </button>

                <Link to={`/product/${product.slug}`} className="block">
                  <div className="w-full aspect-square bg-gray-50 rounded-2xl p-4 mb-4 flex items-center justify-center overflow-hidden">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                    ) : (
                      <Dumbbell size={48} className="text-gray-300" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <span className="text-xs text-gray-400 uppercase font-mono block mb-4">{product.brand}</span>
                </Link>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                  <span className="font-black text-gray-900 text-sm">{formatPrice(minPrice)} تومان</span>
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="bg-dark hover:bg-primary text-primary hover:text-dark px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag size={14} /> خرید
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
