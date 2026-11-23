import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, AlertCircle, Loader2, CheckCircle2, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const PaymentGateway = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [gatewayProvider, setGatewayProvider] = useState('simulator');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [timeLeft, setTimeLeft] = useState(599);

  useEffect(() => {
    const statusParam = searchParams.get('status');
    if (statusParam === 'canceled') {
      setErrorMsg('پرداخت توسط شما لغو شد. در صورت تمایل می‌توانید مجدداً تلاش کنید.');
    } else if (statusParam === 'failed' || statusParam === 'verify_failed' || statusParam === 'error') {
      setErrorMsg('تراکنش بانکی ناموفق بود یا تایید نشد. در صورت کسر وجه، مبلغ ظرف ۷۲ ساعت به حساب شما بازمی‌گردد.');
    }

    const fetchData = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          api.get(`/orders/${id}`),
          api.get('/settings'),
        ]);
        setOrder(orderRes.data);
        if (settingsRes.data?.paymentGatewayProvider) {
          setGatewayProvider(settingsRes.data.paymentGatewayProvider);
        }
        if (orderRes.data?.isPaid) {
          navigate(`/order/${id}/success`);
        }
      } catch (err) {
        setErrorMsg('خطا در دریافت اطلاعات سفارش.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, searchParams, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // اتصال به درگاه واقعی دیجی‌پی
  const handleDigipayRedirect = async () => {
    setPaying(true);
    setErrorMsg('');
    try {
      const { data } = await api.post('/payment/digipay/request', { orderId: id });
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setErrorMsg('لینک انتقال به درگاه دیجی‌پی دریافت نشد.');
        setPaying(false);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'خطا در برقراری ارتباط با سرور دیجی‌پی');
      setPaying(false);
    }
  };

  // پرداخت شبیه‌ساز تستی
  const handleSimulatorPaySuccess = async () => {
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
      navigate('/profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center">
          <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
          <p className="font-bold text-gray-800 mb-4">اطلاعات فاکتور پرداخت یافت نشد!</p>
          <button onClick={() => navigate('/cart')} className="text-sm font-bold text-primary">بازگشت به سبد خرید</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-10 px-4 font-sans" dir="rtl">
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
        {/* هدر درگاه */}
        <div className="bg-[#1a3a60] text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={28} className="text-emerald-400" />
            </div>
            <div>
              <h1 className="font-black text-lg">
                {gatewayProvider === 'digipay' ? 'درگاه پرداخت یکپارچه دیجی‌پی' : 'پرداخت الکترونیک شاپرک'}
              </h1>
              <p className="text-xs text-gray-300">درگاه امن پرداخت اینترنتی شبکه شاپرک</p>
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
            <span className="text-gray-400 block text-xs mb-1">شماره فاکتور:</span>
            <span className="font-bold font-mono text-gray-700">{order.invoiceNumber || `#${order._id.substring(18)}`}</span>
          </div>
          <div className="col-span-2 pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-gray-600 font-bold">مبلغ قابل پرداخت:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-600">{formatPrice(order.totalPrice)}</span>
              <span className="text-xs text-gray-500 font-bold">تومان</span>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-5">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-rose-700 font-bold">
              <AlertCircle size={20} className="shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {gatewayProvider === 'digipay' ? (
            <>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-blue-900 font-medium leading-6">
                <Lock size={22} className="shrink-0 text-blue-600" />
                <span>
                  با کلیک بر روی دکمه زیر، به صورت مستقیم به <strong>درگاه امن پرداخت یکپارچه دیجی‌پی (DigiPay)</strong> متصل می‌شوید و می‌توانید با کلیه کارت‌های عضو شتاب پرداخت خود را انجام دهید.
                </span>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDigipayRedirect}
                  disabled={paying}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {paying ? (
                    <><Loader2 className="animate-spin" size={20} /> در حال اتصال به دیجی‌پی...</>
                  ) : (
                    <><ExternalLink size={20} /> انتقال به درگاه پرداخت دیجی‌پی</>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={paying}
                  className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-all"
                >
                  انصراف
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-blue-800 font-medium">
                <Lock size={20} className="shrink-0 text-blue-600" />
                <span>این صفحه شبیه‌ساز درگاه بانکی برای تست خرید آزمایشی شماست. برای فعال‌سازی درگاه واقعی، از پنل مدیریت گزینه دیجی‌پی را انتخاب کنید.</span>
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
                  onClick={handleSimulatorPaySuccess}
                  disabled={paying}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {paying ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20} /> پرداخت تستی موفق</>}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={paying}
                  className="px-6 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-2xl transition-all"
                >
                  انصراف
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
