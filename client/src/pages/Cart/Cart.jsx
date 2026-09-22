import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Ticket, Loader2, CheckCircle2, X } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const Cart = () => {
  const { 
    cartItems, addToCart, removeFromCart, deleteItem, 
    cartTotalPrice, appliedCoupon, setCoupon, removeCoupon, 
    cartDiscountAmount, cartFinalPrice 
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ text: '', type: '' });

  const basePrice = cartTotalPrice();
  const discountAmount = cartDiscountAmount();
  const payablePrice = cartFinalPrice();

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setLoadingCoupon(true);
    setCouponMsg({ text: '', type: '' });

    try {
      const { data } = await api.post('/coupons/validate', {
        code: couponInput.trim(),
        cartValue: basePrice,
      });
      setCoupon(data);
      setCouponMsg({ text: `کد تخفیف ${data.code} با موفقیت اعمال شد!`, type: 'success' });
      setCouponInput('');
    } catch (err) {
      setCouponMsg({ text: err.response?.data?.message || 'کد تخفیف نامعتبر است', type: 'error' });
    } finally {
      setLoadingCoupon(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4 font-sans">
        <ShoppingBag size={70} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-black text-gray-800 mb-2">سبد خرید شما خالی است!</h1>
        <p className="text-gray-400 mb-6 text-sm">مکمل‌های مورد نیاز خود را به سبد اضافه کنید.</p>
        <Link to="/" className="bg-dark text-primary font-bold px-8 py-3.5 rounded-2xl hover:bg-gray-800 transition-colors text-sm">
          مشاهده مکمل‌های فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* لیست اقلام سبد */}
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div key={item.variant.sku} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl p-2 border border-gray-100 shrink-0">
                    <img src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600'} alt={item.product.title} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <Link to={`/product/${item.product.slug}`} className="font-bold text-gray-900 text-sm line-clamp-1 hover:text-primary mb-1">
                      {item.product.title}
                    </Link>
                    <span className="text-xs text-gray-500 block font-bold">طعم: {item.variant.flavor} | وزن: {item.variant.weight}</span>
                    <span className="text-xs text-gray-400 font-mono block mt-1">SKU: {item.variant.sku}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                    <button onClick={() => addToCart(item.product, item.variant, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-dark"><Plus size={14}/></button>
                    <span className="w-10 text-center font-black text-sm text-gray-900">{item.qty}</span>
                    <button onClick={() => removeFromCart(item.variant.sku)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-rose-500"><Minus size={14}/></button>
                  </div>

                  <div className="text-left">
                    <span className="font-black text-base text-gray-900 block">{formatPrice((item.variant.discountPrice || item.variant.price) * item.qty)}</span>
                    <span className="text-[10px] text-gray-400 font-bold">تومان</span>
                  </div>

                  <button onClick={() => deleteItem(item.variant.sku)} className="text-gray-300 hover:text-rose-500 p-1 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* فاکتور مالی و بخش کد تخفیف */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24 space-y-6">
              <h2 className="font-black text-base text-gray-900 pb-3 border-b border-gray-100">خلاصه فاکتور خرید</h2>

              {/* کادر ورودی کد تخفیف */}
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2 flex items-center gap-1.5">
                  <Ticket size={16} className="text-primary"/> کد تخفیف دارید؟
                </label>

                {appliedCoupon ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-emerald-800 font-mono block">{appliedCoupon.code}</span>
                      <span className="text-[10px] text-emerald-600">٪{appliedCoupon.discountPercent} تخفیف اعمال شد</span>
                    </div>
                    <button onClick={removeCoupon} className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-xl transition-colors" title="حذف کوپن">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      dir="ltr" 
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="مثال: FIT-20"
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary font-mono text-sm uppercase text-left font-bold"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={loadingCoupon || !couponInput.trim()}
                      className="bg-dark hover:bg-gray-800 text-primary font-black px-5 rounded-xl text-xs transition-all disabled:opacity-50"
                    >
                      {loadingCoupon ? <Loader2 className="animate-spin" size={16}/> : 'اعمال'}
                    </button>
                  </div>
                )}

                {couponMsg.text && (
                  <p className={`text-[11px] font-bold mt-2 ${couponMsg.type === 'error' ? 'text-rose-500' : 'text-emerald-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* ردیف‌های قیمت */}
              <div className="space-y-3 pt-2 text-xs font-bold text-gray-600 border-t border-gray-100">
                <div className="flex justify-between">
                  <span>مجموع ارزش کالاها:</span>
                  <span>{formatPrice(basePrice)} تومان</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>کسر تخفیف کوپن:</span>
                    <span>- {formatPrice(discountAmount)} تومان</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500">
                  <span>هزینه بسته‌بندی و ارسال:</span>
                  <span className="text-emerald-600">رایگان (ویژه Team 9)</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="font-black text-gray-900 text-sm">مبلغ نهایی پرداخت:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-gray-900">{formatPrice(payablePrice)}</span>
                  <span className="text-xs font-bold text-gray-500">تومان</span>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="w-full bg-primary hover:bg-primary-hover text-dark font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
              >
                تکمیل اطلاعات و ثبت سفارش <ArrowLeft size={18}/>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
