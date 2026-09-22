import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, Activity, PieChart, Receipt, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const AdminAccounting = () => {
  const [expenses, setExpenses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // فرم ثبت سند هزینه
  const [formData, setFormData] = useState({
    title: '',
    category: 'خرید مکمل و بار انبار',
    amount: '',
    note: ''
  });

  const fetchData = async () => {
    try {
      const [expRes, ordRes] = await Promise.all([
        api.get('/expenses'),
        api.get('/orders')
      ]);
      setExpenses(expRes.data);
      setOrders(ordRes.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return alert('لطفاً عنوان و مبلغ هزینه را وارد کنید.');
    setIsSubmitting(true);

    try {
      const { data } = await api.post('/expenses', formData);
      setExpenses([data, ...expenses]);
      setFormData({ title: '', category: 'خرید مکمل و بار انبار', amount: '', note: '' });
      alert('سند هزینه با موفقیت در تراز مالی ثبت شد!');
    } catch (err) {
      alert('خطا در ثبت سند مالی');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id, title) => {
    if (window.confirm(`آیا از حذف سند مالی "${title}" اطمینان دارید؟`)) {
      try {
        await api.delete(`/expenses/${id}`);
        setExpenses(expenses.filter(e => e._id !== id));
      } catch (err) {
        alert('خطا در حذف سند');
      }
    }
  };

  // 🎯 محاسبات خودکار تراز مالیاتی و سود خالص
  const totalRevenue = orders.filter(o => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto pb-16 font-sans">
      
      {/* هدر */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Receipt size={24} className="text-primary" /> مدیریت حسابداری و تراز سود خالص
          </h1>
          <p className="text-xs text-gray-400 mt-1">محاسبه خودکار درآمد فروش، هزینه‌های جاری و سود نهایی Team 9</p>
        </div>
      </div>

      {/* کارت‌های شاخص حسابداری (تراز مالی زنده) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* درآمد کل */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black shrink-0">
            <ArrowUpRight size={28}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">کل درآمد فروش (ناخالص)</p>
            <p className="text-xl font-black text-emerald-600 mt-1">{formatPrice(totalRevenue)} <span className="text-xs font-normal">تومان</span></p>
          </div>
        </div>

        {/* کل هزینه‌ها */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center font-black shrink-0">
            <ArrowDownRight size={28}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">مجموع هزینه‌های جاری</p>
            <p className="text-xl font-black text-rose-600 mt-1">{formatPrice(totalExpenses)} <span className="text-xs font-normal">تومان</span></p>
          </div>
        </div>

        {/* سود خالص (Net Profit) */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-primary/20 text-dark rounded-2xl flex items-center justify-center font-black shrink-0">
            <DollarSign size={28}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">سود خالص قطعی (Net Profit)</p>
            <p className={`text-xl font-black mt-1 ${netProfit >= 0 ? 'text-gray-900' : 'text-rose-600'}`}>
              {formatPrice(netProfit)} <span className="text-xs font-normal">تومان</span>
            </p>
          </div>
        </div>

        {/* حاشیه سود */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black shrink-0">
            <PieChart size={28}/>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold">حاشیه سود بیزینس</p>
            <p className="text-xl font-black text-blue-600 mt-1">٪{profitMargin}</p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* فرم ثبت سند هزینه جدید */}
        <div className="lg:col-span-1">
          <form onSubmit={handleCreateExpense} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4 sticky top-24">
            <h2 className="font-black text-gray-900 text-base pb-3 border-b border-gray-100 flex items-center gap-2">
              <Plus size={18} className="text-primary"/> ثبت سند هزینه جدید
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">عنوان هزینه</label>
              <input 
                required
                type="text" 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="مثال: خرید پارت جدید پروتئین وی" 
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">سرفصل / دسته‌بندی</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary font-bold"
              >
                <option value="خرید مکمل و بار انبار">خرید مکمل و بار انبار</option>
                <option value="تبلیغات و اسپانسرینگ">تبلیغات، بلاگرها و اینفلوئنسر</option>
                <option value="لجستیک و بسته‌بندی">هزینه کارتن، پست و پیک</option>
                <option value="حقوق و دستمزد">حقوق پرسنل و مربیان</option>
                <option value="اجاره و قبوض">اجاره انبار و سرور</option>
                <option value="سایر هزینه‌ها">سایر هزینه‌های متفرقه</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">مبلغ پرداختی (تومان)</label>
              <input 
                required
                type="number" 
                dir="ltr"
                value={formData.amount} 
                onChange={e => setFormData({...formData, amount: e.target.value})}
                placeholder="مثال: 15000000" 
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-left outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">توضیحات و شماره فاکتور (اختیاری)</label>
              <textarea 
                rows="3" 
                value={formData.note} 
                onChange={e => setFormData({...formData, note: e.target.value})}
                placeholder="یادداشت تکمیلی..." 
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-primary resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-dark text-primary hover:bg-gray-800 font-black py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 text-xs disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Plus size={16}/>}
              ثبت سند در دفتر حسابداری
            </button>
          </form>
        </div>

        {/* دفتر معین و لیست هزینه‌ها */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-black text-gray-900 text-sm">دفتر ریز هزینه‌های ثبت‌شده</h3>
              <span className="text-xs text-gray-400 font-bold">{expenses.length} سند مالی</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead className="bg-gray-50/60 text-gray-400 text-xs font-bold border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-5">عنوان سند</th>
                    <th className="py-4 px-5">سرفصل</th>
                    <th className="py-4 px-5">تاریخ ثبت</th>
                    <th className="py-4 px-5">مبلغ هزینه</th>
                    <th className="py-4 px-5 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-16"><Loader2 className="animate-spin text-primary mx-auto" size={32}/></td></tr>
                  ) : expenses.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-12 text-gray-400 font-bold">هیچ سندی هنوز ثبت نشده است.</td></tr>
                  ) : (
                    expenses.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-5">
                          <span className="font-bold text-gray-900 block text-xs">{item.title}</span>
                          {item.note && <span className="text-[11px] text-gray-400 block mt-0.5">{item.note}</span>}
                        </td>
                        <td className="py-4 px-5">
                          <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-xs text-gray-400">
                          {new Date(item.date).toLocaleDateString('fa-IR')}
                        </td>
                        <td className="py-4 px-5 font-black text-rose-600 text-xs">
                          {formatPrice(item.amount)} تومان
                        </td>
                        <td className="py-4 px-5 text-center">
                          <button 
                            onClick={() => handleDeleteExpense(item._id, item.title)}
                            className="p-1.5 text-gray-300 hover:text-rose-500 rounded-lg transition-colors" 
                            title="حذف سند"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminAccounting;
