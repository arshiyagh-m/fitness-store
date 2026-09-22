import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Save, Plus, Trash2, Box, Dumbbell, Tag, ImageIcon } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: '', slug: '', brand: '', category: 'whey', description: '', imageLink: '',
      variants: [{ sku: '', flavor: '', weight: '', price: '', discountPrice: '', stock: '', sibSalamat: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // تبدیل فیلد تکی لینک به آرایه (چون دیتابیس آرایه تصاویر می‌پذیرد)
    const finalData = { ...data, images: data.imageLink ? [data.imageLink] : [] };
    delete finalData.imageLink;
    
    setTimeout(() => {
      console.log('محصول آماده ارسال به سرور:', finalData);
      setIsSubmitting(false);
      alert('محصول با موفقیت اضافه شد!');
      navigate('/admin/products');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"><ArrowRight size={20} className="text-gray-600" /></Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Box size={24} className="text-primary" /> افزودن محصول جدید</h1>
            <p className="text-sm text-gray-500 mt-1">ثبت مکمل ورزشی همراه با تصویر و متغیرها</p>
          </div>
        </div>
        <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-primary text-dark font-black px-6 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
          <Save size={20} /> {isSubmitting ? 'در حال ذخیره...' : 'ثبت نهایی محصول'}
        </button>
      </div>

      <form className="space-y-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><Dumbbell size={20} className="text-primary" /> اطلاعات پایه</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">نام محصول</label>
              <input type="text" {...register("title", { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all" placeholder="پروتئین وی گلد..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">آدرس اینترنتی (Slug)</label>
              <input type="text" dir="ltr" {...register("slug", { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-left" placeholder="whey-gold" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">برند (Brand)</label>
              <input type="text" dir="ltr" {...register("brand", { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-left" placeholder="Optimum Nutrition" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><ImageIcon size={16}/> لینک تصویر محصول (URL)</label>
              <input type="url" dir="ltr" {...register("imageLink")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all text-left" placeholder="https://example.com/image.png" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">دسته‌بندی مکمل</label>
              <select {...register("category")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all">
                <option value="whey">پروتئین وی</option><option value="creatine">کراتین</option>
                <option value="gainer">گینر</option><option value="amino">آمینو</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2"><Tag size={20} className="text-primary" /> تنوع محصول</h2>
            <button type="button" onClick={() => append({ sku: '', flavor: '', weight: '', price: '', discountPrice: '', stock: '' })} className="bg-dark text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800"><Plus size={16} /> افزودن تنوع</button>
          </div>
          <div className="space-y-6">
            {fields.map((item, index) => (
              <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative group">
                {index > 0 && <button type="button" onClick={() => remove(index)} className="absolute top-4 left-4 p-2 bg-white text-rose-500 rounded-lg shadow-sm"><Trash2 size={18} /></button>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">SKU</label><input dir="ltr" {...register(`variants.${index}.sku`, { required: true })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">طعم</label><input {...register(`variants.${index}.flavor`)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">وزن</label><input dir="ltr" {...register(`variants.${index}.weight`)} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">قیمت (تومان)</label><input type="number" dir="ltr" {...register(`variants.${index}.price`, { required: true })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">موجودی</label><input type="number" dir="ltr" {...register(`variants.${index}.stock`, { required: true })} className="w-full px-3 py-2 border rounded-lg text-sm" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
export default AdminAddProduct;
