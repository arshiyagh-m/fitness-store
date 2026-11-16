import React, { useState, useEffect } from 'react';
import { Settings, Save, ShieldCheck, Smartphone, Loader2, DollarSign, CreditCard } from 'lucide-react';
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
    freeShippingThreshold: 1500000,
    siteName: 'Team 9',
    phoneSupport: '021-12345678',
    announcementText: '🔥 ارسال به سراسر کشور با پست پیشتاز، تیپاکس و ماهکس'
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
      alert('تنظیمات درگاه رسمی دیجی‌پی و سایر وب‌سرویس‌ها با موفقیت در دیتابیس ثبت شد!');
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
          <p className="text-xs text-gray-400 mt-1">اتصال مستقیم به سامانه پرداخت هوشمند Digipay و وب‌سرویس‌های تجاری</p>
        </div>
        <button 
          onClick={handleSaveAll} 
          disabled={isSaving}
          className="bg-primary text-dark font-black px-8 py-3.5 rounded-2xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2 shadow-primary/20"
        >
          <Save size={18} /> {isSaving ? 'در حال ثبت در دیتابیس...' : 'ذخیره و فعال‌سازی درگاه دیجی‌پی'}
        </button>
      </div>

      <div className="flex bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm gap-2 mb-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('apis')} 
          className={`flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'apis' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark'}`}
        >
          درگاه دیجی‌پی و وب‌سرویس‌ها
        </button>
        <button 
          onClick={() => setActiveTab('logistics')} 
          className={`flex-1 min-w-[150px] py-3 rounded-xl text-xs font-black transition-all ${activeTab === 'logistics' ? 'bg-dark text-primary shadow-md' : 'text-gray-500 hover:text-dark'}`}
        >
          تعرفه‌های پستی ۳ حامل
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
        
        {activeTab === 'apis' && (
          <div className="space-y-8">
            
            {/* بخش اختصاصی درگاه رسمی دیجی‌پی */}
            <div className="p-6 bg-blue-50/40 rounded-3xl border-2 border-blue-200 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-blue-200">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-blue-600" size={24} />
                  <div>
                    <h3 className="font-black text-sm text-gray-900">پیکربندی درگاه اختصاصی یکپارچه دیجی‌پی (Digipay IPG)</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">اطلاعات دریافتی از پنل پذیرندگان business.mydigipay.com را در کادرهای زیر وارد کنید:</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-blue-600 text-white px-3 py-1 rounded-full">درگاه رسمی دیجی‌کالا</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نوع درگاه پرداخت فعال در سایت</label>
                  <select 
                    value={settings.paymentGatewayProvider} 
                    onChange={e => setSettings({...settings, paymentGatewayProvider: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-black outline-none focus:border-blue-500"
                  >
                    <option value="simulator">شبیه‌ساز تستی (فعلی - بدون کسر پول)</option>
                    <option value="digipay">درگاه زنده دیجی‌پی رسمی (اتصال مستقیم به کارت‌های شتاب)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">نام کاربری (Username)</label>
                  <input 
                    type="text" 
                    dir="ltr"
                    value={settings.digipayUsername} 
                    onChange={e => setSettings({...settings, digipayUsername: e.target.value})}
                    placeholder="مثال: danaljokerl"
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
                    placeholder="مثال: danaljokerl-client-id"
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
                    placeholder="Client Secret دیجی‌پی"
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
                    placeholder="Password دیجی‌پی"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-mono font-bold text-left outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-blue-100/60 rounded-2xl text-[11px] text-blue-900 leading-relaxed font-medium">
                💡 <strong>راهنما:</strong> به محض اینکه فیلدهای بالا را ذخیره کرده و وضعیت را روی <strong>«درگاه زنده دیجی‌پی»</strong> بگذارید، تمام مشتریان در مرحله ثبت سفارش، مستقیماً وارد درگاه شاپرکی دیجی‌پی می‌شوند و مبالغ به شماره شبای شما در دیجی‌پی واریز خواهد شد.
              </div>
            </div>

            {/* سامانه پیامک */}
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
                <Smartphone className="text-primary" size={20} />
                <h4 className="font-bold text-xs text-gray-900">تنظیمات سامانه پیامک خودکار (کاوه‌نگار / فراز)</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">انتخاب وب‌سرویس</label>
                  <select 
                    value={settings.smsProvider} 
                    onChange={e => setSettings({...settings, smsProvider: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border rounded-xl text-xs font-bold outline-none focus:border-primary"
              

cd /workspaces/fitness-store

# 1. ساخت ماژول ارتباطی رسمی با وب‌سرویس دیجی‌پی (digipayService.js)
cat << 'EOF' > server/src/utils/digipayService.js
import axios from 'axios';
import Setting from '../models/Setting.js';

// ۱. دریافت توکن امنیتی OAuth2 از دیجی‌پی
export const getDigipayToken = async (setting) => {
  const credentials = Buffer.from(`${setting.digipayClientId}:${setting.digipayClientSecret}`).toString('base64');
  
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', setting.digipayUsername);
  params.append('password', setting.digipayPassword);

  const response = await axios.post('https://api.mydigipay.com/digipay/api/oauth/token', params, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });

  return response.data.access_token;
};

// ۲. ساخت تیکت پرداخت و دریافت لینک درگاه بانکی
export const createDigipayTicket = async ({ order, amountInRials, callbackUrl }) => {
  const setting = await Setting.findOne();
  if (!setting || !setting.digipayClientId) {
    throw new Error('تنظیمات درگاه دیجی‌پی در پنل ادمین ثبت نشده است');
  }

  const token = await getDigipayToken(setting);

  const response = await axios.post(
    'https://api.mydigipay.com/digipay/api/tickets/business?type=0',
    {
      amount: amountInRials, // مبلغ به ریال
      callbackUrl,
      cellNumber: order.shippingAddress.phone,
      providerId: order._id.toString(),
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  const ticketToken = response.data.ticketToken;
  const redirectUrl = response.data.redirectUrl || `https://api.mydigipay.com/digipay/api/purchases/ipg/pay?ticketToken=${ticketToken}`;

  return { ticketToken, redirectUrl };
};

// ۳. وریفای و تایید قطعی تراکنش پس از بازگشت مشتری از درگاه
export const verifyDigipayPayment = async (trackingCode) => {
  const setting = await Setting.findOne();
  const token = await getDigipayToken(setting);

  const response = await axios.post(
    `https://api.mydigipay.com/digipay/api/purchases/verify?trackingCode=${trackingCode}`,
    {},
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
};
