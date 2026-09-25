import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Printer, Home, ShoppingBag, MapPin, Truck, Phone, ShieldCheck, AlertCircle } from 'lucide-react';
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

  if (loading) return <div className="text-center py-20 font-bold">در حال صدور فاکتور رسمی...</div>;
  if (!order) return <div className="text-center py-20 font-bold">فاکتوری یافت نشد!</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 font-sans" dir="rtl">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* کادر تبریک و پیگیری اضطراری */}
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-emerald-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={44} />
          </div>
          <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-black rounded-full mb-2">
            پرداخت با موفقیت در شاپرک تایید شد
          </span>
          <h1 className="text-2xl font-black text-gray-900 mb-2">فاکتور خرید رسمی شما با موفقیت صادر گردید</h1>
          <p className="text-gray-500 text-xs max-w-lg mx-auto leading-relaxed">
            اطلاعات این فاکتور به صورت دائم در پایگاه داده مرکزی Team 9 ذخیره شد. در صورت بروز هرگونه مشکل یا پیگیری فوری، شماره فاکتور زیر را به پشتیبانی اعلام نمایید.
          </p>

          {/* کادر هایلایت کد پیگیری اضطراری */}
          <div className="mt-6 p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <ShieldCheck size={18} className="text-amber-600"/>
              <span>شماره فاکتور پیگیری رسمی:</span>
              <strong className="font-mono text-base text-dark bg-white px-3 py-1 rounded-lg border border-amber-300">
                {order.invoiceNumber || order._id}
              </strong>
            </div>
            <span className="text-[11px] text-gray-500">پشتیبانی تلفنی: ۰۲۱-۱۲۳۴۵۶۷۸</span>
          </div>
        </div>

        {/* فاکتور چاپی رسمی (قابل پرینت استاندارد A4) */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6 print:border-none print:shadow-none">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-gray-900">فاکتور فروشگاه مکمل و دارویی Team 9</h2>
              <span className="text-xs text-gray-400 font-mono">شناسه پرداخت: {order.paymentResult?.id || 'TRX-ONLINE'}</span>
            </div>
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-colors print:hidden"
            >
              <Printer size={16} /> چاپ فاکتور رسمی
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-gray-50 p-4 rounded-2xl">
            <div><span className="text-gray-400 block mb-1">تاریخ پرداخت:</span><strong className="text-gray-800">{new Date(order.paidAt || order.createdAt).toLocaleDateString('fa-IR')}</strong></div>
            <div><span className="text-gray-400 block mb-1">روش باربری:</span><strong className="text-dark font-black">{order.courierCompany || 'پست پیشتاز'}</strong></div>
            <div><span className="text-gray-400 block mb-1">کرایه حمل:</span><strong>{formatPrice(order.shippingPrice)} تومان</strong></div>
            <div><span className="text-gray-400 block mb-1">وضعیت سفارش:</span><strong className="text-emerald-600 font-bold">{order.orderStatus}</strong></div>
          </div>

          {/* جدول اقلام */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead className="bg-gray-100 text-gray-600 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-3">شرح مکمل</th>
                  <th className="p-3">طعم و وزن</th>
                  <th className="p-3 text-center">تعداد</th>
                  <th className="p-3 text-left">مبلغ واحد</th>
                  <th className="p-3 text-left">مجموع</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.orderItems.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-3 font-bold text-gray-900">{item.name}</td>
                    <td className="p-3 text-gray-500">{item.variant?.flavor} - {item.variant?.weight}</td>
                    <td className="p-3 text-center font-bold">{item.qty}</td>
                    <td className="p-3 text-left font-mono">{formatPrice(item.price)}</td>
                    <td className="p-3 text-left font-black">{formatPrice(item.price * item.qty)} تومان</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* نشانی تحویل */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs flex items-start gap-3">
            <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
            <div>
              <strong className="block text-gray-800 mb-1">نشانی مقصد ارسال:</strong>
              <span className="text-gray-600">{order.shippingAddress.city} - {order.shippingAddress.address} (کد پستی: {order.shippingAddress.postalCode})</span>
              <span className="block text-gray-500 mt-1">تحویل‌گیرنده: {order.shippingAddress.fullName} | تلفن: {order.shippingAddress.phone}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-sm">
            <span className="font-black text-gray-900">مبلغ کل فاکتور پرداخت‌شده (مکمل + کرایه):</span>
            <div className="flex items-baseline gap-1 font-black text-2xl text-dark">
              {formatPrice(order.totalPrice)} <span className="text-xs font-bold text-gray-500">تومان</span>
            </div>
          </div>
        </div>

        {/* دکمه‌های ناوبری */}
        <div className="flex flex-col sm:flex-row gap-4 print:hidden">
          <Link to="/profile" className="flex-1 bg-dark text-primary hover:bg-gray-800 font-bold py-4 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-sm">
            <ShoppingBag size={18} /> پیگیری فاکتور در پروفایل من
          </Link>
          <Link to="/" className="px-6 py-4 bg-white hover:bg-gray-50 text-gray-700 font-bold rounded-2xl transition-all border border-gray-200 flex items-center justify-center gap-2 text-sm">
            <Home size={18} /> بازگشت به صفحه اصلی
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;
