import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Dumbbell, ChevronRight, CheckCircle2, AlertCircle, ShoppingCart, Activity, Star, MessageSquare, Send } from 'lucide-react';
import useProductStore from '../../store/productStore';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import { formatPrice, calculateDiscountPercentage } from '../../utils/formatters';

const ProductDetail = () => {
  const { slug } = useParams();
  const { productDetail: product, fetchProductDetail, isLoading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  
  const [currentVariant, setCurrentVariant] = useState(null);
  const [imgError, setImgError] = useState(false);
  
  // State برای ثبت نظر جدید
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    fetchProductDetail(slug);
  }, [slug, fetchProductDetail]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstAvailable = product.variants.find(v => v.stock > 0) || product.variants[0];
      setCurrentVariant(firstAvailable);
    }
  }, [product]);

  if (isLoading) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50"><Activity className="animate-spin text-primary mb-4" size={48} /></div>;
  if (error || !product) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50"><AlertCircle className="text-red-500 mb-4" size={48} /><Link to="/">بازگشت</Link></div>;

  const validImageUrl = product.images?.[0] && !product.images[0].includes('placeholder') ? product.images[0] : null;
  const uniqueFlavors = [...new Set(product.variants.map(v => v.flavor))].filter(Boolean);
  const uniqueWeights = [...new Set(product.variants.map(v => v.weight))].filter(Boolean);

  const handleVariantChange = (type, value) => {
    const targetFlavor = type === 'flavor' ? value : currentVariant.flavor;
    const targetWeight = type === 'weight' ? value : currentVariant.weight;
    const foundVariant = product.variants.find(v => v.flavor === targetFlavor && v.weight === targetWeight);
    if (foundVariant) setCurrentVariant(foundVariant);
    else {
      const fallbackVariant = product.variants.find(v => v[type] === value);
      if (fallbackVariant) setCurrentVariant(fallbackVariant);
    }
  };

  const submitReview = (e) => {
    e.preventDefault();
    if(!user) return alert('برای ثبت نظر ابتدا وارد حساب کاربری شوید.');
    setIsSubmittingReview(true);
    setTimeout(() => {
      setIsSubmittingReview(false);
      setComment('');
      setRating(5);
      alert('نظر شما با موفقیت ثبت شد و پس از تایید مدیریت نمایش داده می‌شود.');
    }, 1000);
  };

  const activePrice = currentVariant?.discountPrice || currentVariant?.price || 0;
  const isOutOfStock = currentVariant?.stock === 0;

  // نظرات نمایشی (Mock)
  const mockReviews = [
    { id: 1, user: 'علی حسینی', rating: 5, date: '۱۴۰۲/۰۹/۱۲', text: 'طعم دابل چاکلتش بی‌نظیره، خیلی راحت تو آب حل میشه و اصلا گلوله نمیشه. کاملا اورجینال بود.' },
    { id: 2, user: 'کاربر ناشناس', rating: 4, date: '۱۴۰۲/۰۸/۲۵', text: 'کیفیت خوبی داره ولی کاش هزینه‌های ارسال کمی کمتر بود.' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex items-center text-xs text-gray-500 mb-6 gap-2"><Link to="/">تیم ۹</Link><ChevronRight size={14}/><span className="text-gray-800 font-bold">{product.title}</span></nav>

        {/* بخش اصلی محصول */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 md:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12 mb-8">
          <div className="lg:w-1/3 flex flex-col">
            <div className="w-full aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 relative group overflow-hidden p-6">
              {validImageUrl && !imgError ? (
                <img src={validImageUrl} alt={product.title} onError={() => setImgError(true)} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <Dumbbell size={120} strokeWidth={0.5} className="text-gray-300 group-hover:scale-110 transition-transform duration-700" />
              )}
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col">
            <h1 className="text-2xl font-black text-gray-900 leading-tight mb-2">{product.title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-gray-400 font-medium uppercase">{product.brand}</span>
              <div className="flex items-center gap-1 text-amber-400 bg-amber-50 px-2 py-1 rounded-lg text-xs font-bold"><Star size={14} fill="currentColor"/> 4.5 <span className="text-gray-400 font-normal mr-1">(12 نظر)</span></div>
            </div>

            {currentVariant && (
              <div className="space-y-6 mb-8 border-b border-gray-100 pb-8">
                {uniqueFlavors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-3">طعم: <span className="text-gray-500 font-normal">{currentVariant.flavor}</span></h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueFlavors.map(flavor => (
                        <button key={flavor} onClick={() => handleVariantChange('flavor', flavor)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${currentVariant.flavor === flavor ? 'border-primary bg-primary text-dark shadow-sm' : 'border-gray-200 text-gray-600'}`}>{flavor}</button>
                      ))}
                    </div>
                  </div>
                )}
                {uniqueWeights.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-3">وزن: <span className="text-gray-500 font-normal">{currentVariant.weight}</span></h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueWeights.map(weight => (
                        <button key={weight} onClick={() => handleVariantChange('weight', weight)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${currentVariant.weight === weight ? 'border-dark bg-dark text-primary shadow-sm' : 'border-gray-200 text-gray-600'}`}>{weight}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="text-sm text-gray-600 leading-relaxed text-justify">{product.description}</div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                {isOutOfStock ? <span className="text-rose-500 font-bold flex items-center gap-2"><AlertCircle size={20}/>ناموجود</span> : <span className="text-emerald-500 font-bold flex items-center gap-2"><CheckCircle2 size={20}/>موجود</span>}
              </div>
              <div className="flex flex-col items-end mb-6">
                <div className="flex items-center gap-2"><span className="text-3xl font-black text-gray-900">{formatPrice(activePrice)}</span><span className="text-sm text-gray-500 font-bold">تومان</span></div>
              </div>
              <button disabled={isOutOfStock} onClick={() => addToCart(product, currentVariant, 1)} className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${isOutOfStock ? 'bg-gray-100 text-gray-400' : 'bg-primary text-dark hover:-translate-y-1'}`}>
                <ShoppingCart size={22} /> {isOutOfStock ? 'ناموجود' : 'افزودن به سبد خرید'}
              </button>
            </div>
          </div>
        </div>

        {/* بخش نظرات کاربران */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
            <MessageSquare className="text-primary" size={24} />
            <h2 className="text-xl font-black text-gray-900">نظرات کاربران</h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* فرم ثبت نظر */}
            <div className="lg:w-1/3">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">دیدگاه خود را بنویسید</h3>
                {!user ? (
                  <div className="text-sm text-gray-500 bg-white p-4 rounded-xl border border-gray-200 text-center">
                    برای ثبت نظر باید <Link to="/login" className="text-primary font-bold hover:underline mx-1">وارد حساب</Link> شوید.
                  </div>
                ) : (
                  <form onSubmit={submitReview} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">امتیاز شما به این محصول</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none">
                            <Star size={24} className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-2">متن دیدگاه</label>
                      <textarea required value={comment} onChange={(e) => setComment(e.target.value)} rows="4" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-primary resize-none text-sm" placeholder="نقطه نظرات، تجربه مصرف و..."></textarea>
                    </div>
                    <button type="submit" disabled={isSubmittingReview} className="w-full bg-dark text-primary hover:bg-gray-800 font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                      {isSubmittingReview ? <Activity className="animate-spin" size={18}/> : <><Send size={18}/> ثبت دیدگاه</>}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* لیست نظرات */}
            <div className="lg:w-2/3 space-y-6">
              {mockReviews.map((review) => (
                <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">{review.user.charAt(0)}</div>
                      <div>
                        <span className="block font-bold text-gray-800 text-sm">{review.user}</span>
                        <span className="text-xs text-gray-400">{review.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed pr-12">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default ProductDetail;
