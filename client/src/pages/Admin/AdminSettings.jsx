import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, Smartphone, Loader2, CreditCard, Truck, Flag } from 'lucide-react';
import api from '../../services/api';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('apis');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    paymentGatewayProvider: 'simulator',
    digipayUsername: '',
    digipayClientId: '',
    digipayClientSecret: '',
    digipayPassword: '',
    smsProvider: 'simulator',
    smsApiKey: '',
    smsSenderNumber: '1000888',
    shippingPostPrice: 55000,
    shippingTipaxPrice: 85000,
    shippingMahexPrice: 95000,
    siteName: 'Team 9',
    phoneSupport: '021-12345678',
    announcementText: 'ارسال با پست پیشتاز، تیپاکس و ماهکس'
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
      await api.put('/settings', settings);
      alert('تنظیمات درگاه دیجی‌پی و سیستم با موفقیت ذخیره شد!');
    } catch (err) {
      alert('خطا در ذخیره تنظیمات');
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
            <Settings size={24} className="text-primary" /> پیکربندی درگاه پرداخت رسمی دیجی‌پی و شاپرک
          </h1>
          <p className="text-xs text-gray-400 mt-1">اتصال مستقیم به سامانه پرداخت هوشمند Digipay و وب‌سرویس‌ها</p>
        </div>
        <button 
          onClick={handleSaveAll} 
          disabled={isSaving}
          className="bg-primary text-dark font-black px-8 py-3.5 rounded-2xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2"
        >
          <Save size={18} /> {isSaving ? 'در حال ثبت...' : 'ذخیره و فعال‌سازی درگاه'}
        </button>
      </div>

      <div className="flex bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm gap-2 mb-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('apis')} 
          className={'flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ' + (activeTab === 'apis' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark')}
        >
          درگاه دیجی‌پی و پیامک
        </button>
        <button 
          onClick={() => setActiveTab('logistics')} 
          className={'flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ' + (activeTab === 'logistics' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark')}
        >
          تعرفه‌های پستی ۳ حامل
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
        {activeTab === 'apis' && (
          <div className="space-y-8">
            <div className="p-6 bg-blue-50/40 rounded-3xl border-2 border-blue-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={24} />
                  <div>
                    <h3 className="font-black text-sm text-gray-900">پیکربندی درگاه رسمی دیجی‌پی (Digipay IPG)</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">مشخصات دریافتی از business.mydigipay.com را وارد نمایید:</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full">درگاه شاپرک</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نوع درگاه فعال در سایت</label>
                  <select 
                    value={settings.paymentGatewayProvider} 
                    onChange={e => setSettings({...settings, paymentGatewayProvider: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                  >
                    <option value="simulator">شبیه‌ساز تستی (بدون کسر پول)</option>
                    <option value="digipay">درگاه زنده دیجی‌پی رسمی (کارت‌های شتاب)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نام کاربری (Username)</label>
                  <input 
                    type="text" 
                    dir="ltr"
                    value={settings.digipayUsername} 
                    onChange={e => setSettings({...settings, digipayUsername: e.target.value})}
                    placeholder="danaljokerl"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-left outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">شناسه محرمانه (Client_Id)</label>
                  <input 
                    type="text" 
                    dir="ltr"
                    value={settings.digipayClientId} 
                    onChange={e => setSettings({...settings, digipayClientId: e.target.value})}
                    placeholder="danaljokerl-client-id"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-left outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">رمز عبور محرمانه (Client_Secret)</label>
                  <input 
                    type="password" 
                    dir="ltr"
                    value={settings.digipayClientSecret} 
                    onChange={e => setSettings({...settings, digipayClientSecret: e.target.value})}
                    placeholder="Client Secret"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-left outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">رمز عبور اختصاصی (Password)</label>
                  <input 
                    type="password" 
                    dir="ltr"
                    value={settings.digipayPassword} 
                    onChange={e => setSettings({...settings, digipayPassword: e.target.value})}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-left outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <Smartphone className="text-primary" size={20} />
                <h4 className="font-bold text-xs text-gray-900">سامانه پیامک خودکار (کاوه‌نگار / فراز)</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">انتخاب سامانه</label>
                  <select 
                    value={settings.smsProvider} 
                    onChange={e => setSettings({...settings, smsProvider: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-bold outline-none focus:border-primary"
                  >
                    <option value="simulator">شبیه‌ساز تستی کنسول</option>
                    <option value="kavenegar">کاوه‌نگار</option>
                    <option value="farazsms">فراز اس‌ام‌اس</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">کلید وب‌سرویس (API Key)</label>
                  <input 
                    type="text" 
                    dir="ltr"
                    value={settings.smsApiKey} 
                    onChange={e => setSettings({...settings, smsApiKey: e.target.value})}
                    placeholder="API Key"
                    className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-mono text-left outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">پست پیشتاز (تومان)</label>
              <input type="number" dir="ltr" value={settings.shippingPostPrice} onChange={e => setSettings({...settings, shippingPostPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-left outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">تیپاکس (تومان)</label>
              <input type="number" dir="ltr" value={settings.shippingTipaxPrice} onChange={e => setSettings({...settings, shippingTipaxPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-left outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">ماهکس (تومان)</label>
              <input type="number" dir="ltr" value={settings.shippingMahexPrice} onChange={e => setSettings({...settings, shippingMahexPrice: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs font-bold text-left outline-none focus:border-primary" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
