import React, { useState } from 'react';
import { Dumbbell, Zap, Flame, Pill, HeartPulse, ShieldCheck, CupSoda, ShoppingBag } from 'lucide-react';

const ProductImage = ({ src, category, alt = 'مکمل', className = '', imgClassName = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // انتخاب آیکون و تم اختصاصی هر دسته‌بندی در زمان لود یا نبود عکس
  const getCategoryTheme = (cat) => {
    switch (cat) {
      case 'protein-gainer':
      case 'whey':
      case 'gainer':
        return { icon: <CupSoda size={48} className="text-amber-500" />, label: 'پروتئین و گینر', bg: 'bg-amber-50/80 text-amber-700' };
      case 'amino-performance':
      case 'creatine':
      case 'amino':
      case 'pre-workout':
        return { icon: <Zap size={48} className="text-blue-500" />, label: 'آمینو و کراتین', bg: 'bg-blue-50/80 text-blue-700' };
      case 'weight-loss':
      case 'fat-burner':
        return { icon: <Flame size={48} className="text-rose-500" />, label: 'چربی‌سوز', bg: 'bg-rose-50/80 text-rose-700' };
      case 'vitamins-minerals':
      case 'vitamins':
        return { icon: <Pill size={48} className="text-emerald-500" />, label: 'ویتامین و مینرال', bg: 'bg-emerald-50/80 text-emerald-700' };
      case 'health-recovery':
        return { icon: <HeartPulse size={48} className="text-purple-500" />, label: 'مفاصل و سلامت', bg: 'bg-purple-50/80 text-purple-700' };
      case 'pharma-medical':
        return { icon: <ShieldCheck size={48} className="text-indigo-500" />, label: 'داروخانه ورزشی', bg: 'bg-indigo-50/80 text-indigo-700' };
      case 'gear-accessories':
        return { icon: <Dumbbell size={48} className="text-gray-600" />, label: 'شیکر و لوازم', bg: 'bg-gray-100 text-gray-800' };
      default:
        return { icon: <Dumbbell size={48} className="text-primary" />, label: 'مکمل ورزشی', bg: 'bg-dark/10 text-dark' };
    }
  };

  const theme = getCategoryTheme(category);
  const showFallback = !src || hasError;

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none ${className}`}>
      
      {/* وکتور گرافیکی اختصاصی دسته مکمل (تا زمان لود یا در صورت نبود عکس) */}
      {(!isLoaded || showFallback) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gray-50 text-center animate-fadeIn">
          <div className="mb-2 p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            {theme.icon}
          </div>
          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-lg ${theme.bg}`}>
            {theme.label}
          </span>
          {!showFallback && (
            <span className="text-[9px] text-gray-400 mt-2 font-bold animate-pulse">در حال بارگذاری...</span>
          )}
        </div>
      )}

      {/* تصویر اصلی که به محض لود شدن به نرمی ظاهر می‌شود */}
      {!showFallback && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}

    </div>
  );
};

export default ProductImage;
