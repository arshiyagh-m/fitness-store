import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Plus, Scale, Heart } from 'lucide-react';
import { formatPrice, calculateDiscountPercentage } from '../../utils/formatters';
import useCompareStore from '../../store/compareStore';
import useWishlistStore from '../../store/wishlistStore';
import ProductImage from '../common/ProductImage';

const ProductCard = ({ product }) => {
  const { addToCompare, compareItems } = useCompareStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isCompared = compareItems.some(i => i._id === product._id);
  const isFavorite = isInWishlist(product._id);
  
  let minPrice = Infinity;
  let hasDiscount = false;
  let maxDiscountPercent = 0;
  let inStock = false;
  let finalDisplayPrice = 0;
  let originalDisplayPrice = 0;

  if (product.variants?.length > 0) {
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
  if (minPrice === Infinity) minPrice = 0;

  return (
    <div className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 p-4 flex flex-col relative overflow-hidden h-full font-sans">
      {hasDiscount && (
        <div className="absolute top-4 left-4 z-10 bg-primary text-dark text-xs font-black px-2 py-1 rounded-lg shadow-sm">
          ٪{formatPrice(maxDiscountPercent)}
        </div>
      )}

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
        <button 
          onClick={() => toggleWishlist(product)} 
          className={`p-2 rounded-xl border transition-all ${isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-md' : 'bg-white/90 backdrop-blur-sm border-gray-200 text-gray-400 hover:text-rose-500'}`}
        >
          <Heart size={16} className={isFavorite ? 'fill-rose-500' : ''} />
        </button>
        <button 
          onClick={() => addToCompare(product)} 
          className={`p-2 rounded-xl border transition-all ${isCompared ? 'bg-primary border-primary text-dark shadow-md' : 'bg-white/90 backdrop-blur-sm border-gray-200 text-gray-400 hover:text-dark'}`}
        >
          <Scale size={16} />
        </button>
      </div>

      {/* تصویر کالا با لودینگ هوشمند و وکتور اختصاصی هر دسته */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative w-full aspect-square mb-4 bg-gray-50 rounded-2xl overflow-hidden p-3 group-hover:bg-gray-100 transition-colors">
          <ProductImage 
            src={product.images?.[0]} 
            category={product.category} 
            alt={product.title}
            imgClassName="group-hover:scale-105 transition-transform duration-500"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center rounded-2xl z-20">
              <span className="bg-dark text-white text-xs font-bold px-3 py-1.5 rounded-xl">ناموجود در انبار</span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col flex-grow">
        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold mb-2 bg-emerald-50 w-max px-2 py-1 rounded-md border border-emerald-100"><ShieldCheck size={14} /> ضمانت اصالت</div>
        <Link to={`/product/${product.slug}`} className="text-gray-900 font-black text-sm leading-6 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </Link>
        <span className="text-xs text-gray-400 mb-4 line-clamp-1 uppercase font-mono">{product.brand}</span>
        
        <div className="mt-auto flex items-end justify-between pt-3 border-t border-gray-50">
          <Link to={`/product/${product.slug}`} className="flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-dark transition-colors">
            <Plus size={18} />
          </Link>
          <div className="flex flex-col items-end">
            {hasDiscount && <span className="text-xs text-gray-400 line-through mb-0.5">{formatPrice(originalDisplayPrice)}</span>}
            <div className="flex items-center gap-1">
              <span className="text-lg font-black text-gray-900">{formatPrice(finalDisplayPrice)}</span>
              <span className="text-xs text-gray-500 font-medium">تومان</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
