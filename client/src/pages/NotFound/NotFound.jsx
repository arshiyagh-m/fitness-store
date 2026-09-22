import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="relative mb-6">
        <Dumbbell size={100} strokeWidth={1} className="text-gray-200 rotate-45" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-black text-primary">۴۰۴</span>
        </div>
      </div>
      <h1 className="text-3xl font-black text-dark mb-3">صفحه مورد نظر پیدا نشد!</h1>
      <p className="text-gray-500 max-w-md mb-8 text-sm leading-relaxed">
        به نظر می‌رسد آدرس را اشتباه وارد کرده‌اید یا این صفحه به دلیل تغییرات در باشگاه Team 9 جابجا شده است.
      </p>
      <Link 
        to="/" 
        className="bg-dark text-primary hover:bg-gray-800 font-black px-8 py-3.5 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2"
      >
        بازگشت به صفحه اصلی <ArrowLeft size={18} />
      </Link>
    </div>
  );
};

export default NotFound;
