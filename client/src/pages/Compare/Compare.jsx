import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ArrowRight, Trash2, Flame, DollarSign, Award, CheckCircle2 } from 'lucide-react';
import useCompareStore from '../../store/compareStore';
import { formatPrice } from '../../utils/formatters';

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompareStore();

  if (compareItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4 font-sans">
        <Scale size={80} className="text-gray-300 mb-4" />
        <h1 className="text-2xl font-black text-gray-800 mb-2">لیست مقایسه خالی است!</h1>
        <p className="text-gray-500 mb-6 text-sm">حداقل دو مکمل را انتخاب کنید تا جدول مقایسه ارزش خرید و ترکیبات فعال شود.</p>
        <Link to="/archive" className="bg-dark text-primary font-bold px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm">مشاهده کاتالوگ مکمل‌ها</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 font-sans" dir="rtl">
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

              {/* 🎯 ارزش خرید و محاسبه قطعی قیمت هر اسکوپ */}
              <tr className="border-b border-gray-100 bg-amber-50/40">
                <td className="p-5 font-black text-dark flex items-center gap-1.5"><DollarSign size={16} className="text-primary"/> ارزش خرید (قیمت هر ۱ اسکوپ)</td>
                {compareItems.map(item => {
                  const price = item.variants?.[0]?.discountPrice || item.variants?.[0]?.price || 0;
                  const servings = Number(item.attributes?.servingsPerContainer) || 1;
                  const costPerServing = Math.round(price / servings);
                  return (
                    <td key={item._id} className="p-5 text-center">
                      <div className="text-2xl font-black text-primary font-mono">{formatPrice(costPerServing)} <span className="text-xs font-normal font-sans">تومان</span></div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">قیمت قوطی ({formatPrice(price)}) ÷ {servings} سروینگ</span>
                    </td>
                  );
                })}
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

              {/* هدف از مصرف */}
              <tr className="border-b border-gray-100">
                <td className="p-5 bg-gray-50/70 font-bold text-gray-700">هدف اصلی مصرف</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-5 text-center font-bold text-primary">
                    {item.attributes?.targetGoal || 'عضله‌سازی'}
                  </td>
                ))}
              </tr>

              {/* تعداد کل سروینگ */}
              <tr className="border-b border-gray-100">
                <td className="p-5 bg-gray-50/70 font-bold text-gray-700">تعداد کل سروینگ در بسته</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-5 text-center font-black text-gray-900">
                    {item.attributes?.servingsPerContainer || 60} پیمانه
                  </td>
                ))}
              </tr>

              {/* اندازه پیمانه */}
              <tr className="border-b border-gray-100">
                <td className="p-5 bg-gray-50/70 font-bold text-gray-700">اندازه هر سروینگ</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-5 text-center text-xs font-bold text-gray-600">
                    {item.attributes?.servingSize || '30 گرم'}
                  </td>
                ))}
              </tr>

              {/* مقایسه هوشمند ترکیبات ارزش غذایی که ثبت شده است */}
              <tr className="border-b border-gray-100 bg-gray-50/40">
                <td className="p-5 font-black text-gray-800 flex items-center gap-1.5"><Flame size={16} className="text-primary"/> ترکیبات فعال ثبت‌شده</td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-5 text-center align-top">
                    {(!item.nutritionFacts || item.nutritionFacts.length === 0) ? (
                      <span className="text-xs text-gray-400">ثبت نشده</span>
                    ) : (
                      <div className="space-y-1.5 text-xs text-right max-w-[200px] mx-auto">
                        {item.nutritionFacts.map((n, i) => (
                          <div key={i} className="flex justify-between py-1 border-b border-gray-100">
                            <span className="text-gray-600">{n.ingredient}:</span>
                            <strong className="text-emerald-600 font-black font-mono">{n.amount}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* دکمه خرید مستقیم */}
              <tr>
                <td className="p-6 bg-gray-50/70"></td>
                {compareItems.map(item => (
                  <td key={item._id} className="p-6 text-center">
                    <Link to={`/product/${item.slug}`} className="bg-primary text-dark hover:bg-primary-hover font-black px-6 py-3 rounded-2xl text-xs inline-block shadow-md">
                      مشاهده و خرید
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
