import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Package, MapPin, CreditCard, Truck, CheckCircle, Save, Printer, ExternalLink, ShieldCheck, Loader2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [postalTrackingCode, setPostalTrackingCode] = useState('');
  const [courierCompany, setCourierCompany] = useState('پست پیشتاز');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setStatus(data.orderStatus);
        setPostalTrackingCode(data.postalTrackingCode || '');
        setCourierCompany(data.courierCompany || 'پست پیشتاز');
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateLogistics = async () => {
    setIsSaving(true);
    try {
      const { data } = await api.put(`/orders/${id}`, {
        status,
        postalTrackingCode,
        courierCompany
      });
      setOrder(data);
      alert('اطلاعات پستی و وضعیت سفارش با موفقیت ثبت شد!');
    } catch (err) {
      alert('خطا در بروزرسانی وضعیت');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold"><Loader2 className="animate-spin mx-auto text-primary" size={40}/></div>;
  if (!order) return <div className="text-center py-20">سفارش یافت نشد!</div>;

  return (
    <div className="max-w-5xl mx-auto pb-16 font-sans">
      
      {/* هدر */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><ArrowRight size={20}/></Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Package size={24} className="text-primary"/> مدیریت مرسوله پستی #{order._id.substring(18)}
            </h1>
            <p className="text-xs text-gray-400 mt-1">ثبت شده در {new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
          </div>
        </div>

        {/* دکمه پرینت برچسب کارتن پستی */}
        <button 
          onClick={() => window.print()}
          className="bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-2xl hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Printer size={16}/> چاپ برچسب استاندارد پستی کارتن
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* اطلاعات سفارش و آدرس */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* نوار وضعیت ۵ مرحله‌ای سفارش */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 mb-4">مراحل ارسال سفارش:</h3>
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 relative">
              <div className="flex flex-col items-center gap-1.5 z-10">
                <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">۱</span>
                <span className="text-emerald-600">ثبت فاکتور</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 z-10">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${order.isPaid ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>۲</span>
                <span className={order.isPaid ? 'text-emerald-600' : ''}>تایید مالی</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 z-10">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${order.orderStatus === 'بسته بندی شده' || order.orderStatus === 'ارسال شده' || order.orderStatus === 'تحویل داده شده' ? 'bg-primary text-dark font-black' : 'bg-gray-200 text-gray-500'}`}>۳</span>
                <span>بسته‌بندی انبار</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 z-10">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${order.orderStatus === 'ارسال شده' || order.orderStatus === 'تحویل داده شده' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>۴</span>
                <span>تحویل به پست</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 z-10">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${order.orderStatus === 'تحویل داده شده' ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>۵</span>
                <span>تحویل مشتری</span>
              </div>
            </div>
          </div>

          {/* اقلام سفارش */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4 pb-4 border-b border-gray-100">اقلام موجود در کارتن</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-900 block text-sm">{item.name}</span>
                    <span className="text-xs text-gray-500 mt-1 block">طعم: {item.variant.flavor} | وزن: {item.variant.weight}</span>
                  </div>
                  <div className="text-left font-black">
                    <span className="block text-sm">{formatPrice(item.price)} تومان</span>
                    <span className="text-xs text-primary bg-dark px-2 py-0.5 rounded-md mt-1 inline-block">تعداد: {item.qty} قوطی</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* آدرس گیرنده پستی */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="text-primary" size={20}/> مشخصات پستی گیرنده
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-gray-800">
              <div><span className="text-gray-400 block text-xs mb-1">نام تحویل‌گیرنده:</span> {order.shippingAddress.fullName}</div>
              <div><span className="text-gray-400 block text-xs mb-1">تلفن همراه:</span> <span dir="ltr">{order.shippingAddress.phone}</span></div>
              <div className="md:col-span-2"><span className="text-gray-400 block text-xs mb-1">نشانی کامل پستی:</span> {order.shippingAddress.city} - {order.shippingAddress.address}</div>
              <div><span className="text-gray-400 block text-xs mb-1">کد پستی ۱۰ رقمی:</span> <span className="font-mono text-primary text-base">{order.shippingAddress.postalCode}</span></div>
            </div>
          </div>
        </div>

        {/* سایدبار مدیریت لجستیک و کد رهگیری پستی */}
        <div className="space-y-8">
          
          <div className="bg-dark text-white p-6 rounded-3xl shadow-sm border border-gray-800">
            <h2 className="text-base font-black mb-6 pb-4 border-b border-gray-700 flex items-center gap-2">
              <Truck className="text-primary" size={20}/> مدیریت ارسال و بارنامه
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">وضعیت فعلی مرسوله</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none font-bold text-sm text-white focus:border-primary"
                >
                  <option value="در حال پردازش">۱. در حال پردازش مالی</option>
                  <option value="بسته بندی شده">۲. بسته‌بندی در انبار مرکزی</option>
                  <option value="ارسال شده">۳. تحویل به پست / تیپاکس</option>
                  <option value="تحویل داده شده">۴. تحویل قطعی به مشتری</option>
                  <option value="لغو شده">۵. سفارش لغو شده</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">شرکت حمل‌ونقل</label>
                <select 
                  value={courierCompany} 
                  onChange={(e) => setCourierCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none font-bold text-sm text-white focus:border-primary"
                >
                  <option value="پست پیشتاز">شرکت ملی پست (پیشتاز)</option>
                  <option value="تیپاکس">تیپاکس (اکسپرس)</option>
                  <option value="چاپار">کالارسان چاپار</option>
                  <option value="پیک موتوری">پیک اختصاصی تهران</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-primary mb-2">کد رهگیری پستی مرسوله (۲۴ رقم)</label>
                <input 
                  type="text" 
                  dir="ltr"
                  value={postalTrackingCode} 
                  onChange={(e) => setPostalTrackingCode(e.target.value)}
                  placeholder="مثال: 182730094819284729182736"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none font-mono font-bold text-sm text-center text-primary tracking-widest focus:border-primary"
                />
              </div>

              {order.postalTrackingCode && (
                <a 
                  href={`https://tracking.post.ir/?id=${order.postalTrackingCode}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-primary rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  رهگیری آنلاین در سایت شرکت پست <ExternalLink size={14}/>
                </a>
              )}

              <button 
                onClick={handleUpdateLogistics} 
                disabled={isSaving}
                className="w-full bg-primary text-dark font-black py-3.5 rounded-2xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 mt-4 shadow-lg disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                ثبت و اطلاع‌رسانی به مشتری
              </button>
            </div>
          </div>

          {/* فاکتور مالی */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 mb-4 pb-2 border-b border-gray-100">تاییدیه تراکنش مالی</h3>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-gray-500">جمع مبلغ فاکتور:</span>
              <span className="font-black text-gray-900">{formatPrice(order.totalPrice)} تومان</span>
            </div>
            {order.isPaid ? (
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle size={16}/> پرداخت اینترنتی موفق شاپرک
              </div>
            ) : (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold">
                در انتظار پرداخت بانکی
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminOrderDetails;
