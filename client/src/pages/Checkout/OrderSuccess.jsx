import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Printer, ArrowLeft, Home, ShoppingBag, ShieldCheck, MapPin } from 'lucide-react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center py-20 font-bold">در حال آماده‌سازی فاکتور...</div>;
  if (!order) return <div className="text-center py-20 font-bold">فاکتوری یافت نشد!</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 font-sans" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* کادر تبریک و تایید */}
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-emerald-100 relative overflow-hidden">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={44} />
          </div>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full mb-2">
            پرداخت با موفقیت انجام شد
          </span>
          <h1 className="text-2xl font-black text-gray-900 mb-2">از سفارش شما در Team 9 سپاسگزاریم!</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            سفارش شما وارد مرحله آماده‌سازی و ارسال انبار شد. جزئیات به زودی برای شما پیامک خواهد شد.
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-400 block text-xs mb-1">شماره سفارش:</span>
              <span className="font-mono font-bold text-gray-800">#{order._id.substring(18)}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs mb-1">کد پیگیری بانکی:</span>
              <span className="font-mono font-bold text-emerald-600">{order.paymentResult?.id || 'TRX-102938'}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs mb-1">تاریخ پرداخت:</span>
              <span className="font-bold text-gray-800">{new Date(order.paidAt || order.createdAt).toLocaleDateString('fa-IR')}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-xs mb-1">روش پرداخت:</span>
              <span className="font-bold text-gray-800">درگاه اینترنتی</span>
            </div>
          </div>
        </div>

        {/* فاکتور کامل اقلام */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-6">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Package className="text-primary" size={22} /> اقلام فاکتور خرید
            </h2>
            <button onClick={() => window.print()} className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-dark bg-gray-100 px-3 py-2 rounded-xl transition-colors">
              <Printer size={16} /> چاپ فاکتور
            </button>
          </div>

          <div className="divide-y divide-gray-100 mb-6">
            {order.orderItems.map((item, idx) => (
              <div key={idx} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-1">تنوع: {item.variant.flavor} - {item.variant.weight}</p>
                </div>
                <div className="text-left">
                  <p className="font-black text-gray-900 text-sm">{formatPrice(item.price)} تومان</p>
                  <p className="text-xs text-gray-400 mt-1">{item.qty} عدد</p>
                </div>
              </div>
            ))}
          </div>

          {/* آدرس پستی */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-sm flex items-start gap-3">
            <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-800 block mb-1">ارسال به آدرس:</span>
              <span className="text-gray-600 text-xs leading-relaxed">{order.shippingAddress.city} - {order.shippingAddress.address} (کد پستی: {order.shippingAddress.postalCode})</span>
              <span className="block text-gray-500 text-xs mt-1">تحویل‌گیرنده: {order.shippingAddress.fullName} - {order.shippingAddress.phone}</span>
            </div>
          </div>

          {/* جمع کل */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <span className="font-black text-gray-800">مجموع پرداختی:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-gray-900">{formatPrice(order.totalPrice)}</span>
              <span className="text-xs font-bold text-gray-500">تومان</span>
            </div>
          </div>
        </div>

        {/* دکمه‌های بازگشت */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/profile" className="flex-1 bg-dark text-primary hover:bg-gray-800 font-bold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2">
            <ShoppingBag size={18} /> پیگیری سفارش در پروفایل من
          </Link>
          <Link to="/" className="px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-2xl transition-all border border-gray-200 flex items-center justify-center gap-2">
            <Home size={18} /> بازگشت به صفحه اصلی
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
