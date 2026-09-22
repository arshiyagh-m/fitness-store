import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Ticket, Loader2 } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, deleteItem, cartTotalPrice } = useCartStore();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const baseTotal = cartTotalPrice();
  // محاسبه تخفیف کوپن
  let couponDiscount = 0;
  if (appliedCoupon) {
    let calculated = (baseTotal * appliedCoupon.discountPercent) / 100;
    couponDiscount = calculated > appliedCoupon.maxDiscount ? appliedCoupon.maxDiscount : calculated;
  }
  const finalTotal = baseTotal - couponDiscount;

  const handleApplyCoupon = async () => {
    if(!couponCode) return;
    setCouponLoading(true); setCouponError('');
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode, cartValue: baseTotal });
      setAppliedCoupon(data);
    } catch (err) { setCouponError(err.response?.data?.message || 'کد نامعتبر است'); }
    setCouponLoading(false);
  };

  if (cartItems.length === 0) return <div className="text-center py-20 font-bold text-xl"><ShoppingBag className="mx-auto mb-4" size={64}/>سبد خرید خالی است.<br/><Link to="/" className="text-primary mt-4 inline-block">بازگشت به فروشگاه</Link></div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.variant.sku} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col flex-grow">
                  <Link to={`/product/${item.product.slug}`} className="text-lg font-bold text-gray-900 mb-2">{item.product.title}</Link>
                  <span className="text-sm font-bold text-gray-500 mb-4">{item.variant.flavor} - {item.variant.weight}</span>
                  <div className="flex justify-between items-end">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                      <button onClick={()=>addToCart(item.product, item.variant, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-gray-600"><Plus size={16}/></button>
                      <span className="w-10 text-center font-bold text-gray-800">{item.qty}</span>
                      <button onClick={()=>removeFromCart(item.variant.sku)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg text-gray-600"><Minus size={16}/></button>
                    </div>
                    <div className="text-xl font-black text-gray-900">{formatPrice((item.variant.discountPrice || item.variant.price) * item.qty)} <span className="text-xs">تومان</span></div>
                  </div>
                </div>
                <button onClick={()=>deleteItem(item.variant.sku)} className="self-start p-2 text-gray-400 hover:text-rose-500"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border-2 border-gray-100 p-6 sticky top-24">
              
              {/* بخش کد تخفیف */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3"><Ticket size={18} className="text-primary"/> کد تخفیف دارید؟</label>
                <div className="flex gap-2">
                  <input type="text" dir="ltr" value={couponCode} onChange={e=>setCouponCode(e.target.value)} disabled={appliedCoupon} className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary uppercase font-bold text-sm" placeholder="TEAM9..." />
                  {!appliedCoupon ? (
                    <button onClick={handleApplyCoupon} disabled={couponLoading} className="bg-dark text-primary font-bold px-4 rounded-xl flex items-center justify-center">{couponLoading ? <Loader2 className="animate-spin" size={18}/> : 'ثبت'}</button>
                  ) : (
                    <button onClick={()=>{setAppliedCoupon(null); setCouponCode('');}} className="bg-rose-50 text-rose-500 font-bold px-4 rounded-xl">حذف</button>
                  )}
                </div>
                {couponError && <p className="text-rose-500 text-xs font-bold mt-2">{couponError}</p>}
                {appliedCoupon && <p className="text-emerald-500 text-xs font-bold mt-2">کد تخفیف با موفقیت اعمال شد!</p>}
              </div>

              <div className="space-y-4 mb-6 text-sm font-bold text-gray-600">
                <div className="flex justify-between"><span>مبلغ کالاها</span><span>{formatPrice(baseTotal)} تومان</span></div>
                {appliedCoupon && <div className="flex justify-between text-emerald-500"><span>تخفیف کوپن</span><span>- {formatPrice(couponDiscount)} تومان</span></div>}
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-6">
                <span className="font-bold text-gray-800">مبلغ نهایی</span>
                <span className="text-2xl font-black text-gray-900">{formatPrice(finalTotal)} <span className="text-sm font-bold text-gray-500">تومان</span></span>
              </div>
              <Link to="/checkout" className="w-full bg-primary hover:bg-primary-hover text-dark font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
                تکمیل اطلاعات ارسال <ArrowLeft size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;
