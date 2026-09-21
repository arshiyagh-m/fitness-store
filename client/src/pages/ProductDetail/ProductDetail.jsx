// filepath: client/src/pages/ProductDetail/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, Truck, Dumbbell, Info, ChevronRight, 
  CheckCircle2, AlertCircle, ShoppingCart, Activity 
} from 'lucide-react';
import useProductStore from '../../store/productStore';
import { formatPrice, calculateDiscountPercentage } from '../../utils/formatters';

const ProductDetail = () => {
  const { slug } = useParams();
  const { productDetail: product, fetchProductDetail, isLoading, error } = useProductStore();

  const [currentVariant, setCurrentVariant] = useState(null);

  useEffect(() => {
    fetchProductDetail(slug);
  }, [slug, fetchProductDetail]);

  // وقتی محصول لود شد، اولین متغیر موجود را به عنوان پیش‌فرض انتخاب کن
  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstAvailable = product.variants.find(v => v.stock > 0) || product.variants[0];
      setCurrentVariant(firstAvailable);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Activity className="animate-spin text-primary mb-4" size={48} />
        <span className="text-gray-500 font-medium">در حال بارگذاری اطلاعات محصول...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <span className="text-gray-700 font-bold mb-4">{error || 'محصول یافت نشد!'}</span>
        <Link to="/" className="text-primary hover:underline">بازگشت به صفحه اصلی</Link>
      </div>
    );
  }

  // استخراج طعم‌ها و وزن‌های منحصر‌به‌فرد برای دکمه‌های انتخاب
  const uniqueFlavors = [...new Set(product.variants.map(v => v.flavor))].filter(Boolean);
  const uniqueWeights = [...new Set(product.variants.map(v => v.weight))].filter(Boolean);

  // تغییر متغیر با کلیک روی طعم یا وزن
  const handleVariantChange = (type, value) => {
    const targetFlavor = type === 'flavor' ? value : currentVariant.flavor;
    const targetWeight = type === 'weight' ? value : currentVariant.weight;

    // پیدا کردن متغیری که هم طعم و هم وزن انتخابی را داشته باشد
    const foundVariant = product.variants.find(
      v => v.flavor === targetFlavor && v.weight === targetWeight
    );

    // اگر ترکیب انتخابی وجود نداشت، اولین متغیر با آن طعم/وزن را انتخاب کن
    if (foundVariant) {
      setCurrentVariant(foundVariant);
    } else {
      const fallbackVariant = product.variants.find(v => v[type] === value);
      if (fallbackVariant) setCurrentVariant(fallbackVariant);
    }
  };

  const activePrice = currentVariant?.discountPrice || currentVariant?.price || 0;
  const hasDiscount = !!currentVariant?.discountPrice;
  const discountPercent = hasDiscount ? calculateDiscountPercentage(currentVariant.price, currentVariant.discountPrice) : 0;
  const isOutOfStock = currentVariant?.stock === 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-gray-500 mb-6 gap-2">
          <Link to="/" className="hover:text-primary">فیت‌کالا</Link>
          <ChevronRight size={14} />
          <Link to={`/archive?category=${product.category}`} className="hover:text-primary uppercase">
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-gray-800 font-bold line-clamp-1">{product.title}</span>
        </nav>

        {/* جعبه اصلی محصول */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* ستون راست: گالری عکس */}
          <div className="lg:w-1/3 flex flex-col">
            <div className="w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex flex-col items-center justify-center border border-gray-100 relative group overflow-hidden">
              <Dumbbell size={120} strokeWidth={0.5} className="text-gray-300 group-hover:scale-110 transition-transform duration-700" />
              <span className="absolute bottom-6 text-sm font-bold text-gray-300 tracking-widest uppercase">{product.brand}</span>
              {/* تگ تخفیف روی عکس */}
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-rose-500 text-white font-bold px-3 py-1 rounded-full shadow-lg shadow-rose-500/30">
                  ٪{formatPrice(discountPercent)} تخفیف
                </div>
              )}
            </div>
          </div>

          {/* ستون وسط: اطلاعات محصول و ترکیبات */}
          <div className="lg:w-1/3 flex flex-col">
            <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">
              {product.title}
            </h1>
            <span className="text-sm text-gray-400 font-medium mb-6 uppercase tracking-wider">{product.brand}</span>

            {/* انتخابگرها (طعم و وزن) */}
            {currentVariant && (
              <div className="space-y-6 mb-8 border-b border-gray-100 pb-8">
                
                {/* انتخاب طعم */}
                {uniqueFlavors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      طعم: <span className="text-gray-500 font-normal">{currentVariant.flavor}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueFlavors.map(flavor => (
                        <button
                          key={flavor}
                          onClick={() => handleVariantChange('flavor', flavor)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                            currentVariant.flavor === flavor 
                              ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* انتخاب وزن */}
                {uniqueWeights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      وزن: <span className="text-gray-500 font-normal">{currentVariant.weight}</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueWeights.map(weight => (
                        <button
                          key={weight}
                          onClick={() => handleVariantChange('weight', weight)}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                            currentVariant.weight === weight 
                              ? 'border-gray-900 bg-gray-900 text-white shadow-sm' 
                              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {weight}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* جدول ارزش غذایی (Nutrition Facts) */}
            {product.nutritionFacts && product.nutritionFacts.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Info size={20} className="text-primary" />
                  ارزش غذایی (هر سروینگ)
                </h3>
                <div className="space-y-2">
                  {product.nutritionFacts.map((fact, index) => (
                    <div key={index} className="flex justify-between items-center text-sm py-2 border-b border-gray-200/60 last:border-0">
                      <span className="text-gray-600 font-medium">{fact.ingredient}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-900 font-bold">{fact.amount}</span>
                        {fact.dailyValue && fact.dailyValue !== '-' && (
                          <span className="text-gray-400 text-xs w-8 text-left">{fact.dailyValue}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-600 leading-relaxed text-justify">
              {product.description}
            </div>
          </div>

          {/* ستون چپ: Buy Box (مستطیل خرید) */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-6 sticky top-24">
              
              {/* وضعیت موجودی و کد کالا */}
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                {isOutOfStock ? (
                  <span className="text-rose-500 font-bold flex items-center gap-2">
                    <AlertCircle size={20} />
                    ناموجود در انبار
                  </span>
                ) : (
                  <span className="text-emerald-500 font-bold flex items-center gap-2">
                    <CheckCircle2 size={20} />
                    موجود در انبار فیت‌کالا
                  </span>
                )}
                {currentVariant && (
                  <span className="text-xs text-gray-400 font-mono">SKU: {currentVariant.sku}</span>
                )}
              </div>

              {/* ویژگی‌های گارانتی و اصالت */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <ShieldCheck size={20} className="text-gray-400 shrink-0" />
                  <span>ضمانت ۷ روزه اصالت و سلامت فیزیکی کالا</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <Truck size={20} className="text-gray-400 shrink-0" />
                  <span>ارسال سریع به سراسر کشور (رایگان بالای ۲ میلیون تومان)</span>
                </li>
                {currentVariant?.authenticity?.expiryDate && (
                  <li className="flex items-start gap-3 text-sm text-emerald-600 font-medium bg-emerald-50 p-2 rounded-lg">
                    <CheckCircle2 size={20} className="shrink-0" />
                    <span>تاریخ انقضا: {new Date(currentVariant.authenticity.expiryDate).toLocaleDateString('fa-IR')}</span>
                  </li>
                )}
              </ul>

              {/* بخش قیمت */}
              <div className="flex flex-col items-end mb-6">
                {hasDiscount && (
                  <div className="text-sm text-gray-400 line-through mb-1">
                    {formatPrice(currentVariant.price)}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-gray-900">{formatPrice(activePrice)}</span>
                  <span className="text-sm text-gray-500 font-bold">تومان</span>
                </div>
              </div>

              {/* دکمه افزودن به سبد خرید */}
              <button 
                disabled={isOutOfStock}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                  isOutOfStock 
                    ? 'bg-gray-100 text-gray-400 shadow-none cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-rose-500 text-white hover:shadow-primary/30 hover:-translate-y-1'
                }`}
              >
                <ShoppingCart size={22} />
                {isOutOfStock ? 'ناموجود' : 'افزودن به سبد خرید'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
