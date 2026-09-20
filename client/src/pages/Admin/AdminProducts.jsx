// filepath: client/src/pages/Admin/AdminProducts.jsx
import React, { useEffect } from 'react';
import { Plus, Edit, Trash2, Box, Activity, AlertCircle, Dumbbell } from 'lucide-react';
import useProductStore from '../../store/productStore';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const { products, fetchProducts, deleteProduct, isLoading, error } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`آیا از حذف "${name}" مطمئن هستید؟`)) {
      await deleteProduct(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* هدر صفحه ادمین */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Box size={28} className="text-primary" />
            مدیریت محصولات
          </h1>
          <p className="text-sm text-gray-500 mt-1">لیست تمام مکمل‌ها، متغیرها و موجودی انبار</p>
        </div>
        <button className="bg-gradient-to-r from-primary to-rose-500 hover:from-primary-hover hover:to-rose-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:shadow-primary/30 transition-all flex items-center gap-2">
          <Plus size={20} />
          افزودن محصول جدید
        </button>
      </div>

      {/* وضعیت لودینگ و خطا */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* کارت جدول محصولات */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-5">محصول</th>
                <th className="px-6 py-5">دسته‌بندی</th>
                <th className="px-6 py-5">متغیرها (طعم/وزن)</th>
                <th className="px-6 py-5">وضعیت</th>
                <th className="px-6 py-5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                    <Activity className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    در حال دریافت اطلاعات...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                    <Dumbbell className="mx-auto mb-3 opacity-50" size={32} />
                    هیچ محصولی یافت نشد.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.title} className="w-10 h-10 object-contain" />
                          ) : (
                            <Box size={24} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 line-clamp-1">{product.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="font-bold text-gray-700">{product.variants?.length || 0}</span> تنوع
                    </td>
                    <td className="px-6 py-4">
                      {product.isActive ? (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 px-2.5 py-1 rounded-lg text-xs font-bold border border-gray-200">
                          <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                          غیرفعال
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors tooltip" title="ویرایش">
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id, product.title)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" 
                          title="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
