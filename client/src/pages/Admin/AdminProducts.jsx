import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Box, Activity, AlertCircle, Dumbbell, TrendingUp, Percent, X, Check } from 'lucide-react';
import useProductStore from '../../store/productStore';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { formatPrice } from '../../utils/formatters';

const AdminProducts = () => {
  const { products, fetchProducts, deleteProduct, isLoading, error } = useProductStore();
  const navigate = useNavigate();

  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [percentage, setPercentage] = useState(5);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      await deleteProduct(id);
    }
  };

  const handleApplyBulkPrice = async (e) => {
    e.preventDefault();
    if (!percentage || isNaN(percentage)) return alert('لطفاً یک درصد معتبر وارد کنید.');
    setBulkLoading(true);

    try {
      const { data } = await api.put('/products/bulk/adjust-prices', {
        percentage: Number(percentage),
        roundToThousand: true
      });

      alert(data.message);
      setIsBulkOpen(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در تغییر قیمت‌ها');
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 font-sans" dir="rtl">
      
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Box size={24} className="text-primary" /> مدیریت محصولات
          </h1>
          <p className="text-sm text-gray-500 mt-1">لیست تمام مکمل‌ها، متغیرها و موجودی انبار</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* دکمه تغییر درصدی قیمت */}
          <button 
            type="button"
            onClick={() => setIsBulkOpen(true)}
            className="bg-dark hover:bg-gray-800 text-primary px-5 py-3 rounded-xl font-black text-xs transition-all shadow-md flex items-center gap-2 border border-gray-700"
          >
            <TrendingUp size={16} /> افزایش / کاهش درصدی قیمت‌ها
          </button>

          <Link to="/admin/products/add" className="bg-primary text-dark px-6 py-3 rounded-xl font-black shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center gap-2">
            <Plus size={20} /> افزودن محصول جدید
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex items-center gap-2 font-bold text-xs">
          <AlertCircle size={20} />{error}
        </div>
      )}

      {/* جدول محصولات */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-5">محصول</th>
                <th className="px-6 py-5">دسته‌بندی</th>
                <th className="px-6 py-5">شروع قیمت</th>
                <th className="px-6 py-5">تنوع</th>
                <th className="px-6 py-5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400"><Activity className="animate-spin mx-auto mb-2 text-primary" size={24} />در حال دریافت اطلاعات...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400"><Dumbbell className="mx-auto mb-3 opacity-50" size={32} />هیچ محصولی یافت نشد.</td></tr>
              ) : (
                products.map((product) => {
                  const minPrice = product.variants?.[0]?.discountPrice || product.variants?.[0]?.price || 0;
                  return (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden">
                            {product.images && product.images[0] ? (
                              <img src={product.images[0]} alt={product.title} className="w-full h-full object-contain" />
                            ) : (
                              <Dumbbell size={24} className="text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 line-clamp-1">{product.title}</div>
                            <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-mono">{product.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">{product.category}</span></td>
                      <td className="px-6 py-4 font-black text-gray-900 text-sm">{formatPrice(minPrice)} تومان</td>
                      <td className="px-6 py-4 text-gray-500"><span className="font-bold text-gray-800">{product.variants?.length || 0}</span> تنوع</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => navigate('/admin/products/edit/' + product._id)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors" title="ویرایش">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDelete(product._id, product.title)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="حذف">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* مودال تغییر درصدی قیمت */}
      {isBulkOpen && (
        <div className="fixed inset-0 bg-dark/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/20 text-dark rounded-xl"><Percent size={20} /></div>
                <h3 className="font-black text-gray-900 text-base">تغییر درصدی قیمت کلیه محصولات</h3>
              </div>
              <button onClick={() => setIsBulkOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <form onSubmit={handleApplyBulkPrice} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">درصد تغییر قیمت (مثبت برای افزایش، منفی برای کاهش)</label>
                <div className="relative">
                  <input 
                    required 
                    type="number" 
                    step="0.5" 
                    value={percentage} 
                    onChange={e => setPercentage(e.target.value)}
                    placeholder="مثال: 5 یا -5" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-primary font-mono text-center text-lg font-black"
                  />
                  <span className="absolute left-4 top-3.5 text-sm font-bold text-gray-400">٪</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] text-gray-400 font-bold block mb-2">درصدهای پیشنهادی:</span>
                <div className="flex flex-wrap gap-2">
                  {[3, 5, 8, 10, 15, -5, -10].map(val => (
                    <button 
                      key={val} 
                      type="button" 
                      onClick={() => setPercentage(val)}
                      className="px-3 py-1.5 rounded-xl text-xs font-black bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors"
                    >
                      {val > 0 ? ('+' + val + '٪') : (val + '٪')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed font-medium">
                قیمت تمام تنوع‌های طعم و وزن در دیتابیس به صورت خودکار به نزدیک‌ترین ۱,۰۰۰ تومان رُند خواهد شد.
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsBulkOpen(false)} className="px-5 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl">انصراف</button>
                <button 
                  type="submit" 
                  disabled={bulkLoading}
                  className="bg-primary hover:bg-primary-hover text-dark font-black px-6 py-2.5 rounded-2xl text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                  {bulkLoading ? <Activity className="animate-spin" size={16}/> : <Check size={16}/>}
                  اعمال تغییر قیمت در دیتابیس
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;
