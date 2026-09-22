import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, Package, MapPin, CreditCard, Truck, CheckCircle, Save, Activity } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data); setStatus(data.orderStatus); setLoading(false);
      } catch (err) { setLoading(false); }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    setIsSaving(true);
    try {
      await api.put(`/orders/${id}`, { status });
      setOrder({ ...order, orderStatus: status });
      alert('وضعیت با موفقیت تغییر کرد');
    } catch (err) { alert('خطا در تغییر وضعیت'); }
    setIsSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Activity className="animate-spin text-primary" size={40}/></div>;
  if (!order) return <div className="text-center py-20">سفارش یافت نشد</div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <Link to="/admin/orders" className="flex items-center gap-2 text-gray-600 hover:text-primary font-bold"><ArrowRight size={20} /> بازگشت به سفارشات</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 pb-4 border-b border-gray-100">اقلام سفارش</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex flex-col"><span className="font-bold">{item.name}</span><span className="text-xs text-gray-500">{item.variant.flavor} - {item.variant.weight}</span></div>
                  <div className="text-right font-black">{formatPrice(item.price)} تومان <span className="text-sm font-normal block text-gray-500">تعداد: {item.qty}</span></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 pb-4 border-b border-gray-100 flex items-center gap-2"><MapPin className="text-primary"/> آدرس گیرنده</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold">
              <div><span className="text-gray-400 block mb-1">گیرنده:</span> {order.shippingAddress.fullName}</div>
              <div><span className="text-gray-400 block mb-1">تلفن:</span> {order.shippingAddress.phone}</div>
              <div className="col-span-2"><span className="text-gray-400 block mb-1">آدرس:</span> {order.shippingAddress.city} - {order.shippingAddress.address}</div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-dark text-white p-6 rounded-3xl shadow-sm border border-gray-800">
            <h2 className="text-lg font-black mb-6 pb-4 border-b border-gray-700 flex items-center gap-2"><Truck className="text-primary"/> تغییر وضعیت</h2>
            <div className="space-y-4">
              <select value={status} onChange={(e)=>setStatus(e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl outline-none font-bold">
                <option value="در حال پردازش">در حال پردازش</option>
                <option value="بسته بندی شده">بسته‌بندی شده</option>
                <option value="ارسال شده">ارسال شده (تحویل پست)</option>
              </select>
              <button onClick={handleUpdateStatus} disabled={isSaving || status === order.orderStatus} className="w-full bg-primary text-dark font-black px-6 py-3 rounded-xl disabled:opacity-50">
                {isSaving ? 'در حال ثبت...' : 'بروزرسانی وضعیت'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminOrderDetails;
