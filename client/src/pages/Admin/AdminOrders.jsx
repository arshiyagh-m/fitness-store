import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Search, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // چون API واقعی ادمین را در بک‌اند نساختیم، فعلا یک دیتای نمایشی می‌سازیم
        // در نسخه پروداکشن این باید از api.get('/orders/admin') بیاید
        setTimeout(() => {
          setOrders([
            { _id: 'ORD-789012', user: { name: 'علی محمدی' }, totalPrice: 5850000, isPaid: true, orderStatus: 'در حال پردازش', createdAt: new Date().toISOString() },
            { _id: 'ORD-789013', user: { name: 'سارا احمدی' }, totalPrice: 1250000, isPaid: false, orderStatus: 'لغو شده', createdAt: new Date(Date.now() - 86400000).toISOString() },
            { _id: 'ORD-789014', user: { name: 'رضا کریمی' }, totalPrice: 8900000, isPaid: true, orderStatus: 'ارسال شده', createdAt: new Date(Date.now() - 172800000).toISOString() },
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header Panel */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"><ArrowRight size={20} className="text-gray-600" /></Link>
            <div>
              <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Package size={24} className="text-primary" />
                مدیریت سفارشات
              </h1>
              <p className="text-sm text-gray-500 mt-1">پنل مدیریت تیم ۹</p>
            </div>
          </div>
          
          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 focus-within:border-primary transition-colors">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="جستجوی شماره سفارش..." className="bg-transparent border-none outline-none text-sm w-48 px-2" />
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/20 text-dark rounded-full flex items-center justify-center"><Package size={24}/></div>
            <div><p className="text-sm text-gray-500">کل سفارشات</p><p className="text-xl font-black text-gray-900">124</p></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center"><CheckCircle size={24}/></div>
            <div><p className="text-sm text-gray-500">موفق</p><p className="text-xl font-black text-gray-900">108</p></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Truck size={24}/></div>
            <div><p className="text-sm text-gray-500">در حال ارسال</p><p className="text-xl font-black text-gray-900">12</p></div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center"><Clock size={24}/></div>
            <div><p className="text-sm text-gray-500">لغو شده</p><p className="text-xl font-black text-gray-900">4</p></div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-5">شماره سفارش</th>
                <th className="px-6 py-5">مشتری</th>
                <th className="px-6 py-5">تاریخ ثبت</th>
                <th className="px-6 py-5">مبلغ کل (تومان)</th>
                <th className="px-6 py-5">وضعیت پرداخت</th>
                <th className="px-6 py-5">وضعیت ارسال</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="6" className="text-center py-10 text-gray-400">در حال دریافت اطلاعات...</td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-900">{order._id}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{order.user.name}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString('fa-IR')}</td>
                    <td className="px-6 py-4 font-black text-gray-900">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      {order.isPaid 
                        ? <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100">پرداخت شده</span>
                        : <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-rose-100">پرداخت نشده</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        order.orderStatus === 'ارسال شده' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        order.orderStatus === 'در حال پردازش' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-gray-100 text-gray-500 border-gray-200'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
export default AdminOrders;
