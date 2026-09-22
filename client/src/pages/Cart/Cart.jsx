import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft, Dumbbell, ShieldCheck } from 'lucide-react';
import useCartStore from '../../store/cartStore';
import { formatPrice } from '../../utils/formatters';

const Cart = () => {
  const { cartItems, addToCart, removeFromCart, deleteItem, cartTotalPrice, cartTotalOriginalPrice } = useCartStore();
  const totalPrice = cartTotalPrice();
  const originalPrice = cartTotalOriginalPrice();
  const totalDiscount = originalPrice - totalPrice;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-6"><ShoppingBag size={64} className="text-gray-400" /></div>
        <h2 className="text-2xl font-black text-gray-800 mb-2">سبد خرید شما خالی است!</h2>
        <Link to="/" className="bg-dark text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-gray-800 transition-colors flex items-center gap-2 mt-4">بازگشت به فروشگاه <ArrowLeft size={20} /></Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="p-2 bg-white rounded-xl shadow-sm"><ArrowRight size={20} className="text-gray-600" /></Link>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><ShoppingBag size={28} className="text-primary" /> سبد خرید</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 flex flex-col gap-4">
            {cartItems.map((item) => (
              <div key={item.variant.sku} className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center shrink-0"><Dumbbell size={48} className="text-gray-300" /></div>
                <div className="flex flex-col flex-grow">
                  <Link to={`/product/${item.product.slug}`} className="text-lg font-bold text-gray-900 hover:text-primary mb-2">{item.product.title}</Link>
                  <div className="mt-auto flex justify-between items-end">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                      <button onClick={() => addToCart(item.product, item.variant, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600"><Plus size={16}/></button>
                      <span className="w-10 text-center font-bold text-gray-800">{item.qty}</span>
                      <button onClick={() => removeFromCart(item.variant.sku)} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600"><Minus size={16}/></button>
                    </div>
                    <div className="text-xl font-black text-gray-900">{formatPrice((item.variant.discountPrice || item.variant.price) * item.qty)} <span className="text-sm font-bold text-gray-500">تومان</span></div>
                  </div>
                </div>
                <button onClick={() => deleteItem(item.variant.sku)} className="self-start p-2 text-gray-400 hover:text-rose-500"><Trash2 size={20} /></button>
              </div>
            ))}
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl shadow-sm border-2 border-gray-100 p-6 sticky top-24">
              <h3 className="text-lg font-black text-gray-900 mb-6 pb-4 border-b border-gray-100">خلاصه سفارش</h3>
              <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-6">
                <span className="font-bold text-gray-800">مبلغ قابل پرداخت</span>
                <span className="text-2xl font-black text-gray-900">{formatPrice(totalPrice)} <span className="text-sm text-gray-500">تومان</span></span>
              </div>
              <Link to="/checkout" className="w-full bg-dark text-primary hover:bg-gray-800 font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2">
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
