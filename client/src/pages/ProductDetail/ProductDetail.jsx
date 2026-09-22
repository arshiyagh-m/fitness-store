import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Dumbbell, ChevronRight, CheckCircle2, AlertCircle, ShoppingCart, Activity, Star, MessageSquare, Send, Scale, Globe, Heart, HelpCircle, UserCheck } from 'lucide-react';
import useProductStore from '../../store/productStore';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import useCompareStore from '../../store/compareStore';
import useWishlistStore from '../../store/wishlistStore';
import ProductCard from '../../components/product/ProductCard';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

const ProductDetail = () => {
  const { slug } = useParams();
  const { productDetail: product, products, fetchProductDetail, fetchProducts, isLoading, error } = useProductStore();
  const { addToCart } = useCartStore();
  const { user } = useAuthStore();
  const { addToCompare } = useCompareStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();
  
  const [currentVariant, setCurrentVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // تب‌های پایین صفحه: نظرات کاربران یا پرسش و پاسخ
  const [bottomTab, setBottomTab] = useState('reviews'); // reviews | qa
  
  // زوم
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  // ثبت نظر
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // پرسش و پاسخ
  const [questionText, setQuestionText] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  useEffect(() => {
    fetchProductDetail(slug);
    fetchProducts();
  }, [slug, fetchProductDetail, fetchProducts]);

  useEffect(() => {
    if (product?._id) {
      // فراخوانی سوالات واقعی محصول از دیتابیس
      api.get(`/questions/product/${product._id}`).then(res => setQuestionsList(res.data)).catch(() => {});
    }
  }, [product]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      const firstAvailable = product.variants.find(v => v.stock > 0) || product.variants[0];
      setCurrentVariant(firstAvailable);
    }
    setActiveImageIndex(0);
  }, [product]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleSendReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('برای ثبت نظر لطفاً وارد شوید.');
    setIsSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      alert('نظر شما با موفقیت ثبت شد!');
      setReviewComment('');
      fetchProductDetail(slug);
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در ثبت نظر');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleSendQuestion = async (e) => {
    e.preventDefault();
    if (!user) return alert('برای ثبت سوال لطفاً وارد شوید.');
    if (!questionText.trim()) return;
    setIsSubmittingQuestion(true);
    try {
      const { data } = await api.post('/questions', {
        productId: product._id,
        question: questionText,
      });
      alert('پرسش شما برای کارشناسان تغذیه ارسال شد!');
      setQuestionsList([data, ...questionsList]);
      setQuestionText('');
    } catch (err) {
      alert('خطا در ثبت پرسش');
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Activity className="animate-spin text-primary" size={48} /></div>;
  if (error || !product) return <div className="text-center py-20 font-bold"><AlertCircle size={48} className="mx-auto text-red-500 mb-4"/><Link to="/">بازگشت به فروشگاه</Link></div>;

  const images = product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600'];
  const activeImg = images[activeImageIndex] || images[0];
  const isFavorite = isInWishlist(product._id);

  const uniqueFlavors = [...new Set(product.variants?.map(v => v.flavor))].filter(Boolean);
  const uniqueWeights = [...new Set(product.variants?.map(v => v.weight))].filter(Boolean);

  const handleVariantChange = (type, value) => {
    const targetFlavor = type === 'flavor' ? value : currentVariant.flavor;
    const targetWeight = type === 'weight' ? value : currentVariant.weight;
    const found = product.variants.find(v => v.flavor === targetFlavor && v.weight === targetWeight);
    if (found) setCurrentVariant(found);
  };

  const activePrice = currentVariant?.discountPrice || currentVariant?.price || 0;
  const isOutOfStock = currentVariant?.stock === 0;
  const relatedProducts = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex items-center text-xs text-gray-500 mb-6 gap-2">
          <Link to="/">تیم ۹</Link><ChevronRight size={14}/><span className="text-gray-800 font-bold">{product.title}</span>
        </nav>

        {/* جعبه اصلی محصول */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col lg:flex-row gap-10 mb-8 relative">
          <button 
            onClick={() => toggleWishlist(product)}
            className={`absolute top-6 left-6 p-3 rounded-2xl border transition-all z-10 ${isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-md' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-rose-500'}`}
          >
            <Heart size={20} className={isFavorite ? 'fill-rose-500' : ''} />
          </button>

          {/* گالری و زوم */}
          <div className="lg:w-5/12 flex flex-col items-center">
            <div 
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="w-full aspect-square bg-white rounded-3xl overflow-hidden cursor-zoom-in border border-gray-100 shadow-inner flex items-center justify-center p-4 relative select-none"
            >
              <img 
                src={activeImg} 
                alt={product.title}
                style={{
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZooming ? 'scale(2.4)' : 'scale(1)',
                }}
                className="w-full h-full object-contain transition-transform duration-100 ease-out pointer-events-none"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto w-full p-2 justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-16 h-16 rounded-2xl border-2 overflow-hidden bg-white p-1 transition-all ${activeImageIndex === i ? 'border-primary shadow-lg scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt="نمای کوچک" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            <button 
              onClick={() => addToCompare(product)}
              className="mt-6 w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm border border-gray-200 shadow-sm"
            >
              <Scale size={18} className="text-primary" /> مقایسه تخصصی این مکمل
            </button>
          </div>

          {/* اطلاعات محصول */}
          <div className="lg:w-7/12 flex flex-col">
            <h1 className="text-2xl font-black text-gray-900 leading-snug mb-3 pr-10">{product.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-6 pb-4 border-b border-gray-100">
              <span className="font-bold text-dark bg-gray-100 px-3 py-1 rounded-lg uppercase">{product.brand}</span>
              <span className="flex items-center gap-1"><Globe size={14}/> مبدا: <strong>{product.attributes?.country || 'آمریکا'}</strong></span>
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-xl">
                <Star size={14} fill="currentColor" /> {product.rating || 5} ({product.numReviews || 0} نظر)
              </div>
            </div>

            {currentVariant && (
              <div className="space-y-6 mb-6">
                {uniqueFlavors.length > 0 && (
                  <div>
                    <span className="text-sm font-bold text-gray-800 block mb-2">طعم: <span className="text-primary font-black">{currentVariant.flavor}</span></span>
                    <div className="flex flex-wrap gap-2">
                      {uniqueFlavors.map(flavor => (
                        <button key={flavor} onClick={() => handleVariantChange('flavor', flavor)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${currentVariant.flavor === flavor ? 'border-primary bg-primary text-dark shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{flavor}</button>
                      ))}
                    </div>
                  </div>
                )}
                {uniqueWeights.length > 0 && (
                  <div>
                    <span className="text-sm font-bold text-gray-800 block mb-2">وزن: <span className="text-dark font-black">{currentVariant.weight}</span></span>
                    <div className="flex flex-wrap gap-2">
                      {uniqueWeights.map(weight => (
                        <button key={weight} onClick={() => handleVariantChange('weight', weight)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${currentVariant.weight === weight ? 'border-dark bg-dark text-primary shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{weight}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* کارت قیمت و دکمه خرید */}
            <div className="mt-auto bg-gray-50 p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <span className="text-xs text-gray-400 block mb-1">قیمت برای مصرف کننده:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">{formatPrice(activePrice)}</span>
                  <span className="text-sm font-bold text-gray-500">تومان</span>
                </div>
              </div>
              <button 
                disabled={isOutOfStock} 
                onClick={() => addToCart(product, currentVariant, 1)} 
                className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-dark hover:bg-primary-hover hover:-translate-y-1'}`}
              >
                <ShoppingCart size={20} /> {isOutOfStock ? 'ناموجود در انبار' : 'افزودن به سبد خرید'}
              </button>
            </div>
          </div>
        </div>

        {/* بخش جادویی دوگانه: تب‌های نظرات کاربران و پرسش و پاسخ مربیان */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          
          {/* نوار انتخاب تب‌ها */}
          <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-2">
            <button
              onClick={() => setBottomTab('reviews')}
              className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                bottomTab === 'reviews' 
                  ? 'bg-white text-dark shadow-sm' 
                  : 'text-gray-500 hover:text-dark'
              }`}
            >
              <MessageSquare size={18} className={bottomTab === 'reviews' ? 'text-primary' : ''}/>
              نظرات و نقد کاربران ({product.reviews?.length || 0})
            </button>
            <button
              onClick={() => setBottomTab('qa')}
              className={`flex-1 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                bottomTab === 'qa' 
                  ? 'bg-white text-dark shadow-sm' 
                  : 'text-gray-500 hover:text-dark'
              }`}
            >
              <HelpCircle size={18} className={bottomTab === 'qa' ? 'text-primary' : ''}/>
              پرسش و پاسخ و مشاوره مربیان ({questionsList.length})
            </button>
          </div>

          <div className="p-8">
            
            {/* تب ۱: نظرات و ستاره‌های کاربران */}
            {bottomTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <form onSubmit={handleSendReview} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm">ثبت نظر و امتیاز</h3>
                    <div>
                      <span className="block text-xs font-bold text-gray-500 mb-2">امتیاز شما به مکمل:</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button type="button" key={s} onClick={() => setReviewRating(s)}>
                            <Star size={22} className={s <= reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea 
                      required 
                      rows="4" 
                      value={reviewComment} 
                      onChange={(e) => setReviewComment(e.target.value)} 
                      placeholder="کیفیت، طعم و نحوه مصرف خود را بنویسید..." 
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-primary resize-none"
                    ></textarea>
                    <button type="submit" disabled={isSubmittingReview} className="w-full bg-dark text-primary font-black py-3 rounded-xl hover:bg-gray-800 text-xs flex items-center justify-center gap-2">
                      <Send size={14}/> {isSubmittingReview ? 'در حال ارسال...' : 'ثبت نظر'}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {(!product.reviews || product.reviews.length === 0) ? (
                    <div className="text-center py-12 text-gray-400 font-bold">اولین نفری باشید که برای این مکمل نظر ثبت می‌کند!</div>
                  ) : (
                    product.reviews.map((rev) => (
                      <div key={rev._id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900 text-sm">{rev.name}</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, idx) => (
                              <Star key={idx} size={14} className={idx < rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed pt-2">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* تب ۲: پرسش و پاسخ تخصصی متصل به دیتابیس */}
            {bottomTab === 'qa' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <form onSubmit={handleSendQuestion} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm">پرسش از کارشناسان تغذیه</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      سوالات دوره، دوز مصرفی و تداخلات این مکمل را بپرسید تا توسط مربیان Team 9 در پنل ادمین پاسخ داده شود.
                    </p>
                    <textarea 
                      required 
                      rows="4" 
                      value={questionText} 
                      onChange={(e) => setQuestionText(e.target.value)} 
                      placeholder="سوال خود را تایپ کنید..." 
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-primary resize-none"
                    ></textarea>
                    <button type="submit" disabled={isSubmittingQuestion} className="w-full bg-dark text-primary font-black py-3 rounded-xl hover:bg-gray-800 text-xs flex items-center justify-center gap-2">
                      <Send size={14}/> {isSubmittingQuestion ? 'در حال ارسال...' : 'ارسال سوال به مربی'}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {questionsList.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-bold">هنوز پرسشی برای این مکمل ثبت نشده است.</div>
                  ) : (
                    questionsList.map((qa) => (
                      <div key={qa._id} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center">؟</span>
                          <span className="font-bold text-xs text-gray-800">{qa.authorName}</span>
                          <span className="text-[10px] text-gray-400">({new Date(qa.createdAt).toLocaleDateString('fa-IR')})</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium pr-8">{qa.question}</p>

                        {qa.isAnswered ? (
                          <div className="mr-8 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-black text-amber-800">
                              <UserCheck size={16} className="text-amber-600" />
                              <span>{qa.answeredBy}</span>
                            </div>
                            <p className="text-xs text-gray-700 leading-relaxed pr-5">{qa.answer}</p>
                          </div>
                        ) : (
                          <div className="mr-8 text-xs text-gray-400 italic bg-gray-50 p-2.5 rounded-xl">
                            در انتظار بررسی و پاسخ مربی تغذیه در پنل مدیریت...
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* محصولات مرتبط */}
        {relatedProducts.length > 0 && (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <Dumbbell className="text-primary" /> مکمل‌های پیشنهادی برای دوره همزمان
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(rel => <ProductCard key={rel._id} product={rel} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;
