import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Save, Plus, Trash2, Box, Dumbbell, Tag, ImageIcon, Activity, ShieldCheck, Flame, Globe, Upload } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../../services/api';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageList, setImageList] = useState([]);

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: '', slug: '', brand: '', category: 'whey', description: '',
      country: 'آمریکا', targetGoal: 'عضله‌سازی و ریکاوری', form: 'پودر', servingSize: '30 گرم', servingsPerContainer: 70,
      protein: '24', bcaa: '5.5', calories: '120', carbs: '3', sugar: '1',
      variants: [{ sku: '', flavor: 'دابل چاکلت', weight: '2.27 کیلوگرم', price: '', discountPrice: '', stock: '20', sibSalamat: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  // تابع آپلود مستقیم فایل از سیستم به سرور محلی
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImageList([...imageList, data]);
    } catch (err) {
      alert('خطا در آپلود عکس');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImageList(imageList.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        slug: data.slug.toLowerCase().trim().replace(/\s+/g, '-'),
        brand: data.brand,
        category: data.category,
        description: data.description,
        images: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600'],
        attributes: {
          country: data.country,
          targetGoal: data.targetGoal,
          form: data.form,
          servingSize: data.servingSize,
          servingsPerContainer: Number(data.servingsPerContainer),
        },
        nutritionFacts: {
          protein: data.protein,
          bcaa: data.bcaa,
          calories: data.calories,
          carbs: data.carbs,
          sugar: data.sugar,
        },
        variants: data.variants.map(v => ({
          ...v,
          price: Number(v.price),
          discountPrice: v.discountPrice ? Number(v.discountPrice) : null,
          stock: Number(v.stock),
        }))
      };

      await api.post('/products', payload);
      alert('مکمل با موفقیت به همراه عکس‌های محلی در دیتابیس ثبت شد!');
      navigate('/admin/products');
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در ثبت محصول');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 font-sans">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><ArrowRight size={20} className="text-gray-600" /></Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Box size={24} className="text-primary" /> ثبت تخصصی مکمل ورزشی</h1>
            <p className="text-sm text-gray-500 mt-1">با قابلیت آپلود فایل از کامپیوتر</p>
          </div>
        </div>
        <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-primary text-dark font-black px-6 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
          {isSubmitting ? <Activity className="animate-spin" size={20} /> : <Save size={20} />}
          ذخیره محصول در دیتابیس
        </button>
      </div>

      <form className="space-y-8">
        
        {/* اطلاعات عمومی */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Dumbbell size={20} className="text-primary" /> اطلاعات عمومی مکمل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">نام کامل مکمل</label>
              <input required type="text" {...register("title")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary" placeholder="پروتئین وی گلد..." />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">شناسه یکتا URL</label>
              <input required type="text" dir="ltr" {...register("slug")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-left" placeholder="gold-whey" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">برند سازنده</label>
              <input required type="text" dir="ltr" {...register("brand")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary text-left" placeholder="Optimum Nutrition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">دسته‌بندی</label>
              <select {...register("category")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary font-bold">
                <option value="whey">پروتئین وی</option><option value="creatine">کراتین</option><option value="gainer">گینر</option><option value="amino">آمینو</option><option value="pre-workout">پمپ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">هدف مصرف</label>
              <input type="text" {...register("targetGoal")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary" placeholder="عضله‌سازی" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">توضیحات و نقد و بررسی</label>
              <textarea rows="3" {...register("description")} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-primary resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* آپلود مستقیم تصاویر از سیستم */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Upload size={20} className="text-primary" /> آپلود مستقیم تصاویر از کامپیوتر
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <label className="bg-dark text-primary hover:bg-gray-800 px-6 py-3.5 rounded-2xl cursor-pointer font-bold flex items-center gap-2 transition-all shadow-md">
              {uploading ? <Activity className="animate-spin" size={18} /> : <Upload size={18} />}
              انتخاب عکس از کامپیوتر
              <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
            </label>
            <span className="text-xs text-gray-400">فرمت‌های مجاز: JPG, PNG, WEBP (ذخیره مستقیم در سرور محلی)</span>
          </div>

          {/* پیش‌نمایش عکس‌های آپلود شده */}
          {imageList.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-4 border-t border-gray-100">
              {imageList.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 p-2">
                  <img src={img} alt="عکس کالا" className="w-full h-full object-contain" />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 left-2 bg-rose-500 text-white p-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* مشخصات ارزش غذایی */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Flame size={20} className="text-primary" /> جدول ارزش غذایی
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">پیمانه (سروینگ)</label>
              <input type="text" {...register("servingSize")} className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">تعداد کل سروینگ</label>
              <input type="number" dir="ltr" {...register("servingsPerContainer")} className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-xs font-black text-emerald-600 mb-1">پروتئین خالص (g)</label>
              <input type="text" dir="ltr" {...register("protein")} className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold" />
            </div>
            <div>
              <label className="block text-xs font-black text-blue-600 mb-1">BCAA (g)</label>
              <input type="text" dir="ltr" {...register("bcaa")} className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold" />
            </div>
          </div>
        </div>

        {/* متغیرهای طعم و انبار */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Tag size={20} className="text-primary" /> متغیرهای طعم، وزن و انبار
            </h2>
            <button type="button" onClick={() => append({ sku: '', flavor: '', weight: '', price: '', discountPrice: '', stock: '10', sibSalamat: '' })} className="bg-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-gray-800">
              <Plus size={14} /> افزودن تنوع
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative group">
                {index > 0 && (
                  <button type="button" onClick={() => remove(index)} className="absolute top-4 left-4 p-2 bg-white text-rose-500 rounded-xl shadow-sm">
                    <Trash2 size={16} />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">کد SKU</label><input required dir="ltr" {...register(`variants.${index}.sku`)} className="w-full px-3 py-2 bg-white border rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">طعم</label><input required {...register(`variants.${index}.flavor`)} className="w-full px-3 py-2 bg-white border rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">وزن</label><input required dir="ltr" {...register(`variants.${index}.weight`)} className="w-full px-3 py-2 bg-white border rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">قیمت (تومان)</label><input required type="number" dir="ltr" {...register(`variants.${index}.price`)} className="w-full px-3 py-2 bg-white border rounded-xl text-sm font-bold" /></div>
                  <div><label className="block text-xs font-bold text-rose-500 mb-1">قیمت تخفیف‌دار</label><input type="number" dir="ltr" {...register(`variants.${index}.discountPrice`)} className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-sm font-bold" /></div>
                  <div><label className="block text-xs font-bold text-emerald-600 mb-1">موجودی انبار</label><input required type="number" dir="ltr" {...register(`variants.${index}.stock`)} className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-sm font-bold" /></div>
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
