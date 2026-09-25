import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, Dumbbell, ChevronRight, CheckCircle2, AlertCircle, ShoppingCart, Activity, Star, MessageSquare, Send, Scale, Globe, Heart, HelpCircle, UserCheck, Flame, Award, DollarSign, Calendar, Layers } from 'lucide-react';
import useProductStore from '../../store/productStore';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import useCompareStore from '../../store/compareStore';
import useWishlistStore from '../../store/wishlistStore';
import ProductCard from '../../components/product/ProductCard';
import ProductImage from '../../components/common/ProductImage';
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
  const [bottomTab, setBottomTab] = useState('nutrition'); // nutrition | reviews | qa
  
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [questionText, setQuestionText] = useState('');
  const [questionsList, setQuestionsList] = useState([]);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);

  useEffect(() => {
    fetchProductDetail(slug);
    fetchProducts();
  }, [slug, fetchProductDetail, fetchProducts]);

  useEffect(() => {
    if (product?._id) {
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
    if (!user) return alert('برای ثبت نظر ابتدا وارد شوید.');
    setIsSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, { rating: reviewRating, comment: reviewComment });
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
    if (!user) return alert('برای ارسال سوال ابتدا وارد شوید.');
    if (!questionText.trim()) return;
    setIsSubmittingQuestion(true);
    try {
      const { data } = await api.post('/questions', { productId: product._id, question: questionText });
      alert('پرسش شما برای کارشناسان تغذیه Team 9 ارسال شد.');
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

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImgSrc = images[activeImageIndex] || null;
  const isFavorite = isInWishlist(product._id);

  const uniqueFlavors = [...new Set(product.variants?.map(v => v.flavor))].filter(Boolean);
  const uniqueWeights = [...new Set(product.variants?.map(v => v.weight))].filter(Boolean);

  const handleVariantChange = (type, value) => {
    const targetFlavor = type === 'flavor' ? value : currentVariant?.flavor;
    const targetWeight = type === 'weight' ? value : currentVariant?.weight;
    const found = product.variants.find(v => v.flavor === targetFlavor && v.weight === targetWeight);
    if (found) setCurrentVariant(found);
  };

  const activePrice = currentVariant?.discountPrice || currentVariant?.price || 0;
  const isOutOfStock = !currentVariant || currentVariant.stock === 0;

  // 🎯 محاسبه خودکار و دقیق ریاضی قیمت هر اسکوپ (سروینگ)
  const totalServings = Number(product.attributes?.servingsPerContainer) || 1;
  const costPerServing = Math.round(activePrice / totalServings);

  const relatedProducts = products.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);

  return (
    <div className="bg-gray-50 min-h-screen pb-28 lg:pb-20 pt-6 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex items-center text-xs text-gray-500 mb-6 gap-2">
          <Link to="/">تیم ۹</Link><ChevronRight size={14}/><span className="text-gray-800 font-bold">{product.title}</span>
        </nav>

        {/* جعبه اصلی کالا */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 flex flex-col lg:flex-row gap-10 mb-8 relative">
          <button 
            onClick={() => toggleWishlist(product)}
            className={`absolute top-6 left-6 p-3 rounded-2xl border transition-all z-10 ${
              isFavorite ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-md' : 'bg-gray-50 border-gray-200 text-gray-400 hover:text-rose-500'
            }`}
          >
            <Heart size={20} className={isFavorite ? 'fill-rose-500' : ''} />
          </button>

          {/* گالری چندعکسی با زوم تعاملی */}
          <div className="lg:w-5/12 flex flex-col items-center">
            <div 
              onMouseEnter={() => currentImgSrc && setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="w-full aspect-square bg-white rounded-3xl overflow-hidden cursor-zoom-in border border-gray-100 shadow-inner flex items-center justify-center p-4 relative select-none"
            >
              {currentImgSrc ? (
                <img 
                  src={currentImgSrc} 
                  alt={product.title}
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZooming ? 'scale(2.4)' : 'scale(1)',
                  }}
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-100 ease-out pointer-events-none"
                />
              ) : (
                <ProductImage category={product.category} alt={product.title} />
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto w-full p-2 justify-center">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-16 h-16 rounded-2xl border-2 overflow-hidden bg-white p-1 transition-all ${
                      activeImageIndex === i ? 'border-primary shadow-lg scale-105' : 'border-gray-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="نمای کالا" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            <button 
              onClick={() => addToCompare(product)}
              className="mt-6 w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm border border-gray-200 shadow-sm"
            >
              <Scale size={18} className="text-primary" /> مقایسه تخصصی این مکمل با سایر محصولات
            </button>
          </div>

          {/* شناسنامه کامل مکمل */}
          <div className="lg:w-7/12 flex flex-col">
            <h1 className="text-2xl font-black text-gray-900 leading-snug mb-3 pr-10">{product.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-6 pb-4 border-b border-gray-100">
              <span className="font-black text-dark bg-gray-100 px-3 py-1 rounded-lg uppercase font-mono">{product.brand}</span>
              <span className="flex items-center gap-1"><Globe size={14} className="text-blue-500"/> کشور: <strong>{product.attributes?.country || 'آمریکا'}</strong></span>
              <span className="flex items-center gap-1"><Dumbbell size={14} className="text-primary"/> هدف: <strong>{product.attributes?.targetGoal || 'عضله‌سازی'}</strong></span>
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-xl">
                <Star size={14} fill="currentColor" /> {product.rating ? product.rating.toFixed(1) : '۵.۰'} ({product.numReviews || 0} نظر)
              </div>
            </div>

            {/* کارت مشخصات فیزیکی و پیمانه */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-200 mb-6 text-xs">
              <div><span className="text-gray-400 block mb-0.5">فرم مکمل:</span><strong className="text-gray-800">{product.attributes?.form || 'پودر'}</strong></div>
              <div><span className="text-gray-400 block mb-0.5">حجم هر پیمانه:</span><strong className="text-gray-800">{product.attributes?.servingSize || '30 گرم'}</strong></div>
              <div><span className="text-gray-400 block mb-0.5">تعداد کل سروینگ:</span><strong className="text-primary font-black text-sm">{totalServings} اسکوپ</strong></div>
            </div>

            {/* طعم و وزن */}
            {currentVariant && (
              <div className="space-y-4 mb-6">
                {uniqueFlavors.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-gray-600 block mb-2">طعم: <strong className="text-dark font-black text-sm">{currentVariant.flavor}</strong></span>
                    <div className="flex flex-wrap gap-2">
                      {uniqueFlavors.map(flavor => (
                        <button 
                          key={flavor} 
                          onClick={() => handleVariantChange('flavor', flavor)} 
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            currentVariant.flavor === flavor ? 'border-primary bg-primary text-dark shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {flavor}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {uniqueWeights.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-gray-600 block mb-2">وزن: <strong className="text-dark font-black text-sm">{currentVariant.weight}</strong></span>
                    <div className="flex flex-wrap gap-2">
                      {uniqueWeights.map(weight => (
                        <button 
                          key={weight} 
                          onClick={() => handleVariantChange('weight', weight)} 
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                            currentVariant.weight === weight ? 'border-dark bg-dark text-primary shadow-md' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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

            {/* نشان‌های اصالت این بچ خاص */}
            {currentVariant && (
              <div className="flex flex-wrap items-center gap-4 py-3 border-t border-gray-100 text-[11px] text-gray-500 mb-6">
                <span className="font-mono">کد SKU: <strong>{currentVariant.sku}</strong></span>
                {currentVariant.sibSalamat && <span className="flex items-center gap-1 text-emerald-600 font-bold"><ShieldCheck size={14}/> سیب سلامت: {currentVariant.sibSalamat}</span>}
                {currentVariant.expiryDate && <span className="flex items-center gap-1 font-mono"><Calendar size={14}/> انقضا: {currentVariant.expiryDate}</span>}
              </div>
            )}

            {/* باکس قیمت کل + محاسبه خودکار قیمت هر اسکوپ */}
            <div className="mt-auto bg-gray-50 p-6 rounded-3xl border border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-gray-900">{formatPrice(activePrice)}</span>
                  <span className="text-sm font-bold text-gray-500">تومان</span>
                </div>
                {/* 🎯 ارزش خرید و قیمت هر اسکوپ */}
                <div className="text-[11px] font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <DollarSign size={13}/> قیمت هر ۱ اسکوپ مصرفی: {formatPrice(costPerServing)} تومان
                </div>
              </div>
              <button 
                disabled={isOutOfStock} 
                onClick={() => addToCart(product, currentVariant, 1)} 
                className={`w-full sm:w-auto px-10 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-dark hover:bg-primary-hover hover:-translate-y-1'
                }`}
              >
                <ShoppingCart size={20} /> {isOutOfStock ? 'ناموجود در انبار' : 'افزودن به سبد خرید'}
              </button>
            </div>
          </div>
        </div>

        {/* بخش جامع تب‌ها: جدول ارزش غذایی پویا | دستور مصرف | نظرات | پرسش و پاسخ */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="flex border-b border-gray-100 bg-gray-50/70 p-2 gap-2 overflow-x-auto">
            <button
              onClick={() => setBottomTab('nutrition')}
              className={`flex-1 min-w-[150px] py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                bottomTab === 'nutrition' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark'
              }`}
            >
              <Flame size={16} className={bottomTab === 'nutrition' ? 'text-primary' : ''}/>
              جدول ارزش غذایی (Nutrition Facts)
            </button>
            <button
              onClick={() => setBottomTab('guide')}
              className={`flex-1 min-w-[150px] py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                bottomTab === 'guide' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark'
              }`}
            >
              <Dumbbell size={16} className={bottomTab === 'guide' ? 'text-primary' : ''}/>
              طریقه و دستور مصرف
            </button>
            <button
              onClick={() => setBottomTab('reviews')}
              className={`flex-1 min-w-[150px] py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                bottomTab === 'reviews' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark'
              }`}
            >
              <MessageSquare size={16} className={bottomTab === 'reviews' ? 'text-primary' : ''}/>
              نظرات خریداران ({product.reviews?.length || 0})
            </button>
            <button
              onClick={() => setBottomTab('qa')}
              className={`flex-1 min-w-[150px] py-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                bottomTab === 'qa' ? 'bg-white text-dark shadow-sm' : 'text-gray-500 hover:text-dark'
              }`}
            >
              <HelpCircle size={16} className={bottomTab === 'qa' ? 'text-primary' : ''}/>
              مشاوره مربیان ({questionsList.length})
            </button>
          </div>

          <div className="p-8">
            
            {/* تب ۱: جدول رسمی Nutrition Facts */}
            {bottomTab === 'nutrition' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-black text-gray-900 text-sm mb-1">جدول رسمی ترکیبات و ارزش غذایی</h3>
                  <p className="text-xs text-gray-400">اندازه هر سروینگ: {product.attributes?.servingSize || '30 گرم'} | تعداد کل سروینگ در قوطی: {totalServings} اسکوپ</p>
                </div>

                {(!product.nutritionFacts || product.nutritionFacts.length === 0) ? (
                  <p className="text-xs text-gray-400">جدول ترکیبات برای این محصول ثبت نشده است.</p>
                ) : (
                  <div className="border border-gray-200 rounded-2xl overflow-hidden max-w-2xl">
                    <table className="w-full text-xs text-right border-collapse">
                      <thead className="bg-gray-100 text-gray-700 font-black border-b border-gray-200">
                        <tr>
                          <th className="p-3.5">ماده مغذی / ترکیب فعال</th>
                          <th className="p-3.5 text-center">مقدار در هر اسکوپ</th>
                          <th className="p-3.5 text-center">درصد نیاز روزانه (%DV)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {product.nutritionFacts.map((row, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/60">
                            <td className="p-3.5 font-bold text-gray-800">{row.ingredient}</td>
                            <td className="p-3.5 text-center font-black text-primary font-mono text-sm">{row.amount}</td>
                            <td className="p-3.5 text-center text-gray-400 font-mono">{row.dailyValue || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* تب ۲: راهنما و دستور مصرف */}
            {bottomTab === 'guide' && (
              <div className="space-y-4 max-w-3xl leading-relaxed text-sm text-gray-700">
                <h3 className="font-black text-gray-900 text-base">بهترین طریقه و زمان مصرف</h3>
                <p className="p-5 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs font-bold text-amber-900">
                  {product.attributes?.usageGuide || 'یک اسکوپ را در ۲۵۰ میلی‌لیتر آب یا شیر کم‌چرب حل کرده و میل نمایید.'}
                </p>
                <div className="pt-4 space-y-2">
                  <h4 className="font-bold text-gray-800 text-xs">نقد و بررسی کامل مکمل:</h4>
                  <p className="text-xs text-gray-600 leading-relaxed text-justify">{product.description}</p>
                </div>
              </div>
            )}

            {/* تب ۳: نظرات خریداران */}
            {bottomTab === 'reviews' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <form onSubmit={handleSendReview} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm">ثبت تجربه مصرف مکمل</h3>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button type="button" key={s} onClick={() => setReviewRating(s)}>
                          <Star size={22} className={s <= reviewRating ? "text-amber-400 fill-amber-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                    <textarea required rows="4" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="کیفیت، طعم و نحوه مصرف..." className="w-full p-4 bg-white border rounded-xl text-xs outline-none focus:border-primary resize-none"></textarea>
                    <button type="submit" disabled={isSubmittingReview} className="w-full bg-dark text-primary font-black py-3 rounded-xl hover:bg-gray-800 text-xs flex items-center justify-center gap-2">
                      <Send size={14}/> {isSubmittingReview ? 'در حال ثبت...' : 'ثبت نظر'}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {(!product.reviews || product.reviews.length === 0) ? (
                    <div className="text-center py-12 text-gray-400 font-bold">هنوز نظری ثبت نشده است.</div>
                  ) : (
                    product.reviews.map((rev) => (
                      <div key={rev._id} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-gray-900 text-sm">{rev.name}</span>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, idx) => <Star key={idx} size={14} className={idx < rev.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed pt-2">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* تب ۴: پرسش و پاسخ مربیان */}
            {bottomTab === 'qa' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <form onSubmit={handleSendQuestion} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                    <h3 className="font-bold text-gray-900 text-sm">پرسش تخصصی از مربی</h3>
                    <textarea required rows="4" value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="سوال درباره دوز مصرفی، تداخل یا دوره مکمل..." className="w-full p-4 bg-white border rounded-xl text-xs outline-none focus:border-primary resize-none"></textarea>
                    <button type="submit" disabled={isSubmittingQuestion} className="w-full bg-dark text-primary font-black py-3 rounded-xl hover:bg-gray-800 text-xs flex items-center justify-center gap-2">
                      <Send size={14}/> {isSubmittingQuestion ? 'در حال ارسال...' : 'ارسال به مربیان Team 9'}
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2 space-y-4">
                  {questionsList.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-bold">هنوز پرسشی ثبت نشده است.</div>
                  ) : (
                    questionsList.map((qa) => (
                      <div key={qa._id} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-700 text-xs font-bold flex items-center justify-center">؟</span>
                          <span className="font-bold text-xs text-gray-800">{qa.authorName}</span>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium pr-8">{qa.question}</p>
                        {qa.isAnswered && (
                          <div className="mr-8 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs text-gray-700">
                            <strong className="block text-amber-800 mb-1">{qa.answeredBy}:</strong>
                            {qa.answer}
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

        {/* مکمل‌های پیشنهادی دوره */}
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
