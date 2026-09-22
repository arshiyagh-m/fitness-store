import React, { useState, useEffect } from 'react';
import { User, MapPin, ShoppingBag, LogOut, ChevronLeft, Package, Clock, CheckCircle, Activity, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate('/login');
    const fetchMyOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        setLoading(false);
      } catch (err) { setLoading(false); }
    };
    fetchMyOrders();
  }, [user, navigate]);

  const handleLogout = () => { logout(); navigate('/'); };

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
              <div className="bg-dark p-6 text-center border-b-4 border-primary">
                <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center text-primary text-3xl font-black">{user.name.charAt(0)}</div>
                <h2 className="text-white font-black text-lg">{user.name}</h2>
              </div>
              <div className="p-4 space-y-2">
                <button onClick={() => setActiveTab('orders')} className={`w-full flex justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-primary text-dark shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}><div className="flex gap-3"><ShoppingBag size={20}/>سفارشات</div><ChevronLeft size={16}/></button>
                <button onClick={handleLogout} className="w-full flex gap-3 p-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50"><LogOut size={20}/>خروج</button>
              </div>
            </div>
          </div>
          <div className="lg:w-3/4 bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100"><Package className="text-primary"/>سفارشات من</h3>
                {loading ? <Activity className="animate-spin text-primary mx-auto my-10"/> : orders.length === 0 ? <div className="text-center text-gray-500 my-10">سفارشی یافت نشد</div> : (
                  <div className="space-y-4">
                    {orders.map((o) => (
                      <div key={o._id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-4">
                          <div><p className="font-bold">سفارش #{o._id.substring(18)}</p><p className="text-sm text-gray-500 mt-1">{new Date(o.createdAt).toLocaleDateString('fa-IR')}</p></div>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${o.orderStatus === 'در حال پردازش' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>{o.orderStatus}</span>
                        </div>
                        <div className="flex justify-between py-4 border-t border-gray-50"><span className="text-sm text-gray-500">{o.orderItems.length} کالا</span><div className="font-black text-gray-900">{formatPrice(o.totalPrice)} <span className="text-xs text-gray-500">تومان</span></div></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
