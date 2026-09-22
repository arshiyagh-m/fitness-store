import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowRight, Trash2, Flame, Award, DollarSign } from 'lucide-react';
import useCompareStore from '../../store/compareStore';
import { formatPrice } from '../../utils/formatters';

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompareStore();

  if (compareItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <Scale size={80} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-black text-gray-800 mb-2">لیست مقایسه خالی است!</h1>
        <p className="text-gray-500 mb-6 text-sm">حداقل دو مکمل را انتخاب کنید تا جدول موشکافانه مقایسه پروتئین، اسکوپ و قیمت فعال شود.</p>
        <Link to="/archive" className="bg-dark text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm">مشاهده کاتالوگ مکمل‌ها</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Link to="/archive" className="p-2 bg-white rounded-xl shadow-sm"><ArrowRight size={20}/></Link>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <Scale className="text-primary" /> مقایسه تخصصی مکمل‌های بدنسازی
            </h1>
          </div>
          <button onClick={clearCompare} className="text-rose-500 hover:bg-rose-50 text-xs font-bold px-4 py-2 rounded-xl">حذف همه</button>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse min-w-[750px]">
            <tbody>
              
              {/* کالا و تصویر */}
              <tr className="border-b border-gray-100">
                <td className="p-6 bg-gray-50/70 font-black text-gray-500 w-48">مکمل ورزشی</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-6 text-center align-top relative">
                    <button onClick={() => removeFromCompare(item._id)} className="absolute top-3 left-3 text-gray-400 hover:text-rose-500"><Trash2 size={16}/></button>
                    <div className="w-32 h-32 mx-auto bg-white rounded-2xl flex items-center justify-center p-2 mb-3 border border-gray-100">
                      <img src={item.images?.[0] || 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=600'} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                    <Link to={`/product/${item.slug}`} className="font-black text-gray-900 hover:text-primary line-clamp-2 mb-1">{item.title}</Link>
                    <span className="text-xs text-gray-400 font-mono uppercase">{item.brand}</span>
                  </td>
                ))}
              </tr>

              {/* قیمت کل و قیمت هر اسکوپ (شاهکار مقایسه) */}
              <tr className="border-b border-gray-100 bg-amber-50/30">
                <td className="p-5 font-black text-dark flex items-center gap-1.5"><DollarSign size={16} className="text-primary"/> ارزش خرید (قیمت هر سروینگ)</td>
                {compareItems.map(item => {
                  const price = item.variants?.[0]?.discountPrice || item.variants?.[0]?.price || 0;
                  const servings = item.attributes?.servingsPerContainer || 60;
                  const costPerServing = Math.round(price / servings);
                  return (
                    <td key={item._id} className="p-5 text-center">
                      <div className="text-xl font-black text-primary">{formatPrice(costPerServing)} <span className="text-xs font-normal">تومان</span></div>
                      <span className="text-[11px] text-gray-400">به ازای هر ۱ پیمانه مصرفی</span>
                    </td>
                  );
                })}
              </tr>

              {/* پروتئین خالص */}
              <tr className="border-b border-gray-100">
                <td className="p-5 bg-gray-50/70 font-bold text-gray-700 flex items-center gap-1"><Award size={16} className="text-emerald-600"/> پروتئین در هر اسکوپ</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-5 text-center font-black text-lg text-emerald-600">
                    {item.nutritionFacts?.protein || '۲۴'} گرم
                  </td>
                ))}
              </tr>

              {/* BCAA */}
              <tr className="border-b border-gray-100">
                <td className="p-5 bg-gray-50/70 font-bold text-gray-700">میزان BCAA</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-5 text-center font-black text-blue-600">
                    {item.nutritionFacts?.bcaa || '۵.۵'} گرم
                  </td>
                ))}
              </tr>

              {/* کالری و کربوهیدرات */}
              <tr className="border-b border-gray-100">
                <td className="p-5 bg-gray-50/70 font-bold text-gray-700">کالری و کربوهیدرات</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-5 text-center text-xs font-bold text-gray-600">
                    {item.nutritionFacts?.calories || '120'} کالری | {item.nutritionFacts?.carbs || '3'}g کربو
                  </td>
                ))}
              </tr>

              {/* کشور سازنده */}
              <tr className="border-b border-gray-100">
                <td className="p-5 bg-gray-50/70 font-bold text-gray-700">کشور سازنده</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-5 text-center font-bold text-gray-800">
                    {item.attributes?.country || 'آمریکا'}
                  </td>
                ))}
              </tr>

              {/* تعداد کل سروینگ */}
              <tr className="border-b border-gray-100">
                <td className="p-5 bg-gray-50/70 font-bold text-gray-700">تعداد کل سروینگ قوطی</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-5 text-center font-bold text-gray-800">
                    {item.attributes?.servingsPerContainer || 74} پیمانه
                  </td>
                ))}
              </tr>

              {/* دکمه خرید مستقیم */}
              <tr>
                <td className="p-6 bg-gray-50/70"></td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-6 text-center">
                    <Link to={`/product/${item.slug}`} className="bg-primary text-dark hover:bg-primary-hover font-black px-6 py-3 rounded-2xl text-xs inline-block shadow-md">
                      خرید این مکمل
                    </Link>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compare;
