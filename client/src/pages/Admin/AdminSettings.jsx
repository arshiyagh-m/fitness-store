import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, Smartphone, Loader2, CreditCard, Truck, Flag, Phone, Globe, DollarSign, Mail, MapPin } from 'lucide-react';
import api from '../../services/api';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('apis');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    siteName: 'Team 9',
    siteSlogan: 'بزرگترین مرجع تخصصی مکمل‌های ورزشی اورجینال و فرآورده‌های دارویی',
    theme: 'default',
    bannerTitle: 'سوختِ عضلات خود را تامین کنید.',
    bannerSubtitle: 'کالکشن جدید ۲۰۲۴',
    bannerActive: true,
    announcementText: '🔥 ارسال به سراسر کشور با پست پیشتاز، تیپاکس و ماهکس',
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
    digipayUsername: '',
    digipayClientId: '',
    digipayClientSecret: '',
    digipayPassword: '',
    smsProvider: 'simulator',
    smsApiKey: '',
    smsSenderNumber: '1000888'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        if (data) setSettings(prev => ({ ...prev, ...data }));
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
      await api.put('/settings', settings);
      localStorage.setItem('team9_master_settings', JSON.stringify(settings));
      localStorage.setItem('site_banner', JSON.stringify({
        title: settings.bannerTitle,
        subtitle: settings.bannerSubtitle,
        isActive: settings.bannerActive,
        theme: settings.theme
      }));
      document.documentElement.setAttribute('data-theme', settings.theme);
      alert('تمامی تنظیمات با موفقیت در دیتابیس ذخیره و در سایت فعال شد!');
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در برقراری ارتباط با سرور');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold"><Loader2 className="animate-spin text-primary mx-auto" size={36}/></div>;

  return (
    <div className="max-w-6xl mx-auto pb-16 font-sans" dir="rtl">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Settings size={24} className="text-primary" /> مرکز کنترل و پیکربندی جامع فروشگاه
          </h1>
          <p className="text-xs text-gray-400 mt-1">تنظیمات درگاه دیجی‌پی، تم زنده، اطلاعات تماس و تعرفه‌های پستی</p>
        </div>
        <button onClick={handleSaveAll} disabled={isSaving} className="bg-primary text-dark font-black px-8 py-3.5 rounded-2xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2">
          <Save size={18} /> {isSaving ? 'در حال ثبت...' : 'ذخیره و اعمال در کل سایت'}
        </button>
      </div>

      <div className="flex bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm gap-2 mb-8 overflow-x-auto">
        <button onClick={() => setActiveTab('apis')} className={'flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ' + (activeTab === 'apis' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark')}>
          ۱. درگاه دیجی‌پی و پیامک
        </button>
        <button onClick={() => setActiveTab('branding')} className={'flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ' + (activeTab === 'branding' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark')}>
          ۲. هویت بصری و تم زنده
        </button>
        <button onClick={() => setActiveTab('contact')} className={'flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ' + (activeTab === 'contact' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark')}>
          ۳. اطلاعات تماس و شبکه‌ها
        </button>
        <button onClick={() => setActiveTab('logistics')} className={'flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ' + (activeTab === 'logistics' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark')}>
          ۴. تعرفه‌های پستی ۳ حامل
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
        
        {/* ۱. دیجی‌پی و پیامک */}
        {activeTab === 'apis' && (
          <div className="space-y-6">
            <div className="p-6 bg-blue-50/40 rounded-2xl border-2 border-blue-200 space-y-4">
              <h3 className="font-black text-sm text-gray-900 flex items-center gap-2">
                <CreditCard className="text-blue-600" size={20}/> مشخصات رسمی درگاه دیجی‌پی شاپرک (Digipay IPG)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نوع درگاه</label>
                  <select value={settings.paymentGatewayProvider} onChange={e => setSettings({...settings, paymentGatewayProvider: e.target.value})} className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-black outline-none focus:border-blue-500">
                    <option value="simulator">شبیه‌ساز تستی (بدون کسر پول)</option>
                    <option value="digipay">درگاه زنده دیجی‌پی رسمی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نام کاربری (Username)</label>
                  <input type="text" dir="ltr" value={settings.digipayUsername} onChange={e => setSettings({...settings, digipayUsername: e.target.value})} placeholder="danaljokerl" className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono font-bold text-left outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">شناسه محرمانه (Client_Id)</label>
                  <input type="text" dir="ltr" value={settings.digipayClientId} onChange={e => setSettings({...settings, digipayClientId: e.target.value})} placeholder="danaljokerl-client-id" className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono font-bold text-left outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رمز عبور محرمانه (Client_Secret)</label>
                  <input type="password" dir="ltr" value={settings.digipayClientSecret} onChange={e => setSettings({...settings, digipayClientSecret: e.target.value})} className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono text-left outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">رمز عبور اختصاصی (Password)</label>
                  <input type="password" dir="ltr" value={settings.digipayPassword} onChange={e => setSettings({...settings, digipayPassword: e.target.value})} className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono text-left outline-none" />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="font-bold text-xs text-gray-900 flex items-center gap-2"><Smartphone size={18} className="text-primary"/> سامانه پیامک خودکار</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">سامانه پیامک</label>
                  <select value={settings.smsProvider} onChange={e => setSettings({...settings, smsProvider: e.target.value})} className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-bold outline-none">
                    <option value="simulator">شبیه‌ساز تستی</option>
                    <option value="kavenegar">کاوه‌نگار</option>
                    <option value="farazsms">فراز اس‌ام‌اس</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">کلید وب‌سرویس (API Key)</label>
                  <input type="text" dir="ltr" value={settings.smsApiKey} onChange={e => setSettings({...settings, smsApiKey: e.target.value})} placeholder="API Key" className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono text-left outline-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ۲. تم زنده و بنر */}
        {activeTab === 'branding' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">نام رسمی وبسایت</label>
                <input type="text" value={settings.siteName} onChange={e => setSettings({...settings, siteName: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">تم رنگی زنده کل سایت (مناسبت)</label>
                <select value={settings.theme} onChange={e => setSettings({...settings, theme: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold outline-none">
                  <option value="default">پیش‌فرض ورزشی (زرد و مشکی - Team 9)</option>
                  <option value="black-friday">بلک فرایدی (قرمز و مشکی)</option>
                  <option value="yalda">شب یلدا (قرمز اناری و سبز)</option>
                  <option value="norouz">عید نوروز (سبز بهاری)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">شعار برند (نمایش در فوتر)</label>
                <input type="text" value={settings.siteSlogan} onChange={e => setSettings({...settings, siteSlogan: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">تیتر بنر صفحه اصلی</label>
                <input type="text" value={settings.bannerTitle} onChange={e => setSettings({...settings, bannerTitle: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">متن بج بالای بنر</label>
                <input type="text" value={settings.bannerSubtitle} onChange={e => setSettings({...settings, bannerSubtitle: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-600 mb-1">متن نوار متحرک بالای سایت</label>
                <input type="text" value={settings.announcementText} onChange={e => setSettings({...settings, announcementText: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none text-emerald-600 font-bold" />
              </div>
            </div>
          </div>
        )}

        {/* ۳. اطلاعات تماس و شبکه‌ها */}
        {activeTab === 'contact' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">تلفن ثابت پشتیبانی</label>
              <input type="text" dir="ltr" value={settings.phoneSupport} onChange={e => setSettings({...settings, phoneSupport: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono font-bold text-left outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">تلفن همراه مدیریت / واتساپ</label>
              <input type="text" dir="ltr" value={settings.phoneMobile} onChange={e => setSettings({...settings, phoneMobile: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono font-bold text-left outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">ایمیل رسمی</label>
              <input type="email" dir="ltr" value={settings.emailOfficial} onChange={e => setSettings({...settings, emailOfficial: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono text-left outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">ساعات کاری و پاسخگویی</label>
              <input type="text" value={settings.workingHours} onChange={e => setSettings({...settings, workingHours: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">آیدی اینستاگرام (بدون @)</label>
              <input type="text" dir="ltr" value={settings.instagramId} onChange={e => setSettings({...settings, instagramId: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono text-left outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">کانال تلگرام (بدون @)</label>
              <input type="text" dir="ltr" value={settings.telegramChannel} onChange={e => setSettings({...settings, telegramChannel: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-mono text-left outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-1">آدرس رسمی دفتر مرکزی و انبار</label>
              <input type="text" value={settings.officeAddress} onChange={e => setSettings({...settings, officeAddress: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none" />
            </div>
          </div>
        )}

        {/* ۴. تعرفه‌ها */}
        {activeTab === 'logistics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">پست پیشتاز (تومان)</label>
              <input type="number" dir="ltr" value={settings.shippingPostPrice} onChange={e => setSettings({...settings, shippingPostPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-left outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">تیپاکس (تومان)</label>
              <input type="number" dir="ltr" value={settings.shippingTipaxPrice} onChange={e => setSettings({...settings, shippingTipaxPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-left outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">ماهکس (تومان)</label>
              <input type="number" dir="ltr" value={settings.shippingMahexPrice} onChange={e => setSettings({...settings, shippingMahexPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-left outline-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
