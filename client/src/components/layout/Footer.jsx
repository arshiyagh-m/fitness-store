import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, Phone, Mail, MapPin, ShieldCheck, RotateCcw, Truck, Headphones, Dumbbell, Award, CheckCircle, Globe, Pill } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-200 pt-10 mt-16 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* نوار ۵ مزیت رقابتی با پوشش مکمل‌های خارجی و داروهای داروخانه‌ای */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pb-10 border-b border-gray-100 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-primary/20 text-dark rounded-2xl flex items-center justify-center">
              <RotateCcw size={22} />
            </div>
            <span className="text-xs font-black text-gray-900">۷ روز ضمانت بازگشت</span>
            <span className="text-[11px] text-gray-400">در صورت عدم رضایت یا مغایرت</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <span className="text-xs font-black text-gray-900">تضمین ۱۰۰٪ اصالت</span>
            <span className="text-[11px] text-gray-400">واردات مستقیم و داروخانه‌ای</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
              <Truck size={22} />
            </div>
            <span className="text-xs font-black text-gray-900">ارسال اکسپرس کشوری</span>
            <span className="text-[11px] text-gray-400">بسته‌بندی ایمن دارویی</span>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
              <Headphones size={22} />
            </div>
            <span className="text-xs font-black text-gray-900">مشاوره تخصصی دوره</span>
            <span className="text-[11px] text-gray-400">توسط کارشناسان تغذیه</span>
          </div>

          <div className="flex flex-col items-center gap-2 col-span-2 md:col-span-1">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
              <Award size={22} />
            </div>
            <span className="text-xs font-black text-gray-900">باشگاه وفاداری</span>
            <span className="text-[11px] text-gray-400">اعتبار نقدشونده در هر خرید</span>
          </div>
        </div>

        {/* بخش ستون‌های فوتر */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-dark text-primary p-2 rounded-xl"><Dumbbell size={22}/></div>
              <span className="text-xl font-black tracking-tighter text-dark uppercase">Team 9</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              تیم ۹ مرجع تخصصی عرضه مکمل‌های ورزشی اورجینال خارجی (آمریکا و اروپا)، فرآورده‌های دارویی داروخانه‌ای و مکمل‌های غذایی دارای گواهی اصالت بین‌المللی و تاییدیه رسمی.
            </p>
            <div className="space-y-2 text-xs text-gray-600 pt-2 font-bold">
              <div className="flex items-center gap-2"><Phone size={14} className="text-primary"/> تلفن پشتیبانی: ۰۲۱-۱۲۳۴۵۶۷۸</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-primary"/> ایمیل رسمی: info@team9.ir</div>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <h3 className="font-black text-sm text-gray-900 mb-4">خدمات مشتریان و اصالت</h3>
            <div><Link to="/authenticity-guide" className="text-gray-500 hover:text-primary transition-colors block py-1 font-bold">راهنمای استعلام مکمل خارجی و دارو</Link></div>
            <div><Link to="/returns" className="text-gray-500 hover:text-primary transition-colors block py-1">رویه بازگرداندن ۷ روزه کالا</Link></div>
            <div><Link to="/profile" className="text-gray-500 hover:text-primary transition-colors block py-1">پیگیری آنلاین مرسولات پستی</Link></div>
            <div><Link to="/compare" className="text-gray-500 hover:text-primary transition-colors block py-1">ابزار مقایسه تخصصی مکمل‌ها</Link></div>
          </div>

          <div className="space-y-3 text-xs">
            <h3 className="font-black text-sm text-gray-900 mb-4">با تیم ۹</h3>
            <div><Link to="/about" className="text-gray-500 hover:text-primary transition-colors block py-1">درباره ما و تیم داروسازی</Link></div>
            <div><Link to="/contact" className="text-gray-500 hover:text-primary transition-colors block py-1">تماس با ما و انبار مرکزی</Link></div>
            <div><Link to="/wishlist" className="text-gray-500 hover:text-primary transition-colors block py-1">لیست مکمل‌های نشان‌شده</Link></div>
            <div><Link to="/archive" className="text-gray-500 hover:text-primary transition-colors block py-1">کاتالوگ تمام محصولات</Link></div>
          </div>

          {/* نمادهای اعتماد چندگانه (بین‌المللی و ملی) */}
          <div className="space-y-3">
            <h3 className="font-black text-sm text-gray-900 mb-4">مجوزها و تاییدیه اصالت</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors">
                <Globe size={26} className="text-blue-600" />
                <span className="text-[10px] font-black text-gray-800">اصالت وارداتی</span>
                <span className="text-[9px] text-gray-400">GS1 / Batch No</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors">
                <Pill size={26} className="text-emerald-600" />
                <span className="text-[10px] font-black text-gray-800">فرآورده دارویی</span>
                <span className="text-[9px] text-gray-400">سامانه TTAC</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors">
                <ShieldCheck size={26} className="text-dark" />
                <span className="text-[10px] font-black text-gray-800">اینماد قانونی</span>
                <span className="text-[9px] text-gray-400">کسب‌وکار اینترنتی</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors">
                <CheckCircle size={26} className="text-amber-500" />
                <span className="text-[10px] font-black text-gray-800">درگاه شاپرک</span>
                <span className="text-[9px] text-gray-400">بانک مرکزی</span>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-100 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© کلیه حقوق مادی و معنوی متعلق به مجموعه بازرگانی و دارویی Team 9 می‌باشد.</p>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-primary bg-gray-100 px-4 py-2 rounded-xl transition-colors"
          >
            بازگشت به بالای صفحه <ChevronUp size={16} />
          </button>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
