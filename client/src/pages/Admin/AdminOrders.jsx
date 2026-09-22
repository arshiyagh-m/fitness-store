import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, Search, ArrowRight, Eye } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setOrders([
        { _id: 'ORD-789012', user: { name: 'علی محمدی' }, totalPrice: 5850000, isPaid: true, orderStatus: 'در حال پردازش', createdAt: new Date().toISOString() },
        { _id: 'ORD-789013', user: { name: 'سارا احمدی' }, totalPrice: 1250000, isPaid: false, orderStatus: 'لغو شده', createdAt: new Date(Date.now() - 86400000).toISOString() },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-gray-50 rounded-xl"><ArrowRight size={20} className="text-gray-600" /></Link>
          <div><h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Package size={24} className="text-primary" /> مدیریت سفارشات</h1></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
            <tr><th className="px-6 py-5">سفارش</th><th className="px-6 py-5">مشتری</th><th className="px-6 py-5">وضعیت</th><th className="px-6 py-5 text-center">جزئیات</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? <tr><td colSpan="4" className="text-center py-10 text-gray-400">در حال لود...</td></tr> : orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-mono font-bold">{order._id}</td>
                <td className="px-6 py-4 font-medium">{order.user.name}</td>
                <td className="px-6 py-4 font-bold">{order.orderStatus}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => navigate(`/admin/orders/${order._id}`)} className="bg-dark text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary hover:text-dark transition-colors flex items-center gap-1 mx-auto">
                    <Eye size={14}/> مشاهده و بررسی
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminOrders;
