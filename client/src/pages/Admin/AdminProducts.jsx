import React, { useEffect } from 'react';
import { Plus, Edit, Trash2, Box, Activity, AlertCircle, Dumbbell } from 'lucide-react';
import useProductStore from '../../store/productStore';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatters';

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
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
            <Box size={24} className="text-primary" />
            مدیریت محصولات
          </h1>
          <p className="text-sm text-gray-500 mt-1">لیست تمام مکمل‌ها، متغیرها و موجودی انبار</p>
        </div>
        {/* لینک شدن دکمه به صفحه Add Product */}
        <Link to="/admin/products/add" className="bg-primary text-dark px-6 py-3 rounded-xl font-black shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all flex items-center gap-2">
          <Plus size={20} />
          افزودن محصول جدید
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 flex items-center gap-2 font-bold">
          <AlertCircle size={20} />{error}
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right">
            <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-5">محصول</th>
                <th className="px-6 py-5">دسته‌بندی</th>
                <th className="px-6 py-5">تنوع</th>
                <th className="px-6 py-5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400"><Activity className="animate-spin mx-auto mb-2 text-primary" size={24} />در حال دریافت اطلاعات...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-400"><Dumbbell className="mx-auto mb-3 opacity-50" size={32} />هیچ محصولی یافت نشد.</td></tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
                          <Dumbbell size={24} className="text-gray-400" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-800 line-clamp-1">{product.title}</div>
                          <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold text-gray-600">{product.category}</span></td>
                    <td className="px-6 py-4 text-gray-500"><span className="font-bold text-gray-800">{product.variants?.length || 0}</span> تنوع ثبت شده</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(product._id, product.title)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
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
