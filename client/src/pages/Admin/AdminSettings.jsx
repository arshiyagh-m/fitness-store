import React, { useState } from 'react';
import { Settings, Save, Store, Flag, Bell } from 'lucide-react';

const AdminSettings = () => {
  const [isSaving, setIsSaving] = useState(false);

  // در دنیای واقعی این مقادیر از بک‌اند خوانده می‌شود (Store)
  const [bannerConfig, setBannerConfig] = useState({
    title: 'سوختِ عضلات خود را تامین کنید.',
    subtitle: 'کالکشن جدید ۲۰۲۴',
    isActive: true,
    theme: 'default' // default | black-friday | yalda | norouz
  });

  const handleSave = () => {
    setIsSaving(true);
    // ذخیره در LocalStorage برای نمایش در صفحه اصلی
    localStorage.setItem('site_banner', JSON.stringify(bannerConfig));
    setTimeout(() => {
      setIsSaving(false);
      alert('تنظیمات با موفقیت ذخیره شد! به صفحه اصلی بروید.');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div><h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Settings size={24} className="text-primary" /> تنظیمات فروشگاه</h1></div>
        <button onClick={handleSave} disabled={isSaving} className="bg-primary text-dark font-black px-6 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2"><Save size={20} /> ذخیره تنظیمات</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          
          {/* مدیریت بنر هوشمند */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><Flag size={20} className="text-primary" /> مدیریت بنر صفحه اصلی</h2>
            <div className="space-y-6">
              
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <label className="text-sm font-bold text-gray-700">نمایش بنر اصلی در سایت:</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={bannerConfig.isActive} onChange={(e) => setBannerConfig({...bannerConfig, isActive: e.target.checked})} className="w-5 h-5 accent-primary" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تم مناسبتی</label>
                <select value={bannerConfig.theme} onChange={(e) => setBannerConfig({...bannerConfig, theme: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary font-bold">
                  <option value="default">پیش‌فرض (زرد و مشکی - Team 9)</option>
                  <option value="black-friday">بلک فرایدی (قرمز آتشین)</option>
                  <option value="yalda">شب یلدا (سبز و قرمز)</option>
                  <option value="norouz">عید نوروز (سبز بهاری)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">تیتر اصلی بنر (Title)</label>
                <input type="text" value={bannerConfig.title} onChange={(e) => setBannerConfig({...bannerConfig, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">متن کوچک بالای بنر (Badge)</label>
                <input type="text" value={bannerConfig.subtitle} onChange={(e) => setBannerConfig({...bannerConfig, subtitle: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><Store size={20} className="text-primary" /> اطلاعات پایه</h2>
            <div className="space-y-4 text-gray-500 font-bold text-sm">بخش‌های اطلاعات فروشگاه و ارسال در اینجا قرار می‌گیرد...</div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-dark p-6 rounded-3xl shadow-sm border border-gray-800 text-gray-300">
            <h2 className="text-lg font-black text-white mb-6 flex items-center gap-2 border-b border-gray-700 pb-4"><Bell size={20} className="text-primary" /> پیامک و اطلاع‌رسانی</h2>
            <div className="space-y-4 text-sm font-medium opacity-50">در حال توسعه...</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminSettings;
