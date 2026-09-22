import React from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div>
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center"><DollarSign size={28}/></div>
          <div><p className="text-sm text-gray-500 font-bold">فروش ماه جاری</p><p className="text-2xl font-black text-gray-900 mt-1">۱۲۵.۵ <span className="text-sm text-gray-400">میلیون</span></p></div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/20 text-dark rounded-2xl flex items-center justify-center"><ShoppingCart size={28}/></div>
          <div><p className="text-sm text-gray-500 font-bold">سفارشات جدید</p><p className="text-2xl font-black text-gray-900 mt-1">۴۸</p></div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center"><Users size={28}/></div>
          <div><p className="text-sm text-gray-500 font-bold">کاربران فعال</p><p className="text-2xl font-black text-gray-900 mt-1">۱,۲۰۴</p></div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center"><TrendingUp size={28}/></div>
          <div><p className="text-sm text-gray-500 font-bold">نرخ تبدیل</p><p className="text-2xl font-black text-gray-900 mt-1">٪۳.۸</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* بخش نمودار فرضی */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-gray-400">
          <Activity size={48} className="mb-4 opacity-50" />
          <p className="font-bold">محل قرارگیری نمودار فروش هفتگی</p>
          <p className="text-sm mt-2">نیاز به نصب پکیج نمودار (مثل Recharts) دارد.</p>
        </div>

        {/* آخرین فعالیت‌ها */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-800 mb-6">آخرین سفارشات</h3>
          <div className="space-y-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-bold text-gray-900">سفارش #TR-98{i}</p>
                  <p className="text-xs text-gray-500 mt-1">توسط کاربر ناشناس</p>
                </div>
                <span className="bg-primary/20 text-dark px-3 py-1 rounded-lg text-xs font-bold">در حال پردازش</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;
