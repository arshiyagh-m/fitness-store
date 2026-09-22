import React, { useState, useEffect } from 'react';
import { Settings, Save, Store, Truck, Bell, Flag, Phone, Globe, DollarSign, ShieldCheck, Mail, Smartphone, Loader2, Share2, Clock, MapPin } from 'lucide-react';
import api from '../../services/api';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('branding'); // branding | contact | logistics | apis
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // استیت تمام فیلدهای بدون حذفیات
  const [settings, setSettings] = useState({
    siteName: 'Team 9',
    siteSlogan: 'بزرگترین مرجع تخصصی مکمل‌های ورزشی اورجینال و فرآورده‌های دارویی',
    theme: 'default',
    bannerTitle: 'سوختِ عضلات خود را تامین کنید.',
    bannerSubtitle: 'کالکشن جدید ۲۰۲۴',
    bannerActive: true,
    announcementText: '🔥 ارسال رایگان کلیه سفارشات بالای ۱.۵ میلیون تومان به سراسر کشور!',
    announcementActive: true,

    phoneSupport: '021-12345678',
    phoneMobile: '09120000000',
    emailOfficial: 'support@team9.ir',
    officeAddress: 'تهران، خیابان ولیعصر، برج ورزشی، طبقه ۵',
    instagramId: 'team9_store',
    telegramChannel: 'team9_supplements',
    workingHours: 'شنبه تا پنج‌شنبه ۹ الی ۲۱',

    shippingPostPrice: 55000,
    shippingTipaxPrice: 85000,
    shippingMahexPrice: 95000,
    freeShippingThreshold: 1500000,

    paymentGatewayProvider: 'simulator',
    zarinpalMerchantId: '',
    zarinpalSandbox: false,
    smsProvider: 'simulator',
    smsApiKey: '',
    smsSenderNumber: '1000888'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) setSettings(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // ذخیره در دیتابیس
      await api.put('/settings', settings);

      // ذخیره در حافظه محلی برای آپدیت زنده ظاهر کلاینت
      localStorage.setItem('team9_master_settings', JSON.stringify(settings));
      localStorage.setItem('site_banner', JSON.stringify({
        title: settings.bannerTitle,
        subtitle: settings.bannerSubtitle,
        isActive: settings.bannerActive,
        theme: settings.theme
      }));

      // اعمال درجا و زنده تم رنگی روی کل سایت
      document.documentElement.setAttribute('data-theme', settings.theme);

      alert('تمامی تنظیمات (هویت بصری، شبکه‌های اجتماعی، تعرفه‌ها، درگاه و پیامک) در دیتابیس ثبت و در کل سایت فعال گردید!');
    } catch (err) {
      alert('خطا در ذخیره تنظیمات');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold"><Loader2 className="animate-spin text-primary mx-auto" size={36}/></div>;

  return (
    <div className="max-w-6xl mx-auto pb-16 font-sans">
      
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Settings size={24} className="text-primary" /> مرکز کنترل و پیکربندی جامع فروشگاه (بدون کدنویسی)
          </h1>
          <p className="text-xs text-gray-400 mt-1">تغییر زنده تم، بنر مناسبتی، تلفن‌ها، اینستاگرام، تعرفه‌های پست، درگاه شاپرک و پیامک</p>
        </div>
        <button 
          onClick={handleSaveAll} 
          disabled={isSaving}
          className="bg-primary text-dark font-black px-8 py-3.5 rounded-2xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2 shadow-primary/20"
        >
          <Save size={18} /> {isSaving ? 'در حال اعمال تغییرات...' : 'ذخیره و اعمال در کل سایت'}
        </button>
      </div>

      {/* نوار ۴ تب کامل تنظیمات */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm gap-2 mb-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('branding')} 
          className={`flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'branding' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark'}`}
        >
          ۱. هویت بصری، بنر و تم زنده
        </button>
        <button 
          onClick={() => setActiveTab('contact')} 
          className={`flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'contact' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark'}`}
        >
          ۲. اطلاعات تماس و شبکه‌های اجتماعی
        </button>
        <button 
          onClick={() => setActiveTab('logistics')} 
          className={`flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'logistics' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark'}`}
        >
          ۳. تعرفه‌های پستی و انبارداری
        </button>
        <button 
          onClick={() => setActiveTab('apis')} 
          className={`flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'apis' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark'}`}
        >
          ۴. درگاه شاپرک و سامانه پیامک
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        
        {/* تب ۱: هویت بصری، تم مناسبتی و بنر */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <h3 className="font-black text-sm text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Flag size={18} className="text-primary"/> تنظیمات هویت بصری و تم‌های مناسبتی زنده
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">نام رسمی وبسایت</label>
                <input type="text" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">تم رنگی زنده کل سایت (مناسبت)</label>
                <select value={settings.theme} onChange={e => setSettings({...settings, theme: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold outline-none focus:border-primary">
                  <option value="default">پیش‌فرض ورزشی (زرد و مشکی - Team 9)</option>
                  <option value="black-friday">بلک فرایدی (قرمز آتشین و مشکی)</option>
                  <option value="yalda">شب یلدا (قرمز اناری و سبز)</option>
                  <option value="norouz">عید نوروز (سبز بهاری)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">شعار برند (نمایش در فوتر)</label>
                <input type="text" value={settings.siteSlogan} onChange={e => setSettings({...settings, siteSlogan: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">تیتر بنر بزرگ صفحه اصلی</label>
                <input type="text" value={settings.bannerTitle} onChange={e => setSettings({...settings, bannerTitle: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">متن بج بالای بنر (Badge)</label>
                <input type="text" value={settings.bannerSubtitle} onChange={e => setSettings({...settings, bannerSubtitle: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">متن نوار متحرک بالای سایت (Announcement Bar)</label>
                <input type="text" value={settings.announcementText} onChange={e => setSettings({...settings, announcementText: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary text-emerald-600 font-bold" />
              </div>

              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 md:col-span-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={settings.bannerActive} onChange={e => setSettings({...settings, bannerActive: e.target.checked})} className="w-4 h-4 accent-primary" />
                  نمایش بنر اصلی در صفحه اول
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={settings.announcementActive} onChange={e => setSettings({...settings, announcementActive: e.target.checked})} className="w-4 h-4 accent-primary" />
                  نمایش نوار اعلان بالای سایت
                </label>
              </div>
            </div>
          </div>
        )}

        {/* تب ۲: تماس و شبکه‌های اجتماعی */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h3 className="font-black text-sm text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Phone size={18} className="text-primary"/> اطلاعات پشتیبانی، انبار و شبکه‌های اجتماعی
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">تلفن ثابت پشتیبانی</label>
                <input type="text" dir="ltr" value={settings.phoneSupport} onChange={e => setSettings({...settings, phoneSupport: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono font-bold text-left outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">تلفن همراه مدیریت / واتساپ سفارشات</label>
                <input type="text" dir="ltr" value={settings.phoneMobile} onChange={e => setSettings({...settings, phoneMobile: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono font-bold text-left outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ایمیل رسمی پشتیبانی</label>
                <input type="email" dir="ltr" value={settings.emailOfficial} onChange={e => setSettings({...settings, emailOfficial: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono text-left outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">ساعات کاری و پاسخگویی</label>
                <input type="text" value={settings.workingHours} onChange={e => setSettings({...settings, workingHours: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">آیدی پیج اینستاگرام (بدون @)</label>
                <input type="text" dir="ltr" value={settings.instagramId} onChange={e => setSettings({...settings, instagramId: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono text-left outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">کانال رسمی تلگرام (بدون @)</label>
                <input type="text" dir="ltr" value={settings.telegramChannel} onChange={e => setSettings({...settings, telegramChannel: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono text-left outline-none focus:border-primary" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">آدرس رسمی دفتر مرکزی و انبار توزیع</label>
                <input type="text" value={settings.officeAddress} onChange={e => setSettings({...settings, officeAddress: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        )}

        {/* تب ۳: تعرفه‌های پستی */}
        {activeTab === 'logistics' && (
          <div className="space-y-6">
            <h3 className="font-black text-sm text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <Truck size={18} className="text-primary"/> تعرفه‌های حمل‌ونقل و سقف ارسال رایگان
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">هزینه ثابت پست پیشتاز (تومان)</label>
                <input type="number" dir="ltr" value={settings.shippingPostPrice} onChange={e => setSettings({...settings, shippingPostPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-left outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">هزینه ثابت تیپاکس (تومان)</label>
                <input type="number" dir="ltr" value={settings.shippingTipaxPrice} onChange={e => setSettings({...settings, shippingTipaxPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-left outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">هزینه ثابت ماهکس (تومان)</label>
                <input type="number" dir="ltr" value={settings.shippingMahexPrice} onChange={e => setSettings({...settings, shippingMahexPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-left outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">حداقل مبلغ خرید برای ارسال کاملاً رایگان (تومان)</label>
                <input type="number" dir="ltr" value={settings.freeShippingThreshold} onChange={e => setSettings({...settings, freeShippingThreshold: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-emerald-600 text-left outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        )}

        {/* تب ۴: درگاه و پیامک بدون کدنویسی */}
        {activeTab === 'apis' && (
          <div className="space-y-8">
            <h3 className="font-black text-sm text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary"/> اتصال بدون کدنویسی درگاه بانکی شاپرک و وب‌سرویس پیامک
            </h3>

            {/* درگاه شاپرک */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <DollarSign size={16} className="text-emerald-600"/> تنظیمات درگاه بانکی شاپرک (زرین‌پال / سداد)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">نوع اتصال درگاه</label>
                  <select 
                    value={settings.paymentGatewayProvider} 
                    onChange={e => setSettings({...settings, paymentGatewayProvider: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-bold outline-none focus:border-primary"
                  >
                    <option value="simulator">شبیه‌ساز تستی (بدون کسر وجه از کارت)</option>
                    <option value="zarinpal">درگاه زنده زرین‌پال / شاپرک رسمی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">کد مرچنت درگاه (Merchant ID)</label>
                  <input 
                    type="text" 
                    dir="ltr"
                    value={settings.zarinpalMerchantId} 
                    onChange={e => setSettings({...settings, zarinpalMerchantId: e.target.value})}
                    placeholder="کد ۳۶ رقمی مرچنت درگاه"
                    className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono text-left outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* سامانه پیامک */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <h4 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                <Smartphone size={16} className="text-primary"/> وب‌سرویس ارسال پیامک خودکار (کاوه‌نگار / فراز اس‌ام‌اس)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">سامانه پیامک منتخب</label>
                  <select 
                    value={settings.smsProvider} 
                    onChange={e => setSettings({...settings, smsProvider: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-bold outline-none focus:border-primary"
                  >
                    <option value="simulator">شبیه‌ساز ترمینال (چاپ در کنسول)</option>
                    <option value="kavenegar">کاوه‌نگار (Kavenegar API)</option>
                    <option value="farazsms">فراز اس‌ام‌اس (FarazSMS / IPPanel)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">کلید وب‌سرویس (API Key)</label>
                  <input 
                    type="text" 
                    dir="ltr"
                    value={settings.smsApiKey} 
                    onChange={e => setSettings({...settings, smsApiKey: e.target.value})}
                    placeholder="کلید API دریافت شده از پنل پیامک"
                    className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono text-left outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">شماره خط خدماتی فرستنده</label>
                  <input 
                    type="text" 
                    dir="ltr"
                    value={settings.smsSenderNumber} 
                    onChange={e => setSettings({...settings, smsSenderNumber: e.target.value})}
                    placeholder="مثال: 1000888 یا نام کاربری"
                    className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono text-left outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminSettings;
