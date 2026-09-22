import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Save, Plus, Trash2, Box, Dumbbell, Tag, ImageIcon, Loader2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../../services/api';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      title: '', slug: '', brand: '', category: 'whey', description: '', imageLinks: '',
      variants: [{ sku: '', flavor: '', weight: '', price: '', discountPrice: '', stock: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        reset({
          title: data.title,
          slug: data.slug,
          brand: data.brand,
          category: data.category,
          description: data.description,
          imageLinks: data.images?.join(', ') || '',
          variants: data.variants || []
        });
        setLoading(false);
      } catch (err) {
        alert('خطا در دریافت اطلاعات محصول');
        navigate('/admin/products');
      }
    };
    fetchProduct();
  }, [id, reset, navigate]);

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const imagesArray = formData.imageLinks
        ? formData.imageLinks.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      const payload = {
        ...formData,
        images: imagesArray,
      };
      delete payload.imageLinks;

      await api.put(`/products/${id}`, payload);
      alert('محصول با موفقیت به‌روزرسانی شد!');
      navigate('/admin/products');
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در ویرایش محصول');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20 font-bold">در حال فراخوانی مشخصات محصول...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><ArrowRight size={20} /></Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Box size={24} className="text-primary" /> ویرایش محصول</h1>
            <p className="text-sm text-gray-500 mt-1">تغییر موجودی، قیمت و تصاویر مکمل</p>
          </div>
        </div>
        <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-primary text-dark font-black px-6 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2">
          {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          ذخیره تغییرات
        </button>
      </div>

      <form className="space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Dumbbell size={20} className="text-primary" /> مشخصات اصلی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">نام محصول</label>
              <input type="text" {...register("title", { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
              <input type="text" dir="ltr" {...register("slug", { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-left" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">برند</label>
              <input type="text" dir="ltr" {...register("brand", { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-left" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1">
                <ImageIcon size={16}/> لینک تصاویر (چند تصویر را با کاما , جدا کنید)
              </label>
              <input type="text" dir="ltr" {...register("imageLinks")} placeholder="https://img1.png, https://img2.png" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-left" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">توضیحات</label>
              <textarea rows="4" {...register("description")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* متغیرها */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Tag size={20} className="text-primary" /> ویرایش تنوع و موجودی انبار
            </h2>
            <button type="button" onClick={() => append({ sku: '', flavor: '', weight: '', price: '', discountPrice: '', stock: '' })} className="bg-dark text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800">
              <Plus size={16} /> افزودن تنوع جدید
            </button>
          </div>
          <div className="space-y-6">
            {fields.map((item, index) => (
              <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative group">
                {index > 0 && (
                  <button type="button" onClick={() => remove(index)} className="absolute top-4 left-4 p-2 bg-white text-rose-500 rounded-lg shadow-sm">
                    <Trash2 size={18} />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">SKU</label><input dir="ltr" {...register(`variants.${index}.sku`)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">طعم</label><input {...register(`variants.${index}.flavor`)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">وزن</label><input dir="ltr" {...register(`variants.${index}.weight`)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">قیمت اصلی (تومان)</label><input type="number" dir="ltr" {...register(`variants.${index}.price`)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" /></div>
                  <div><label className="block text-xs font-bold text-rose-500 mb-1">قیمت تخفیف‌دار</label><input type="number" dir="ltr" {...register(`variants.${index}.discountPrice`)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" /></div>
                  <div><label className="block text-xs font-bold text-emerald-600 mb-1">موجودی انبار</label><input type="number" dir="ltr" {...register(`variants.${index}.stock`)} className="w-full px-3 py-2 border rounded-lg text-sm bg-white" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;
