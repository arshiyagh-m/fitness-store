import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Save, Plus, Trash2, Box, Dumbbell, Tag, Upload, Activity, Flame, Globe, Check, Star } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../../services/api';
import { CATEGORY_TREE } from '../../utils/categories';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // لیست عکس‌های آپلود شده مستقیم از کامپیوتر
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const [selectedParentCategory, setSelectedParentCategory] = useState(CATEGORY_TREE[0].id);
  const [selectedSubcategory, setSelectedSubcategory] = useState(CATEGORY_TREE[0].subcategories[0]);

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: '', slug: '', brand: '', description: '',
      country: 'آمریکا', targetGoal: 'عضله‌سازی و ریکاوری', form: 'پودر', servingSize: '30 گرم', servingsPerContainer: 70,
      protein: '24', bcaa: '5.5', calories: '120', carbs: '3', sugar: '1',
      variants: [{ sku: '', flavor: 'دابل چاکلت', weight: '2.27 کیلوگرم', price: '', discountPrice: '', stock: '20', sibSalamat: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const handleParentCategoryChange = (e) => {
    const parentId = e.target.value;
    setSelectedParentCategory(parentId);
    const parentObj = CATEGORY_TREE.find(c => c.id === parentId);
    if (parentObj && parentObj.subcategories.length > 0) {
      setSelectedSubcategory(parentObj.subcategories[0]);
    }
  };

  // 🚀 آپلود مستقیم چند عکس همزمان از هارد کامپیوتر یا گالری موبایل
  const handleDirectMultiUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    setUploading(true);
    try {
      const { data } = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // افزودن عکس‌های جدید به گالری کالا
      setUploadedImages([...uploadedImages, ...data]);
    } catch (err) {
      alert('خطا در آپلود عکس‌ها. لطفاً حجم عکس‌ها را بررسی کنید.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  // جابجایی عکس و قرار دادن به عنوان تصویر شاخص (اصلی)
  const handleSetMainImage = (index) => {
    const selected = uploadedImages[index];
    const remaining = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages([selected, ...remaining]);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: data.title,
        slug: data.slug.toLowerCase().trim().replace(/\s+/g, '-'),
        brand: data.brand,
        category: selectedParentCategory,
        subcategory: selectedSubcategory,
        description: data.description,
        images: uploadedImages, // تصاویر آپلود شده مستقیم
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
      alert('مکمل با موفقیت به همراه تمام تصاویر ذخیره در دیتابیس ثبت شد!');
      navigate('/admin/products');
    } catch (err) {
      alert(err.response?.data?.message || 'خطا در ثبت محصول');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentParentObj = CATEGORY_TREE.find(c => c.id === selectedParentCategory) || CATEGORY_TREE[0];

  return (
    <div className="max-w-5xl mx-auto pb-16 font-sans" dir="rtl">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <Link to="/admin/products" className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100"><ArrowRight size={20}/></Link>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Box size={24} className="text-primary"/> ثبت مکمل با آپلود مستقیم گالری</h1>
            <p className="text-xs text-gray-400 mt-1">بدون نیاز به لینک؛ انتخاب مستقیم فایل از کامپیوتر یا گوشی</p>
          </div>
        </div>
        <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-primary text-dark font-black px-6 py-3 rounded-xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
          {isSubmitting ? <Activity className="animate-spin" size={20} /> : <Save size={20} />}
          ذخیره نهایی در دیتابیس
        </button>
      </div>

      <form className="space-y-8">
        
        {/* ۱. ماژول آپلود مستقیم چند عکس از سیستم (بدون نیاز به لینک) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Upload size={20} className="text-primary" /> تصاویر مکمل (آپلود مستقیم از کامپیوتر)
              </h2>
              <p className="text-xs text-gray-400 mt-1">می‌توانید چند عکس (قوطی، جدول ارزش غذایی، برچسب اصالت) را همزمان انتخاب کنید.</p>
            </div>
            <label className="bg-dark text-primary hover:bg-gray-800 px-5 py-3 rounded-2xl cursor-pointer font-black text-xs inline-flex items-center gap-2 transition-all shadow-md">
              {uploading ? <Activity className="animate-spin" size={16}/> : <Plus size={16}/>}
              انتخاب عکس‌ها از سیستم
              <input type="file" multiple onChange={handleDirectMultiUpload} accept="image/*" className="hidden" />
            </label>
          </div>

          {/* گالری تصاویر آپلود شده */}
          {uploadedImages.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center text-gray-400 text-xs font-bold">
              هنوز عکسی آپلود نشده است. برای این محصول وکتور اختصاصی دسته‌بندی به عنوان تصویر موقت نمایش داده خواهد شد.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50 p-2 flex flex-col justify-between">
                  <img src={img} alt="عکس کالا" className="w-full h-full object-contain" />
                  
                  {idx === 0 ? (
                    <span className="absolute bottom-2 right-2 bg-dark text-primary text-[9px] font-black px-2 py-0.5 rounded-md shadow">
                      تصویر شاخص
                    </span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => handleSetMainImage(idx)} 
                      className="absolute bottom-2 right-2 bg-white/90 hover:bg-primary text-dark text-[9px] font-bold px-2 py-0.5 rounded-md shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      تنظیم به عنوان شاخص
                    </button>
                  )}

                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(idx)} 
                    className="absolute top-2 left-2 bg-rose-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    title="حذف این عکس"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ۲. جایگاه در کاتالوگ */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Tag size={20} className="text-primary" /> دسته‌بندی تخصصی کالا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div>
              <label className="block text-xs font-black text-gray-700 mb-2">دسته اصلی (مادر)</label>
              <select value={selectedParentCategory} onChange={handleParentCategoryChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-black outline-none focus:border-primary">
                {CATEGORY_TREE.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-primary mb-2">زیردسته دقیق</label>
              <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-black outline-none focus:border-primary">
                {currentParentObj.subcategories.map((sub, idx) => <option key={idx} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ۳. مشخصات اصلی مکمل */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Dumbbell size={20} className="text-primary" /> مشخصات عمومی مکمل
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">نام کامل کالا (فارسی)</label>
              <input required type="text" {...register("title")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-sm" placeholder="مثال: پروتئین وی ۱۰۰٪ گلد استاندارد اپتیموم نوتریشن" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">شناسه یکتا URL (انگلیسی)</label>
              <input required type="text" dir="ltr" {...register("slug")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-left text-sm" placeholder="on-gold-standard-whey" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">برند سازنده</label>
              <input required type="text" dir="ltr" {...register("brand")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-left text-sm" placeholder="Optimum Nutrition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">کشور مبدا برند</label>
              <input type="text" {...register("country")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-sm" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">هدف مصرف</label>
              <input type="text" {...register("targetGoal")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-sm" placeholder="عضله‌سازی و ریکاوری" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">نقد و بررسی و طریقه مصرف</label>
              <textarea rows="3" {...register("description")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-sm resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* ۴. جدول ارزش غذایی */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Flame size={20} className="text-primary" /> مشخصات ارزش غذایی
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div><label className="block text-xs font-bold text-gray-600 mb-1">اندازه سروینگ</label><input type="text" {...register("servingSize")} className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-sm" /></div>
            <div><label className="block text-xs font-bold text-gray-600 mb-1">تعداد کل سروینگ</label><input type="number" dir="ltr" {...register("servingsPerContainer")} className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-sm" /></div>
            <div><label className="block text-xs font-black text-emerald-600 mb-1">پروتئین (g)</label><input type="text" dir="ltr" {...register("protein")} className="w-full px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm font-bold" /></div>
            <div><label className="block text-xs font-black text-blue-600 mb-1">BCAA (g)</label><input type="text" dir="ltr" {...register("bcaa")} className="w-full px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm font-bold" /></div>
          </div>
        </div>

        {/* ۵. طعم و انبار */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Tag size={20} className="text-primary" /> طعم‌ها، وزن‌ها و موجودی انبار
            </h2>
            <button type="button" onClick={() => append({ sku: '', flavor: '', weight: '', price: '', discountPrice: '', stock: '10', sibSalamat: '' })} className="bg-dark text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-gray-800">
              <Plus size={14} /> افزودن تنوع
            </button>
          </div>
          <div className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative group">
                {index > 0 && <button type="button" onClick={() => remove(index)} className="absolute top-4 left-4 p-2 bg-white text-rose-500 rounded-xl"><Trash2 size={16} /></button>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">کد SKU</label><input required dir="ltr" {...register(`variants.${index}.sku`)} className="w-full px-3 py-2 bg-white border rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">طعم</label><input required {...register(`variants.${index}.flavor`)} className="w-full px-3 py-2 bg-white border rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">وزن</label><input required dir="ltr" {...register(`variants.${index}.weight`)} className="w-full px-3 py-2 bg-white border rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">قیمت اصلی (تومان)</label><input required type="number" dir="ltr" {...register(`variants.${index}.price`)} className="w-full px-3 py-2 bg-white border rounded-xl text-sm font-bold" /></div>
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
