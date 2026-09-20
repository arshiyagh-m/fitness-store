// filepath: client/src/components/product/ProductCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Dumbbell } from 'lucide-react';
import { formatPrice, calculateDiscountPercentage } from '../../utils/formatters';

const ProductCard = ({ product }) => {
  // یافتن کمترین قیمت و بیشترین تخفیف در بین متغیرها (طعم/وزن‌های مختلف)
  let minPrice = Infinity;
  let hasDiscount = false;
  let maxDiscountPercent = 0;
  let inStock = false;
  let finalDisplayPrice = 0;
  let originalDisplayPrice = 0;

  if (product.variants && product.variants.length > 0) {
    product.variants.forEach(variant => {
      if (variant.stock > 0) inStock = true;
      
      const currentFinalPrice = variant.discountPrice || variant.price;
      if (currentFinalPrice < minPrice) {
        minPrice = currentFinalPrice;
        finalDisplayPrice = currentFinalPrice;
        originalDisplayPrice = variant.price;
        hasDiscount = !!variant.discountPrice;
        maxDiscountPercent = calculateDiscountPercentage(variant.price, variant.discountPrice);
      }
    });
  }

  // اگر هیچ متغیری نداشت (محافظت از خطا)
  if (minPrice === Infinity) {
    minPrice = 0;
  }

  return (
    <Link 
      to={`/product/${product.slug}`} 
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-4 flex flex-col relative overflow-hidden h-full block"
    >
      {/* برچسب تخفیف */}
      {hasDiscount && (
        <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
          ٪{new Intl.NumberFormat('fa-IR').format(maxDiscountPercent)}
        </div>
      )}

      {/* تصویر (الگوی SVG آفلاین برای حفظ زیبایی) */}
      <div className="relative w-full aspect-square mb-4 bg-gray-50 rounded-xl flex flex-col items-center justify-center p-4 group-hover:bg-gray-100 transition-colors">
        <Dumbbell size={64} strokeWidth={1} className="text-gray-300 mb-2 group-hover:scale-110 transition-transform duration-500" />
        <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">{product.category}</span>
        
        {/* نشانگر موجودی */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center rounded-xl">
            <span className="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg">ناموجود</span>
          </div>
        )}
      </div>

      {/* اطلاعات محصول */}
      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mb-2 bg-emerald-50 w-max px-2 py-1 rounded-md border border-emerald-100">
          <ShieldCheck size={14} />
          ضمانت اصالت کالا
        </div>
        
        <h3 className="text-gray-800 font-bold text-sm leading-6 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        <span className="text-xs text-gray-400 mb-4 line-clamp-1">{product.brand}</span>
        
        {/* بخش قیمت در پایین کارت چسبیده باشد */}
        <div className="mt-auto flex items-end justify-between">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
            <Plus size={18} />
          </div>
          
          <div className="flex flex-col items-end">
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through mb-0.5">
                {formatPrice(originalDisplayPrice)}
              </span>
            )}
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-gray-800">{formatPrice(finalDisplayPrice)}</span>
              <span className="text-xs text-gray-500 font-medium">تومان</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
