import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, CheckCircle, XCircle, Activity, ArrowRight, Loader2 } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';
import api from '../../services/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // استیت فرم ساخت کد جدید
  const [formData, setFormData] = useState({
    code: '',
    discountPercent: '',
    maxDiscount: '',
    minCartValue: '',
    usageLimit: '',
  });

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.discountPercent) {
      return alert('لطفاً عنوان کد و درصد تخفیف را وارد کنید');
    }
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/coupons', formData);
      setCoupons([data, ...coupons]);
      setFormData({ code: '', discountPercent: '', maxDiscount: '', minCartValue: '', usageLimit: '' });
      alert('کد تخفیف با موفقیت در دیتابیس ساخته شد و فعال گردید!');
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در ثبت کد تخفیف');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id, code) => {
    if (window.confirm(`آیا از حذف کد تخفیف "${code}" اطمینان دارید؟`)) {
      try {
        await api.delete(`/coupons/${id}`);
        setCoupons(coupons.filter(c => c._id !== id));
      } catch (err) {
        alert('خطا در حذف کد');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 font-sans">
      
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Ticket size={24} className="text-primary" /> مدیریت و ساخت کدهای تخفیف (کوپن‌ها)
          </h1>
          <p className="text-xs text-gray-400 mt-1">ایجاد کمپین‌های تخفیفی، تعیین محدودیت‌ها و ظرفیت استفاده</p>
        </div>
      </div>

      {/* فرم واقعی ایجاد کد جدید */}
      <form onSubmit={handleCreateCoupon} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 space-y-6">
        <h2 className="text-base font-black text-gray-800 border-b border-gray-100 pb-3">تعریف کد تخفیف جدید</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">کد لاتین (کد ورودی مشتری)</label>
            <input 
              required 
              type="text" 
              dir="ltr" 
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value})} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary font-mono text-sm uppercase text-left font-bold" 
              placeholder="FIT-20" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">درصد تخفیف (٪)</label>
            <input 
              required 
              type="number" 
              dir="ltr" 
              min="1" 
              max="100" 
              value={formData.discountPercent} 
              onChange={e => setFormData({...formData, discountPercent: e.target.value})} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm font-bold text-center" 
              placeholder="مثال: 20" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">سقف تخفیف (تومان)</label>
            <input 
              type="number" 
              dir="ltr" 
              value={formData.maxDiscount} 
              onChange={e => setFormData({...formData, maxDiscount: e.target.value})} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm text-center" 
              placeholder="مثال: 400000" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">حداقل سبد خرید (تومان)</label>
            <input 
              type="number" 
              dir="ltr" 
              value={formData.minCartValue} 
              onChange={e => setFormData({...formData, minCartValue: e.target.value})} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm text-center" 
              placeholder="مثال: 1500000" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">تعداد ظرفیت استفاده</label>
            <input 
              type="number" 
              dir="ltr" 
              value={formData.usageLimit} 
              onChange={e => setFormData({...formData, usageLimit: e.target.value})} 
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-sm text-center font-bold" 
              placeholder="مثال: 50" 
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-primary hover:bg-primary-hover text-dark font-black px-8 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : <Plus size={18}/>}
            ثبت و فعال‌سازی آنی کد تخفیف
          </button>
        </div>
      </form>

      {/* جدول کدهای تخفیف دیتابیس */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-right">
          <thead className="bg-gray-50/50 text-gray-400 uppercase text-xs font-bold border-b border-gray-100">
            <tr>
              <th className="px-6 py-5">کد تخفیف</th>
              <th className="px-6 py-5">مقدار تخفیف</th>
              <th className="px-6 py-5">شرایط سبد</th>
              <th className="px-6 py-5">استفاده شده</th>
              <th className="px-6 py-5 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-12"><Activity className="animate-spin text-primary mx-auto" size={32}/></td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-gray-400 font-bold">هیچ کد تخفیفی تاکنون ایجاد نشده است.</td></tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-black text-primary bg-dark px-3 py-1 rounded-lg inline-block text-sm">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-gray-900">٪{coupon.discountPercent} تخفیف</span>
                    {coupon.maxDiscount && coupon.maxDiscount < 999999999 && (
                      <span className="text-xs text-gray-400 block mt-0.5">تا سقف {formatPrice(coupon.maxDiscount)} تومان</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-gray-600">
                    {coupon.minCartValue > 0 ? `حداقل خرید ${formatPrice(coupon.minCartValue)} تومان` : 'بدون محدودیت حداقل'}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold">
                    <span className="text-primary font-black">{coupon.usedCount}</span> از {coupon.usageLimit} نفر
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDeleteCoupon(coupon._id, coupon.code)} 
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" 
                      title="حذف کد"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminCoupons;
