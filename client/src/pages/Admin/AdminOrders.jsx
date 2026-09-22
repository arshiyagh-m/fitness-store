import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Search, ArrowRight, Eye, Activity } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
        setLoading(false);
      } catch (err) { setLoading(false); }
    };
    fetchAdminOrders();
  }, []);

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 bg-gray-50 rounded-xl"><ArrowRight size={20} className="text-gray-600" /></Link>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Package size={24} className="text-primary"/> مدیریت سفارشات</h1>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
            <tr><th className="px-6 py-5">سفارش</th><th className="px-6 py-5">مشتری</th><th className="px-6 py-5">وضعیت</th><th className="px-6 py-5 text-center">جزئیات</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? <tr><td colSpan="4" className="text-center py-10"><Activity className="animate-spin text-primary mx-auto"/></td></tr> : orders.map((o) => (
              <tr key={o._id} className="hover:bg-gray-50/50">
                <td className="px-6 py-4 font-mono font-bold">{o._id.substring(18)}</td>
                <td className="px-6 py-4 font-medium">{o.user?.name || 'ناشناس'}</td>
                <td className="px-6 py-4 font-bold">{o.orderStatus}</td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => navigate(`/admin/orders/${o._id}`)} className="bg-dark text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 flex items-center gap-1 mx-auto"><Eye size={14}/> بررسی</button>
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
