import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Package, MapPin, CreditCard, Truck, CheckCircle, Save, Printer, ExternalLink, Loader2 } from 'lucide-react';
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
        postalTrackingCode: postalTrackingCode.trim(),
        courierCompany
      });
      setOrder(data);
      alert(`کد رهگیری و شرکت حمل‌ونقل (${courierCompany}) با موفقیت برای مشتری ثبت شد!`);
    } catch (err) {
      alert('خطا در بروزرسانی وضعیت');
    } finally {
      setIsSaving(false);
    }
  };

  // آدرس مستقیم رهگیری در پنل ادمین
  const getAdminTrackingLink = () => {
    if (!postalTrackingCode) return '#';
    if (courierCompany === 'تیپاکس') return `https://tipaxco.com/tracking?id=${postalTrackingCode}`;
    if (courierCompany === 'ماهکس') return `https://mahex.com/tracking/?tracking_number=${postalTrackingCode}`;
    return `https://tracking.post.ir/?id=${postalTrackingCode}`; // پست پیشتاز
  };

  if (loading) return <div className="text-center py-20 font-bold"><Loader2 className="animate-spin mx-auto text-primary" size={40}/></div>;
  if (!order) return <div className="text-center py-20">سفارش یافت نشد!</div>;

  return (
    <div className="max-w-5xl mx-auto pb-16 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><ArrowRight size={20}/></Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Package size={24} className="text-primary"/> مدیریت بارنامه مرسوله #{order._id.substring(18)}
            </h1>
            <p className="text-xs text-gray-400 mt-1">ثبت شده در {new Date(order.createdAt).toLocaleDateString('fa-IR')}</p>
          </div>
        </div>

        <button 
          onClick={() => window.print()}
          className="bg-gray-900 text-white text-xs font-bold px-4 py-3 rounded-2xl hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Printer size={16}/> چاپ برچسب کارتن پستی
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          
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

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-900 mb-4 pb-4 border-b border-gray-100 flex items-center gap-2">
              <MapPin className="text-primary" size={20}/> مشخصات پستی تحویل‌گیرنده
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-gray-800">
              <div><span className="text-gray-400 block text-xs mb-1">نام گیرنده:</span> {order.shippingAddress.fullName}</div>
              <div><span className="text-gray-400 block text-xs mb-1">تلفن تماس:</span> <span dir="ltr">{order.shippingAddress.phone}</span></div>
              <div className="md:col-span-2"><span className="text-gray-400 block text-xs mb-1">نشانی:</span> {order.shippingAddress.city} - {order.shippingAddress.address}</div>
              <div><span className="text-gray-400 block text-xs mb-1">کد پستی:</span> <span className="font-mono text-primary text-base">{order.shippingAddress.postalCode}</span></div>
            </div>
          </div>
        </div>

        {/* سایدبار ثبت بارنامه اختصاصی */}
        <div className="space-y-8">
          <div className="bg-dark text-white p-6 rounded-3xl shadow-sm border border-gray-800">
            <h2 className="text-base font-black mb-6 pb-4 border-b border-gray-700 flex items-center gap-2">
              <Truck className="text-primary" size={20}/> صدور بارنامه و رهگیری
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">وضعیت سفارش</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none font-bold text-sm text-white focus:border-primary"
                >
                  <option value="در حال پردازش">۱. در حال پردازش مالی</option>
                  <option value="بسته بندی شده">۲. بسته‌بندی در انبار مرکزی</option>
                  <option value="ارسال شده">۳. تحویل به شرکت حمل‌ونقل</option>
                  <option value="تحویل داده شده">۴. تحویل قطعی به مشتری</option>
                  <option value="لغو شده">۵. لغو شده</option>
                </select>
              </div>

              {/* ۳ شرکت مورد درخواست کارفرما */}
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2">شرکت حمل‌ونقل منتخب</label>
                <select 
                  value={courierCompany} 
                  onChange={(e) => setCourierCompany(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none font-black text-sm text-primary focus:border-primary"
                >
                  <option value="پست پیشتاز">شرکت ملی پست (پیشتاز)</option>
                  <option value="تیپاکس">شرکت تیپاکس (اکسپرس)</option>
                  <option value="ماهکس">کالارسان ماهکس</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-primary mb-2">کد بارنامه / رهگیری مرسوله</label>
                <input 
                  type="text" 
                  dir="ltr"
                  value={postalTrackingCode} 
                  onChange={(e) => setPostalTrackingCode(e.target.value)}
                  placeholder="کد رهگیری را وارد کنید..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none font-mono font-bold text-sm text-center text-white tracking-widest focus:border-primary"
                />
              </div>

              {postalTrackingCode && (
                <a 
                  href={getAdminTrackingLink()} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-xs font-bold text-primary rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  تست لینک در سامانه {courierCompany} <ExternalLink size={14}/>
                </a>
              )}

              <button 
                onClick={handleUpdateLogistics} 
                disabled={isSaving}
                className="w-full bg-primary text-dark font-black py-3.5 rounded-2xl hover:bg-primary-hover transition-all flex items-center justify-center gap-2 mt-4 shadow-lg disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                ثبت بارنامه و اطلاع‌رسانی
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 mb-4 pb-2 border-b border-gray-100">وضعیت پرداخت</h3>
            <div className="flex justify-between items-center mb-3 text-sm">
              <span className="text-gray-500">مبلغ کل فاکتور:</span>
              <span className="font-black text-gray-900">{formatPrice(order.totalPrice)} تومان</span>
            </div>
            {order.isPaid ? (
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                <CheckCircle size={16}/> پرداخت موفق اینترنتی
              </div>
            ) : (
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold">پرداخت نشده</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
