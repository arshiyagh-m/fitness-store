import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, AlertCircle, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const PaymentGateway = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(599); // تایمر ۱۰ دقیقه‌ای شاپرک

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

  // تایمر معکوس درگاه
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePaySuccess = async () => {
    setPaying(true);
    try {
      const trackingCode = `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`;
      await api.put(`/orders/${id}/pay`, { id: trackingCode });
      navigate(`/order/${id}/success`);
    } catch (err) {
      alert('خطا در ارتباط با بانک');
      setPaying(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('آیا از انصراف از پرداخت اطمینان دارید؟')) {
      navigate('/cart');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center">
        <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
        <p className="font-bold text-gray-800 mb-4">اطلاعات فاکتور پرداخت یافت نشد!</p>
        <button onClick={() => navigate('/cart')} className="text-sm font-bold text-primary">بازگشت به سبد خرید</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10 px-4 font-sans" dir="rtl">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        
        {/* هدر درگاه شاپرک */}
        <div className="bg-[#1a3a60] text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="font-black text-lg">پرداخت الکترونیک شاپرک</h1>
              <p className="text-xs text-gray-300">درگاه امن پرداخت اینترنتی بانک مرکزی</p>
            </div>
          </div>
          <div className="text-left font-mono">
            <span className="text-xs text-gray-300 block">زمان باقی‌مانده:</span>
            <span className="text-lg font-black text-amber-300">{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* فاکتور مبلغ و پذیرنده */}
        <div className="p-6 bg-gray-50 border-b border-gray-200 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400 block text-xs mb-1">نام پذیرنده:</span>
            <span className="font-black text-gray-800">فروشگاه مکمل ورزشی Team 9</span>
          </div>
          <div className="text-left">
            <span className="text-gray-400 block text-xs mb-1">شماره سفارش:</span>
            <span className="font-bold font-mono text-gray-700">#{order._id.substring(18)}</span>
          </div>
          <div className="col-span-2 pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-gray-600 font-bold">مبلغ قابل پرداخت:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-600">{formatPrice(order.totalPrice)}</span>
              <span className="text-xs text-gray-500 font-bold">تومان</span>
            </div>
          </div>
        </div>

        {/* فرم شبیه‌ساز کارت بانکی */}
        <div className="p-8 space-y-5">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-blue-800 font-medium">
            <Lock size={20} className="shrink-0 text-blue-600" />
            <span>این صفحه شبیه‌ساز درگاه بانکی برای تست خرید آزمایشی شماست. برای ثبت سفارش، دکمه پرداخت تستی را بزنید.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">شماره کارت بانکی (۱۶ رقم)</label>
            <div className="relative">
              <input 
                type="text" 
                dir="ltr"
                defaultValue="6037 - 9975 - 1234 - 5678" 
                disabled 
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl font-mono text-gray-700 font-bold tracking-widest text-center"
              />
              <CreditCard size={20} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">رمز اینترنتی (CVV2)</label>
              <input type="password" defaultValue="428" disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl font-mono text-center font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">تاریخ انقضا</label>
              <input type="text" defaultValue="08 / 05" disabled className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl font-mono text-center font-bold" />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePaySuccess}
              disabled={paying}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50"
            >
              {paying ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20}/> پرداخت تستی موفق</>}
            </button>
            <button
              onClick={handleCancel}
              disabled={paying}
              className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-all"
            >
              انصراف
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentGateway;
