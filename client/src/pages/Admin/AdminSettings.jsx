import React from 'react';
import { Settings, Save, Store, Truck, Bell } from 'lucide-react';

const AdminSettings = () => {
  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Settings size={24} className="text-primary" />
            تنظیمات فروشگاه
          </h1>
          <p className="text-sm text-gray-500 mt-1">پیکربندی پایه سیستم Team 9</p>
        </div>
        <button className="bg-primary text-dark font-black px-6 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2">
          <Save size={20} /> ذخیره تنظیمات
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* اطلاعات فروشگاه */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Store size={20} className="text-primary" /> مشخصات عمومی
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">نام فروشگاه</label>
                <input type="text" defaultValue="Team 9" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">شماره تماس پشتیبانی</label>
                <input type="text" dir="ltr" defaultValue="021-12345678" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-left" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Truck size={20} className="text-primary" /> قوانین ارسال
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">هزینه ثابت ارسال (تومان)</label>
                <input type="number" dir="ltr" defaultValue="55000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-left" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">ارسال رایگان برای خریدهای بالای (تومان)</label>
                <input type="number" dir="ltr" defaultValue="2500000" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-left" />
              </div>
            </div>
          </div>
        </div>

        {/* سایدبار تنظیمات */}
        <div className="space-y-8">
          <div className="bg-dark p-6 rounded-3xl shadow-sm border border-gray-800 text-gray-300">
            <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-gray-700 pb-4">
              <Bell size={20} className="text-primary" /> پیامک و اطلاع‌رسانی
            </h2>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded" />
                <span className="text-sm font-medium text-white">ارسال پیامک ثبت سفارش</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary rounded" />
                <span className="text-sm font-medium text-white">پیامک تغییر وضعیت ارسال</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer opacity-50">
                <input type="checkbox" disabled className="w-5 h-5 accent-primary rounded" />
                <span className="text-sm font-medium">ارسال کد OTP ورود (در حال توسعه)</span>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default AdminSettings;
