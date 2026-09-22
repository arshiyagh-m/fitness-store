import React, { useState } from 'react';
import { User, MapPin, ShoppingBag, LogOut, ChevronLeft, Package, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { formatPrice } from '../../utils/formatters';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // دیتای نمایشی سفارشات مشتری
  const mockOrders = [
    { id: 'TR-9843', date: '۱۴۰۲/۰۸/۱۵', total: 4500000, status: 'ارسال شده', items: 2 },
    { id: 'TR-8821', date: '۱۴۰۲/۰۶/۲۲', total: 1250000, status: 'تحویل داده شده', items: 1 }
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* سایدبار پروفایل */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="bg-dark p-6 text-center border-b-4 border-primary">
                <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center text-primary text-3xl font-black border-2 border-primary shadow-lg shadow-primary/20">
                  {user.name.charAt(0)}
                </div>
                <h2 className="text-white font-black text-lg">{user.name}</h2>
                <p className="text-gray-400 text-sm font-mono mt-1">{user.phone}</p>
              </div>
              <div className="p-4 space-y-2">
                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-primary text-dark shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3"><ShoppingBag size={20}/> تاریخچه سفارشات</div>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setActiveTab('info')} className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'info' ? 'bg-primary text-dark shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3"><User size={20}/> اطلاعات حساب</div>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${activeTab === 'addresses' ? 'bg-primary text-dark shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3"><MapPin size={20}/> آدرس‌های من</div>
                  <ChevronLeft size={16} />
                </button>
                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 transition-all">
                  <LogOut size={20}/> خروج از حساب
                </button>
              </div>
            </div>
          </div>

          {/* محتوای اصلی */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
              
              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
                    <Package className="text-primary" /> سفارشات اخیر من
                  </h3>
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                          <div className="flex items-center gap-4">
                            <div className="bg-gray-50 p-3 rounded-xl"><Package className="text-gray-400" /></div>
                            <div>
                              <p className="font-bold text-gray-800">سفارش #{order.id}</p>
                              <p className="text-sm text-gray-500 mt-1">{order.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold ${order.status === 'ارسال شده' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                              {order.status === 'ارسال شده' ? <Clock size={14}/> : <CheckCircle size={14}/>}
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center py-4 border-t border-gray-50">
                          <span className="text-sm text-gray-500">{order.items} کالا</span>
                          <div className="font-black text-gray-900">{formatPrice(order.total)} <span className="text-xs text-gray-500 font-bold">تومان</span></div>
                        </div>
                        <button className="w-full mt-2 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                          مشاهده فاکتور و جزئیات <ArrowLeft size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* بخش‌های دیگر (آدرس و اطلاعات) فعلاً نمایشی */}
              {activeTab !== 'orders' && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Clock size={48} className="opacity-50"/></div>
                  <p className="font-bold">این بخش در حال توسعه است...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
