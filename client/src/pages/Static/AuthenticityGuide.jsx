import React, { useState } from 'react';
import { ShieldCheck, Globe, Pill, Award, QrCode, Smartphone, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink, Shield, FileCheck, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthenticityGuide = () => {
  const [activeCategory, setActiveCategory] = useState('foreign'); // foreign | domestic | pharma

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-white rounded-xl shadow-sm hover:bg-gray-100"><ArrowRight size={20}/></Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <ShieldCheck className="text-primary" size={28} /> مرجع جامع اعتبارسنجی و اصالت مکمل‌ها و داروهای اورجینال
            </h1>
            <p className="text-xs text-gray-400 mt-1">روش‌های تخصصی بررسی اصالت اقلام وارداتی خارجی و فرآورده‌های داروخانه‌ای ایرانی</p>
          </div>
        </div>

        {/* بنر تعهد اصالت Team 9 */}
        <div className="bg-dark rounded-3xl p-8 text-white relative overflow-hidden border border-gray-800 shadow-xl">
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-black inline-block mb-3 border border-primary/30">
            تعهد طلایی Team 9
          </span>
          <h2 className="text-2xl font-black mb-3">ضمانت مادام‌العمر اصالت و بازگشت وجه</h2>
          <p className="text-gray-300 text-xs leading-relaxed max-w-2xl">
            ما در Team 9 معتقدیم سلامتی و کبد یک ورزشکار شوخی‌بردار نیست. تمام مکمل‌های خارجی به صورت مستقیم از مبدا آمریکا و اروپا، و تمام اقلام داروخانه‌ای از توزیع‌کنندگان مجاز تهیه شده و همراه با فاکتور رسمی اصالت ارسال می‌شوند.
          </p>
        </div>

        {/* تب‌های انتخاب دسته‌بندی اقلام */}
        <div className="flex bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm gap-2">
          <button
            onClick={() => setActiveCategory('foreign')}
            className={`flex-1 py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              activeCategory === 'foreign' 
                ? 'bg-dark text-primary shadow-md' 
                : 'text-gray-600 hover:text-dark'
            }`}
          >
            <Globe size={16} /> مکمل‌های اورجینال خارجی (واردات مستقیم)
          </button>
          <button
            onClick={() => setActiveCategory('domestic')}
            className={`flex-1 py-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              activeCategory === 'domestic' 
                ? 'bg-dark text-primary shadow-md' 
                : 'text-gray-600 hover:text-dark'
            }`}
          >
            <Pill size={16} /> مکمل‌ها و داروهای داروخانه‌ای و شرکتی
          </button>
        </div>

        {/* محتوای بخش اول: مکمل‌های خارجی و وارداتی */}
        {activeCategory === 'foreign' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                <Globe className="text-primary" size={22} /> راهنمای تشخیص مکمل‌های خارجی اورجینال (آمریکا، کانادا و اروپا)
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                مکمل‌های وارداتی مستقیم فاقد برچسب‌های محلی هستند. برای استعلام این محصولات از روش‌های استاندارد زیر استفاده کنید:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-primary/20 text-dark rounded-xl flex items-center justify-center font-black">
                  <Smartphone size={20}/>
                </div>
                <h4 className="font-bold text-sm text-gray-900">۱. استعلام مستقیم از سایت کمپانی مادر</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  بسیاری از کمپانی‌های بزرگ (نظیر Optimum Nutrition, MyProtein, Kevin Levrone) دارای اپلیکیشن یا بخش Authentication در وبسایت رسمی خود هستند. با وارد کردن کد امنیتی روی درب یا اسکن لیبل اختصاصی، اصالت کالا مستقیماً توسط کارخانه مادر تایید می‌شود.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">
                  <QrCode size={20}/>
                </div>
                <h4 className="font-bold text-sm text-gray-900">۲. بررسی بارکد بین‌المللی UPC / EAN در GS1</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  بارکد ۱۲ یا ۱۳ رقمی پشت قوطی را در پایگاه داده جهانی <strong>GS1.org</strong> یا نرم‌افزارهای بارکدخوان معتبر اسکن کنید. مشخصات رسمی شرکت ثبت‌کننده در ایالات متحده یا اروپا باید فوراً نمایش داده شود.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black">
                  <FileCheck size={20}/>
                </div>
                <h4 className="font-bold text-sm text-gray-900">۳. تکنولوژی چاپ لیزری بچ‌نامبر (Dot-Matrix)</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  در کف قوطی مکمل‌های اصل آمریکایی، تاریخ انقضا و Batch Number با فونت‌های نقطه‌ای و جوهر ضدخش آبی یا مشکی چاپ شده است که با ناخن پاک نمی‌شود. قوطی‌های تقلبی معمولاً تاریخ چاپی دستی یا برچسبی دارند.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black">
                  <Layers size={20}/>
                </div>
                <h4 className="font-bold text-sm text-gray-900">۴. کیفیت پلمپ تحت فشار (Induction Seal)</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  پلمپ زیر درب قوطی از نوع مقوای فشرده حرارتی است که محکم به لبه دهانه قوطی چسبیده و بدون چسب مایع کار گذاشته شده است تا پودر هرگز با هوای بیرون در تماس نباشد.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* محتوای بخش دوم: مکمل‌ها و داروهای داروخانه‌ای و شرکتی */}
        {activeCategory === 'domestic' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
            <div>
              <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2">
                <Pill className="text-primary" size={22} /> راهنمای استعلام فرآورده‌های داروخانه‌ای، داروها و مکمل‌های شرکتی
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                تمام داروهای مجاز و مکمل‌های وارداتی رسمی دارای برچسب ردیابی و اصالت کالا (تی‌تک) هستند:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black">
                  <Smartphone size={20}/>
                </div>
                <h4 className="font-bold text-sm text-gray-900">۱. پیامک به سامانه ۲۰۰۰۸۸۲۲ وزارت بهداشت</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  کد ۱۶ رقمی زیر لایه اسکرچ زرد رنگ برچسب سلامت را به شماره ۲۰۰۰۸۸۲۲ پیامک کنید تا نام شرکت داروسازی، تاریخ انقضا و اصالت فرآورده به گوشی شما پیامک شود.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-primary/20 text-dark rounded-xl flex items-center justify-center font-black">
                  <ExternalLink size={20}/>
                </div>
                <h4 className="font-bold text-sm text-gray-900">۲. استعلام در سایت سامانه TTAC.ir</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  با مراجعه به وبسایت رسمی سامانه تیتک یا اپلیکیشن موبایل TTAC، شناسه رهگیری (UID) ۲۰ رقمی را وارد کنید تا کاتالوگ و مجوز رسمی داروخانه نمایش داده شود.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black">
                  <ShieldCheck size={20}/>
                </div>
                <h4 className="font-bold text-sm text-gray-900">۳. کد ثبت دارویی IRC در پروانه سازمان غذا و دارو</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  تمامی اقلام دارای کد IRC رسمی می‌باشند که در سامانه دارویی کشور ثبت شده و نشان‌دهنده تاییدیه آزمایشگاه‌های مرجع کنترل غذا و دارو است.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-black">
                  <Pill size={20}/>
                </div>
                <h4 className="font-bold text-sm text-gray-900">۴. بررسی بلیستر، تاریخ و هولوگرام شرکت داروسازی</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  داروهای تخصصی و کپسول‌ها در ورقه‌های بلیستر استاندارد و نفوذناپذیر با شماره بچ برجسته و جعبه‌های هولوگرام‌دار عرضه می‌گردند.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* تعهد زنجیره سرمایش و انبارداری استاندارد دارو و مکمل */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-4 text-xs text-gray-600 leading-relaxed">
          <h4 className="font-black text-sm text-gray-900 flex items-center gap-2">
            <Shield className="text-primary" size={18} /> تعهد زنجیره سرمایش و دمای استاندارد انبارداری
          </h4>
          <p>
            حتی مکمل و داروی اصل در صورت نگهداری در رطوبت، گرمای بالای ۲۵ درجه یا تابش مستقیم آفتاب، خواص فعال بیولوژیکی و پروتئینی خود را از دست می‌دهد. انبار مرکزی Team 9 مجهز به سیستم تهویه مطبوع هوشمند ۲۴ ساعته و پایش دائمی دما و رطوبت طبق استانداردهای GDP (Good Distribution Practice) دارویی کشور می‌باشد.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AuthenticityGuide;
