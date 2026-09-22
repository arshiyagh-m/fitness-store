import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Package, User, MapPin, CreditCard, Truck, CheckCircle, Save } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const AdminOrderDetails = () => {
  const { id } = useParams();
  
  // شبیه‌سازی اطلاعات یک سفارش کامل که از بک‌اند می‌آید
  const [order, setOrder] = useState({
    _id: id,
    createdAt: '۱۴۰۲/۰۸/۱۵ - ۱۴:۳۰',
    status: 'در حال پردازش',
    isPaid: true,
    totalPrice: 4500000,
    user: { name: 'علی محمدی', phone: '09123456789' },
    shippingAddress: { city: 'تهران - تهران', address: 'خیابان ولیعصر، کوچه ورزشی، پلاک ۹، واحد ۲', postalCode: '193954411' },
    items: [
      { name: 'پروتئین وی گلد استاندارد', variant: { flavor: 'شکلات', weight: '2.27 kg' }, qty: 1, price: 4500000 }
    ]
  });

  const [status, setStatus] = useState(order.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateStatus = () => {
    setIsSaving(true);
    setTimeout(() => {
      setOrder({ ...order, status });
      setIsSaving(false);
      alert('وضعیت سفارش با موفقیت به‌روز شد.');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/orders" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"><ArrowRight size={20} className="text-gray-600" /></Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Package size={24} className="text-primary" /> جزئیات سفارش #{order._id}</h1>
            <p className="text-sm text-gray-500 mt-1">ثبت شده در {order.createdAt}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* اطلاعات گیرنده و سفارش */}
        <div className="lg:col-span-2 space-y-8">
          {/* لیست محصولات */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 pb-4 border-b border-gray-100">اقلام سفارش</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900">{item.name}</span>
                    <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded-md w-max">
                      {item.variant.flavor} - {item.variant.weight}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-gray-900">{formatPrice(item.price)} <span className="text-xs font-normal">تومان</span></p>
                    <p className="text-sm text-gray-500 font-bold mt-1">تعداد: {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* آدرس گیرنده */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2"><MapPin size={20} className="text-primary"/> آدرس و مشخصات گیرنده</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
              <div><span className="block text-gray-400 mb-1">نام گیرنده:</span><span className="font-bold">{order.user.name}</span></div>
              <div><span className="block text-gray-400 mb-1">شماره تماس:</span><span className="font-bold font-mono">{order.user.phone}</span></div>
              <div className="md:col-span-2"><span className="block text-gray-400 mb-1">آدرس کامل:</span><span className="font-bold leading-relaxed">{order.shippingAddress.city} - {order.shippingAddress.address}</span></div>
              <div><span className="block text-gray-400 mb-1">کد پستی:</span><span className="font-bold font-mono">{order.shippingAddress.postalCode}</span></div>
            </div>
          </div>
        </div>

        {/* سایدبار مدیریت وضعیت */}
        <div className="space-y-8">
          <div className="bg-dark text-white p-6 rounded-3xl shadow-sm border border-gray-800">
            <h2 className="text-lg font-black mb-6 pb-4 border-b border-gray-700 flex items-center gap-2"><Truck size={20} className="text-primary"/> وضعیت سفارش</h2>
            <div className="space-y-4">
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none focus:border-primary transition-all text-sm font-bold">
                <option value="در حال پردازش">در حال پردازش</option>
                <option value="بسته بندی شده">بسته‌بندی شده</option>
                <option value="ارسال شده">تحویل پست / پیک</option>
                <option value="تحویل داده شده">تحویل مشتری شده</option>
                <option value="لغو شده">لغو شده</option>
              </select>
              <button onClick={handleUpdateStatus} disabled={isSaving || status === order.status} className="w-full bg-primary text-dark font-black px-6 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <Save size={18} /> {isSaving ? 'در حال ثبت...' : 'به‌روزرسانی وضعیت'}
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2"><CreditCard size={20} className="text-primary"/> فاکتور پرداخت</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-500">مبلغ کل سفارش</span>
              <span className="font-black text-gray-900">{formatPrice(order.totalPrice)} <span className="text-xs">تومان</span></span>
            </div>
            {order.isPaid 
              ? <div className="bg-emerald-50 text-emerald-600 font-bold p-3 rounded-xl flex items-center justify-center gap-2"><CheckCircle size={18}/> پرداخت موفق</div>
              : <div className="bg-rose-50 text-rose-600 font-bold p-3 rounded-xl flex items-center justify-center gap-2">پرداخت نشده</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminOrderDetails;
