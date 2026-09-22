import React, { useState } from 'react';
import { Ticket, Plus, Trash2, Edit, CheckCircle, XCircle } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

const AdminCoupons = () => {
  // دیتای نمایشی کدهای تخفیف
  const [coupons] = useState([
    { id: 1, code: 'TEAM9-GOLD', discountPercent: 15, maxDiscount: 500000, minCartValue: 2000000, usageLimit: 100, usedCount: 45, isActive: true, expiry: '۱۴۰۳/۱۲/۲۹' },
    { id: 2, code: 'BLACK-FRIDAY', discountPercent: 30, maxDiscount: 1000000, minCartValue: 5000000, usageLimit: 50, usedCount: 50, isActive: false, expiry: '۱۴۰۲/۰۹/۱۰' },
  ]);

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* هدر صفحه تخفیف‌ها */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Ticket size={24} className="text-primary" /> مدیریت کدهای تخفیف
          </h1>
          <p className="text-sm text-gray-500 mt-1">ساخت و مدیریت کمپین‌های تخفیفی Team 9</p>
        </div>
        <button className="bg-primary text-dark font-black px-6 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2">
          <Plus size={20} /> ایجاد کد تخفیف جدید
        </button>
      </div>

      {/* فرم ایجاد کد سریع (UI نمایشی) */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-lg font-black text-gray-800 mb-6 border-b border-gray-100 pb-4">ایجاد کد جدید</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div><label className="block text-xs font-bold text-gray-600 mb-2">کد تخفیف (انگلیسی)</label><input type="text" dir="ltr" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary font-mono text-sm" placeholder="YALDA-20" /></div>
          <div><label className="block text-xs font-bold text-gray-600 mb-2">درصد تخفیف (٪)</label><input type="number" dir="ltr" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm" placeholder="20" /></div>
          <div><label className="block text-xs font-bold text-gray-600 mb-2">سقف تخفیف (تومان)</label><input type="number" dir="ltr" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm" placeholder="500,000" /></div>
          <div><label className="block text-xs font-bold text-gray-600 mb-2">حداقل خرید (تومان)</label><input type="number" dir="ltr" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm" placeholder="1,500,000" /></div>
          <div><label className="block text-xs font-bold text-gray-600 mb-2">تعداد مجاز استفاده</label><input type="number" dir="ltr" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm" placeholder="100" /></div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="bg-dark text-white px-6 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors">ثبت و فعال‌سازی کد</button>
        </div>
      </div>

      {/* جدول کدهای تخفیف */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-5">کد تخفیف</th>
                <th className="px-6 py-5">مقدار / سقف</th>
                <th className="px-6 py-5">شرایط استفاده</th>
                <th className="px-6 py-5">آمار استفاده</th>
                <th className="px-6 py-5">وضعیت</th>
                <th className="px-6 py-5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-black text-primary bg-dark/5 rounded-lg m-2 inline-block px-3">{coupon.code}</td>
                  <td className="px-6 py-4">
                    <div className="font-black text-gray-900">٪{coupon.discountPercent} تخفیف</div>
                    <div className="text-xs text-gray-500 mt-1">تا سقف {formatPrice(coupon.maxDiscount)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-700">خرید بالای {formatPrice(coupon.minCartValue)}</div>
                    <div className="text-xs text-gray-500 mt-1">انقضا: {coupon.expiry}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${(coupon.usedCount/coupon.usageLimit)*100}%` }}></div>
                    </div>
                    <div className="text-xs font-bold text-gray-600">{coupon.usedCount} از {coupon.usageLimit} نفر</div>
                  </td>
                  <td className="px-6 py-4">
                    {coupon.isActive 
                      ? <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg w-max text-xs"><CheckCircle size={14}/> فعال</span>
                      : <span className="flex items-center gap-1 text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-lg w-max text-xs"><XCircle size={14}/> منقضی / غیرفعال</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={18} /></button>
                      <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AdminCoupons;
