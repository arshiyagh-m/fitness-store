import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Save, Plus, Trash2, Box, Dumbbell, Tag, Upload, Activity, Flame, Globe, Sparkles, ShieldCheck } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import api from '../../services/api';
import { CATEGORY_TREE } from '../../utils/categories';
import { POPULAR_INGREDIENTS } from '../../utils/nutritionSuggestions';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const [selectedParentCategory, setSelectedParentCategory] = useState(CATEGORY_TREE[0].id);
  const [selectedSubcategory, setSelectedSubcategory] = useState(CATEGORY_TREE[0].subcategories[0]);

  // جدول پویای ارزش غذایی
  const [nutritionRows, setNutritionRows] = useState([
    { ingredient: 'پروتئین خالص (Protein)', amount: '24 گرم', dailyValue: '48%' },
    { ingredient: 'بی‌سی‌اا (BCAA)', amount: '5.5 گرم', dailyValue: '-' },
    { ingredient: 'انرژی / کالری (Calories)', amount: '120 کیلوکالری', dailyValue: '-' }
  ]);

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: '', slug: '', brand: '', description: '',
      country: 'آمریکا', targetGoal: 'عضله‌سازی و ریکاوری', form: 'پودر', servingSize: '30 گرم (1 اسکوپ)', servingsPerContainer: 74,
      usageGuide: 'یک پیمانه را در ۲۵۰ میلی‌لیتر آب سرد حل کرده و بلافاصله پس از تمرین میل نمایید.',
      variants: [{ sku: '', flavor: 'دابل چاکلت', weight: '2.27 کیلوگرم (5 پوند)', price: '', discountPrice: '', stock: '25', sibSalamat: '16/10293847', expiryDate: '2026/08' }]
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

  const handleDirectMultiUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) formData.append('images', files[i]);
    setUploading(true);
    try {
      const { data } = await api.post('/upload/multiple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedImages([...uploadedImages, ...data]);
    } catch (err) {
      alert('خطا در آپلود عکس‌ها');
    } finally {
      setUploading(false);
    }
  };

  // مدیریت ردیف‌های ترکیبات غذایی
  const handleAddNutritionTag = (ingName) => {
    if (nutritionRows.some(r => r.ingredient === ingName)) return;
    setNutritionRows([...nutritionRows, { ingredient: ingName, amount: '', dailyValue: '-' }]);
  };

  const handleAddCustomNutrition = () => {
    setNutritionRows([...nutritionRows, { ingredient: '', amount: '', dailyValue: '-' }]);
  };

  const handleNutritionChange = (index, field, value) => {
    const updated = [...nutritionRows];
    updated[index][field] = value;
    setNutritionRows(updated);
  };

  const handleRemoveNutrition = (index) => {
    setNutritionRows(nutritionRows.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const validNutrition = nutritionRows.filter(r => r.ingredient.trim() !== '');

      const payload = {
        title: data.title,
        slug: data.slug.toLowerCase().trim().replace(/\s+/g, '-'),
        brand: data.brand,
        category: selectedParentCategory,
        subcategory: selectedSubcategory,
        description: data.description,
        images: uploadedImages,
        attributes: {
          country: data.country,
          targetGoal: data.targetGoal,
          form: data.form,
          servingSize: data.servingSize,
          servingsPerContainer: Number(data.servingsPerContainer) || 1,
          usageGuide: data.usageGuide,
        },
        nutritionFacts: validNutrition,
        variants: data.variants.map(v => ({
          ...v,
          price: Number(v.price),
          discountPrice: v.discountPrice ? Number(v.discountPrice) : null,
          stock: Number(v.stock),
        }))
      };

      await api.post('/products', payload);
      alert('مکمل جدید با موفقیت به همراه جدول ترکیبات و مشخصات کامل در دیتابیس ثبت شد!');
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
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2"><Box size={24} className="text-primary"/> ثبت دایره‌المعارفی مکمل ورزشی</h1>
            <p className="text-xs text-gray-400 mt-1">جدول پویا، ترکیبات پیشنهادی، قیمت هر سروینگ و شناسنامه کالا</p>
          </div>
        </div>
        <button onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-primary text-dark font-black px-8 py-3.5 rounded-2xl hover:bg-primary-hover shadow-lg transition-all flex items-center gap-2 disabled:opacity-50">
          {isSubmitting ? <Activity className="animate-spin" size={20} /> : <Save size={20} />}
          ذخیره قطعی در دیتابیس
        </button>
      </div>

      <form className="space-y-8">
        
        {/* ۱. آپلود تصاویر */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2"><Upload size={20} className="text-primary" /> تصاویر مکمل (آپلود مستقیم از سیستم)</h2>
              <p className="text-xs text-gray-400 mt-1">بدون نیاز به لینک؛ عکس‌های قوطی، جدول و برچسب اصالت را انتخاب کنید.</p>
            </div>
            <label className="bg-dark text-primary hover:bg-gray-800 px-5 py-3 rounded-2xl cursor-pointer font-black text-xs inline-flex items-center gap-2 transition-all shadow-md">
              {uploading ? <Activity className="animate-spin" size={16}/> : <Plus size={16}/>}
              انتخاب عکس‌ها از سیستم
              <input type="file" multiple onChange={handleDirectMultiUpload} accept="image/*" className="hidden" />
            </label>
          </div>

          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4 pt-2">
              {uploadedImages.map((img, idx) => (
                <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50 p-2">
                  <img src={img} alt="عکس" className="w-full h-full object-contain" />
                  <button type="button" onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))} className="absolute top-2 left-2 bg-rose-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={14} />
                  </button>
                  {idx === 0 && <span className="absolute bottom-2 right-2 bg-dark text-primary text-[9px] font-black px-2 py-0.5 rounded-md">تصویر شاخص</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ۲. جایگاه کاتالوگ */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><Tag size={20} className="text-primary"/> دسته‌بندی کاتالوگ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <div>
              <label className="block text-xs font-black text-gray-700 mb-2">دسته اصلی (مادر)</label>
              <select value={selectedParentCategory} onChange={handleParentCategoryChange} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-black outline-none focus:border-primary">
                {CATEGORY_TREE.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-primary mb-2">زیردسته تخصصی</label>
              <select value={selectedSubcategory} onChange={(e) => setSelectedSubcategory(e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-xs font-black outline-none focus:border-primary">
                {currentParentObj.subcategories.map((sub, idx) => <option key={idx} value={sub}>{sub}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* ۳. مشخصات عمومی و تولیدی */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-base font-black text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4"><Dumbbell size={20} className="text-primary"/> مشخصات عمومی و فیزیکی مکمل</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-600 mb-1">نام کامل محصول (فارسی)</label>
              <input required type="text" {...register("title")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-sm font-bold" placeholder="مثال: کراتین مونوهیدرات میکرونایز اپتیموم نوتریشن" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">شناسه URL (انگلیسی)</label>
              <input required type="text" dir="ltr" {...register("slug")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-left text-xs font-mono" placeholder="on-micronized-creatine" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">برند سازنده</label>
              <input required type="text" dir="ltr" {...register("brand")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-left text-xs font-mono font-bold" placeholder="Optimum Nutrition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">کشور مبدا برند</label>
              <input type="text" {...register("country")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-xs font-bold" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">هدف از مصرف</label>
              <input type="text" {...register("targetGoal")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-xs font-bold" placeholder="عضله‌سازی خشک، افزایش قدرت" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">فرم فیزیکی مکمل</label>
              <input type="text" {...register("form")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-xs font-bold" placeholder="پودر، کپسول، مایع، قرص" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">اندازه هر سروینگ (اسکوپ)</label>
              <input type="text" {...register("servingSize")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-xs font-bold" placeholder="مثال: ۵ گرم یا ۱ پیمانه" />
            </div>
            <div>
              <label className="block text-xs font-bold text-primary mb-1">تعداد کل سروینگ‌های قوطی (جهت محاسبه قیمت اسکوپ)</label>
              <input required type="number" dir="ltr" {...register("servingsPerContainer")} className="w-full px-4 py-3 bg-gray-50 border border-primary/30 rounded-xl outline-none focus:border-primary text-sm font-black text-center" placeholder="مثال: 60" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-600 mb-1">راهنما و دستور مصرف پیشنهادی</label>
              <textarea rows="2" {...register("usageGuide")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-xs resize-none" placeholder="نحوه و بهترین زمان مصرف..."></textarea>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-600 mb-1">نقد و بررسی و توضیحات جامع</label>
              <textarea rows="3" {...register("description")} className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:border-primary text-xs resize-none"></textarea>
            </div>
          </div>
        </div>

        {/* ۴. جدول پویای ارزش غذایی (Nutrition Facts) با برچسب‌های آماده */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Flame size={20} className="text-primary" /> جدول تخصصی ارزش غذایی و ترکیبات فعال (Nutrition Facts)
              </h2>
              <p className="text-xs text-gray-400 mt-1">برای کراتین فقط کراتین بزنید، برای وی پروتئین و BCAA؛ سیستم کاملاً دست شماست!</p>
            </div>
            <button type="button" onClick={handleAddCustomNutrition} className="bg-dark text-primary px-4 py-2.5 rounded-xl text-xs font-black hover:bg-gray-800 transition-colors flex items-center gap-1.5 shrink-0">
              <Plus size={16}/> افزودن ردیف سفارشی
            </button>
          </div>

          {/* ابر برچسب‌های پیشنهادی پرکاربرد (Suggestions Tag Cloud) */}
          <div>
            <span className="text-xs font-bold text-gray-500 block mb-2 flex items-center gap-1">
              <Sparkles size={14} className="text-primary"/> با کلیک روی هر برچسب، ماده به جدول اضافه می‌شود:
            </span>
            <div className="flex flex-wrap gap-2">
              {POPULAR_INGREDIENTS.map((ing, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleAddNutritionTag(ing.name)}
                  className="bg-gray-100 hover:bg-primary hover:text-dark text-gray-700 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border border-gray-200"
                >
                  + {ing.name}
                </button>
              ))}
            </div>
          </div>

          {/* ردیف‌های جدول */}
          <div className="space-y-3 pt-2">
            {nutritionRows.map((row, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-full sm:w-1/2">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">نام ماده مغذی / ترکیب فعال</label>
                  <input 
                    required
                    type="text" 
                    value={row.ingredient} 
                    onChange={e => handleNutritionChange(idx, 'ingredient', e.target.value)}
                    placeholder="مثال: کراتین خالص یا پروتئین ایزوله"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-primary"
                  />
                </div>
                <div className="w-full sm:w-1/4">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">مقدار در هر اسکوپ</label>
                  <input 
                    required
                    type="text" 
                    value={row.amount} 
                    onChange={e => handleNutritionChange(idx, 'amount', e.target.value)}
                    placeholder="مثال: ۵ گرم یا ۲۴g"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-black text-primary outline-none focus:border-primary text-center"
                  />
                </div>
                <div className="w-full sm:w-1/4">
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">درصد نیاز روزانه (%DV)</label>
                  <input 
                    type="text" 
                    value={row.dailyValue} 
                    onChange={e => handleNutritionChange(idx, 'dailyValue', e.target.value)}
                    placeholder="مثال: 48% یا -"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-primary text-center"
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveNutrition(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl mt-4 sm:mt-5 shrink-0"
                  title="حذف ردیف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ۵. طعم‌ها، وزن‌ها، قیمت و کد اصالت هر متغیر */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2"><Tag size={20} className="text-primary"/> طعم‌ها، وزن‌ها، انبار و بارکدهای اصالت</h2>
              <p className="text-xs text-gray-400 mt-1">با تغییر طعم و وزن در سایت، SKU و کد سیب سلامت و تاریخ انقضا نیز زنده آپدیت می‌شوند.</p>
            </div>
            <button type="button" onClick={() => append({ sku: '', flavor: '', weight: '', price: '', discountPrice: '', stock: '15', sibSalamat: '', expiryDate: '2026/10' })} className="bg-dark text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-gray-800">
              <Plus size={14} /> افزودن تنوع
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((item, index) => (
              <div key={item.id} className="p-6 bg-gray-50 rounded-2xl border border-gray-200 relative group space-y-4">
                {index > 0 && <button type="button" onClick={() => remove(index)} className="absolute top-4 left-4 p-2 bg-white text-rose-500 rounded-xl shadow-sm"><Trash2 size={16} /></button>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">بارکد انبار (SKU)</label><input required dir="ltr" {...register(`variants.${index}.sku`)} placeholder="ON-CREA-300G" className="w-full px-3 py-2 bg-white border rounded-xl text-xs font-mono font-bold" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">طعم مکمل</label><input required {...register(`variants.${index}.flavor`)} placeholder="بدون طعم، شکلات، موکا" className="w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">وزن قوطی</label><input required dir="ltr" {...register(`variants.${index}.weight`)} placeholder="300 گرم یا 2.27 کیلوگرم" className="w-full px-3 py-2 bg-white border rounded-xl text-xs font-bold" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">قیمت اصلی (تومان)</label><input required type="number" dir="ltr" {...register(`variants.${index}.price`)} placeholder="1450000" className="w-full px-3 py-2 bg-white border rounded-xl text-sm font-black" /></div>
                  <div><label className="block text-xs font-bold text-rose-500 mb-1">قیمت با تخفیف ویژه</label><input type="number" dir="ltr" {...register(`variants.${index}.discountPrice`)} placeholder="1250000" className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl text-sm font-black" /></div>
                  <div><label className="block text-xs font-bold text-emerald-600 mb-1">موجودی انبار</label><input required type="number" dir="ltr" {...register(`variants.${index}.stock`)} className="w-full px-3 py-2 bg-white border border-emerald-200 rounded-xl text-sm font-black" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">کد تاییدیه سیب سلامت / IRC</label><input dir="ltr" {...register(`variants.${index}.sibSalamat`)} placeholder="16/10293847" className="w-full px-3 py-2 bg-white border rounded-xl text-xs font-mono" /></div>
                  <div><label className="block text-xs font-bold text-gray-600 mb-1">تاریخ انقضای این بچ</label><input dir="ltr" {...register(`variants.${index}.expiryDate`)} placeholder="2026/08" className="w-full px-3 py-2 bg-white border rounded-xl text-xs font-mono" /></div>
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
