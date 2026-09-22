import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Save, Plus, Trash2, Box, Dumbbell, Tag, ShieldCheck } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // استفاده از فرم‌های پیشرفته با React Hook Form
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: '', slug: '', brand: '', category: 'whey', description: '',
      variants: [{ sku: '', flavor: '', weight: '', price: '', discountPrice: '', stock: '', sibSalamat: '' }]
    }
  });

  // برای افزودن و حذف پویا (Dynamic) فرم متغیرهای کالا (تنوع طعم و وزن)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    // شبیه‌سازی ارسال به بک‌اند (چون در نسخه نمایشی هستیم)
    setTimeout(() => {
      console.log('محصول برای ارسال به سرور آماده است:', data);
      setIsSubmitting(false);
      alert('محصول با موفقیت اضافه شد!');
      navigate('/admin/products');
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      
      {/* هدر صفحه */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <ArrowRight size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <Box size={24} className="text-primary" />
              افزودن محصول جدید
            </h1>
            <p className="text-sm text-gray-500 mt-1">ثبت مکمل ورزشی همراه با تنوع طعم و وزن</p>
          </div>
        </div>
        <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-primary text-dark font-black px-6 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
          <Save size={20} />
          {isSubmitting ? 'در حال ذخیره...' : 'ثبت نهایی محصول'}
        </button>
      </div>

      <form className="space-y-8">
        {/* اطلاعات پایه محصول */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Dumbbell size={20} className="text-primary" /> اطلاعات پایه
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">نام محصول</label>
              <input type="text" {...register("title", { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all" placeholder="مثال: پروتئین وی گلد استاندارد..." />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">آدرس اینترنتی (Slug)</label>
              <input type="text" dir="ltr" {...register("slug", { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all" placeholder="optimum-nutrition-whey" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">برند (Brand)</label>
              <input type="text" dir="ltr" {...register("brand", { required: true })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all" placeholder="Optimum Nutrition" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">دسته‌بندی مکمل</label>
              <select {...register("category")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all">
                <option value="whey">پروتئین وی</option>
                <option value="creatine">کراتین</option>
                <option value="gainer">گینر و کربوهیدرات</option>
                <option value="amino">آمینو و BCAA</option>
                <option value="pre-workout">پمپ و قبل تمرین</option>
                <option value="fat-burner">چربی‌سوز</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">توضیحات و نقد و بررسی</label>
              <textarea rows="4" {...register("description")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* بخش جادویی متغیرها (Variants) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Tag size={20} className="text-primary" /> تنوع محصول (طعم، وزن، قیمت)
            </h2>
            <button type="button" onClick={() => append({ sku: '', flavor: '', weight: '', price: '', discountPrice: '', stock: '', sibSalamat: '' })} className="bg-dark text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors">
              <Plus size={16} /> افزودن تنوع جدید
            </button>
          </div>

          <div className="space-y-6">
            {fields.map((item, index) => (
              <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative group">
                {/* دکمه حذف تنوع */}
                {index > 0 && (
                  <button type="button" onClick={() => remove(index)} className="absolute top-4 left-4 p-2 bg-white text-rose-500 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50">
                    <Trash2 size={18} />
                  </button>
                )}
                
                <h3 className="text-sm font-black text-gray-800 mb-4">تنوع شماره {index + 1}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">کد انبار (SKU)</label>
                    <input type="text" dir="ltr" {...register(`variants.${index}.sku`, { required: true })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary text-sm" placeholder="ON-WHEY-CH-5LBS" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">طعم</label>
                    <input type="text" {...register(`variants.${index}.flavor`)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary text-sm" placeholder="دابل چاکلت" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">وزن / تعداد</label>
                    <input type="text" dir="ltr" {...register(`variants.${index}.weight`)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary text-sm" placeholder="2.27 kg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">قیمت اصلی (تومان)</label>
                    <input type="number" dir="ltr" {...register(`variants.${index}.price`, { required: true })} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary text-sm" placeholder="4500000" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-rose-500 mb-1">قیمت با تخفیف (اختیاری)</label>
                    <input type="number" dir="ltr" {...register(`variants.${index}.discountPrice`)} className="w-full px-3 py-2 bg-white border border-rose-200 rounded-lg outline-none focus:border-rose-500 text-sm" placeholder="4200000" />
                  </div>
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-xs font-bold text-emerald-600 mb-1">موجودی انبار</label>
                      <input type="number" dir="ltr" {...register(`variants.${index}.stock`, { required: true })} className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-lg outline-none focus:border-emerald-500 text-sm" placeholder="50" />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-xs font-bold text-gray-600 mb-1 flex items-center gap-1"><ShieldCheck size={14}/> سیب سلامت</label>
                      <input type="text" dir="ltr" {...register(`variants.${index}.sibSalamat`)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:border-primary text-sm" placeholder="کد 16 رقمی" />
                    </div>
                  </div>
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
