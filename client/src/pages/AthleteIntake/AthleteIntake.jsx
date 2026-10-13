import React, { useState } from 'react';
import { Dumbbell, Send, CheckCircle2, ShieldCheck, ArrowRight, Award, Sparkles, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AthleteIntake = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: '', isErr: false });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const current = formData[name] || [];
      if (checked) {
        setFormData({ ...formData, [name]: [...current, value] });
      } else {
        setFormData({ ...formData, [name]: current.filter(v => v !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTextChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    if (!formData['نام و نام خانوادگی']?.trim()) {
      setStatusMsg({ text: '⚠️ لطفاً نام و نام خانوادگی را وارد کنید.', isErr: true });
      return false;
    }
    if (!formData['شماره تماس']?.trim()) {
      setStatusMsg({ text: '⚠️ لطفاً شماره تماس / تلگرام خود را وارد کنید.', isErr: true });
      return false;
    }
    if (!formData['تأیید تعهدنامه']) {
      setStatusMsg({ text: '⚠️ لطفاً تیک مطالعه و تأیید تعهدنامه را فعال کنید.', isErr: true });
      return false;
    }
    return true;
  };

  const handleSubmitOnline = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setStatusMsg({ text: '', isErr: false });

    try {
      await api.post('/athlete-intake', {
        fullName: formData['نام و نام خانوادگی'],
        phone: formData['شماره تماس'],
        formData: formData,
      });
      setIsSubmitted(true);
      setStatusMsg({ text: '✅ پرونده ورزشی شما با موفقیت ثبت شد و در اختیار مربی دانیال سلیمانی قرار گرفت.', isErr: false });
    } catch (err) {
      setStatusMsg({ text: err.response?.data?.message || 'خطا در ثبت پرونده', isErr: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen py-10 px-4 font-sans selection:bg-primary selection:text-dark" dir="rtl">
      <div className="max-w-4xl mx-auto bg-[#121214] rounded-3xl border border-[#27272a] shadow-2xl overflow-hidden p-6 sm:p-12">
        
        {/* نوار بالایی */}
        <div className="flex justify-between items-center pb-6 border-b border-[#27272a] mb-8">
          <Link to="/" className="flex items-center gap-2 text-primary font-black text-xs hover:underline">
            <ArrowRight size={16} /> بازگشت به فروشگاه Team 9
          </Link>
          <div className="text-left font-mono">
            <span className="text-xs text-primary font-black tracking-widest block">DANIAL SOLEIMANI</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">TRAINING ARCHITECT</span>
          </div>
        </div>

        {/* 🌟 بنر هدر اختصاصی با تصویر کامل و بدون کات شدن دانیال سلیمانی */}
        <div className="bg-gradient-to-br from-[#18181b] via-[#121214] to-[#09090b] rounded-3xl border border-[#27272a] p-6 sm:p-8 mb-8 relative overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row items-center gap-8 z-10 relative">
            
            {/* قاب تصویر کامل مربی (object-contain برای جلوگیری از هرگونه کات شدن) */}
            <div className="w-48 sm:w-56 h-[340px] sm:h-[400px] rounded-3xl overflow-hidden border-2 border-primary shadow-[0_0_35px_rgba(251,191,36,0.2)] shrink-0 bg-black relative group flex items-center justify-center">
              <img 
                src="/images/coach.jpg" 
                alt="دانیال سلیمانی - مربی ارشد Team 9" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 select-none"
              />
              <div className="hidden absolute inset-0 bg-dark items-center justify-center flex-col text-primary">
                <Dumbbell size={40} />
                <span className="text-[10px] text-gray-400 mt-2">تصویر مربی</span>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 text-center pointer-events-none">
                <span className="text-xs font-black text-primary block">دانیال سلیمانی</span>
                <span className="text-[9px] text-gray-400 font-mono tracking-wider">HEAD COACH & ARCHITECT</span>
              </div>
            </div>

            {/* توضیحات و پیام مربی به ورزشکار */}
            <div className="space-y-3 text-center md:text-right flex-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-black">
                <Sparkles size={14} /> فرم اختصاصی پذیرش و ارزیابی ورزشکار
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                به مسیر تحول اصولی بدن خوش آمدید!
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-medium">
                «بدن شما یک سازه مهندسی است؛ نه شانس و تصادف! هر چه اطلاعات این فرم (آسیب‌ها، سوابق وزنه، عادات غذایی و خواب) را دقیق‌تر بنویسید، برنامه‌ای که شخصاً برای شما طراحی می‌کنم کارآمدتر و بدون ریسک آسیب خواهد بود.»
              </p>
              <div className="pt-2 flex flex-wrap gap-4 justify-center md:justify-start text-[11px] text-gray-400 font-bold">
                <span className="flex items-center gap-1"><Award size={14} className="text-primary"/> طراحی کاملاً اختصاصی</span>
                <span className="flex items-center gap-1"><UserCheck size={14} className="text-primary"/> پشتیبانی و چک‌این هفتگی</span>
              </div>
            </div>

          </div>
        </div>

        <div className="p-4 bg-primary/10 border-r-4 border-primary rounded-xl text-primary text-xs sm:text-sm font-bold leading-relaxed mb-8">
          ورزشکار عزیز؛ لطفاً با حوصله و تمرکز تمام ۱۱ بخش زیر را تکمیل کنید. اطلاعات شما محرمانه و صرفاً جهت طراحی علمی برنامه در اختیار مربی قرار می‌گیرد.
        </div>

        {statusMsg.text && (
          <div className={`p-4 rounded-xl text-xs font-black mb-8 border ${statusMsg.isErr ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'}`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmitOnline} className="space-y-10">

          {/* ۱. اطلاعات فردی */}
          <div className="p-6 bg-[#09090b] rounded-2xl border border-[#27272a] space-y-6">
            <h2 className="text-base font-black text-white flex items-center gap-2 pb-4 border-b border-[#27272a]">
              <span className="w-7 h-7 bg-primary text-dark rounded-lg flex items-center justify-center text-xs font-black">۱</span>
              اطلاعات فردی و راه‌های ارتباطی
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-bold">نام و نام خانوادگی *</label>
                <input required type="text" onChange={(e) => handleTextChange('نام و نام خانوادگی', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl outline-none focus:border-primary text-white" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">شماره تماس / تلگرام *</label>
                <input required type="tel" dir="ltr" onChange={(e) => handleTextChange('شماره تماس', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl outline-none focus:border-primary text-white text-left font-mono" placeholder="0912 345 6789" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">سن / تاریخ تولد</label>
                <input type="text" onChange={(e) => handleTextChange('سن', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl outline-none focus:border-primary text-white" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">قد (سانتی‌متر)</label>
                <input type="number" onChange={(e) => handleTextChange('قد', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl outline-none focus:border-primary text-white font-mono text-center" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">وزن فعلی (کیلوگرم)</label>
                <input type="number" onChange={(e) => handleTextChange('وزن فعلی', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl outline-none focus:border-primary text-white font-mono text-center" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">بیشترین و کمترین وزن قبلی</label>
                <input type="text" onChange={(e) => handleTextChange('سابقه وزن', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl outline-none focus:border-primary text-white" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">شهر / کشور محل سکونت</label>
                <input type="text" onChange={(e) => handleTextChange('شهر محل سکونت', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl outline-none focus:border-primary text-white" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">شغل و ساعات کاری</label>
                <input type="text" onChange={(e) => handleTextChange('شغل', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl outline-none focus:border-primary text-white" />
              </div>
            </div>
          </div>

          {/* ۲. اهداف و انتظارات */}
          <div className="p-6 bg-[#09090b] rounded-2xl border border-[#27272a] space-y-6">
            <h2 className="text-base font-black text-white flex items-center gap-2 pb-4 border-b border-[#27272a]">
              <span className="w-7 h-7 bg-primary text-dark rounded-lg flex items-center justify-center text-xs font-black">۲</span>
              اهداف و انتظارات از دوره
            </h2>
            <div className="space-y-4 text-xs">
              <label className="block text-gray-400 font-bold">هدف اصلی شما چیست؟</label>
              <div className="flex flex-wrap gap-2">
                {['کاهش چربی و سلامت عمومی', 'افزایش عضله (حجم)', 'ریکامپ (چربی‌سوزی + عضله‌سازی)', 'افزایش قدرت', 'آمادگی مسابقه'].map(goal => (
                  <label key={goal} className="px-4 py-2.5 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl cursor-pointer hover:border-primary flex items-center gap-2">
                    <input type="checkbox" name="اهداف" value={goal} onChange={handleInputChange} className="accent-primary" />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>
              <textarea rows="3" placeholder="توضیح تکمیلی درباره اهداف..." onChange={(e) => handleTextChange('توضیح هدف', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl outline-none focus:border-primary text-white resize-none"></textarea>
            </div>
          </div>

          {/* ۳. سوابق تمرینی */}
          <div className="p-6 bg-[#09090b] rounded-2xl border border-[#27272a] space-y-6">
            <h2 className="text-base font-black text-white flex items-center gap-2 pb-4 border-b border-[#27272a]">
              <span className="w-7 h-7 bg-primary text-dark rounded-lg flex items-center justify-center text-xs font-black">۳</span>
              سوابق و شرایط تمرین
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-bold">سابقه تمرین با وزنه</label>
                <input type="text" placeholder="مثال: ۲ سال مداوم" onChange={(e) => handleTextChange('سابقه تمرین', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">چند روز در هفته می‌توانید تمرین کنید؟</label>
                <input type="text" placeholder="مثال: ۴ الی ۵ روز" onChange={(e) => handleTextChange('روزهای تمرین', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl text-white outline-none focus:border-primary" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-gray-400 mb-1 font-bold">امکانات محل تمرین</label>
                <input type="text" placeholder="باشگاه کامل، دمبل و هالتر در خانه، یا..." onChange={(e) => handleTextChange('امکانات تمرین', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl text-white outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          {/* ۴. آسیب‌دیدگی و وضعیت پزشکی */}
          <div className="p-6 bg-[#09090b] rounded-2xl border border-[#27272a] space-y-6">
            <h2 className="text-base font-black text-white flex items-center gap-2 pb-4 border-b border-[#27272a]">
              <span className="w-7 h-7 bg-primary text-dark rounded-lg flex items-center justify-center text-xs font-black">۴</span>
              سلامت، آسیب‌دیدگی و وضعیت پزشکی
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-bold">آسیب‌دیدگی فعلی یا قدیمی (زانو، دیسک کمر، شانه، گردن و...)</label>
                <textarea rows="2" placeholder="محل آسیب و حرکاتی که درد ایجاد می‌کنند..." onChange={(e) => handleTextChange('آسیب‌دیدگی', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl text-white outline-none focus:border-primary resize-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">بیماری خاص یا داروهای مصرفی فعلی</label>
                <input type="text" placeholder="تیروئید، فشار خون، یا داروی خاص..." onChange={(e) => handleTextChange('بیماری و دارو', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl text-white outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          {/* ۵. عادات غذایی و مکمل‌ها */}
          <div className="p-6 bg-[#09090b] rounded-2xl border border-[#27272a] space-y-6">
            <h2 className="text-base font-black text-white flex items-center gap-2 pb-4 border-b border-[#27272a]">
              <span className="w-7 h-7 bg-primary text-dark rounded-lg flex items-center justify-center text-xs font-black">۵</span>
              تغذیه و مکمل‌های مصرفی
            </h2>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-bold">یک روز عادی غذایی خود را کامل بنویسید (از صبح تا شب)</label>
                <textarea rows="4" placeholder="صبحانه، ناهار، شام، میان‌وعده‌ها و عادات غذایی..." onChange={(e) => handleTextChange('یک روز غذایی', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl text-white outline-none focus:border-primary resize-none"></textarea>
              </div>
              <div>
                <label className="block text-gray-400 mb-1 font-bold">مکمل‌هایی که در حال حاضر مصرف می‌کنید یا در دسترس دارید</label>
                <input type="text" placeholder="وی، کراتین، گلوتامین، مولتی‌ویتامین و..." onChange={(e) => handleTextChange('مکمل‌های فعلی', e.target.value)} className="w-full p-3 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl text-white outline-none focus:border-primary" />
              </div>
            </div>
          </div>

          {/* ۶. اندازه‌گیری‌های بدنی */}
          <div className="p-6 bg-[#09090b] rounded-2xl border border-[#27272a] space-y-6">
            <h2 className="text-base font-black text-white flex items-center gap-2 pb-4 border-b border-[#27272a]">
              <span className="w-7 h-7 bg-primary text-dark rounded-lg flex items-center justify-center text-xs font-black">۶</span>
              اندازه‌گیری‌های بدنی (سانتی‌متر - صبح ناشتا)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {['دور سینه', 'دور بازو', 'دور کمر (ناف)', 'دور باسن', 'دور ران', 'دور ساق', 'دور گردن', 'دور ساعد'].map(item => (
                <div key={item}>
                  <label className="block text-gray-400 mb-1 font-bold">{item}</label>
                  <input type="text" placeholder="cm" onChange={(e) => handleTextChange(`سایز: ${item}`, e.target.value)} className="w-full p-2.5 bg-[#1c1c1f] border border-[#3f3f46] rounded-xl text-white text-center font-mono outline-none focus:border-primary" />
                </div>
              ))}
            </div>
          </div>

          {/* ۷. تعهدنامه اخلاقی */}
          <div className="p-6 bg-rose-500/5 rounded-2xl border border-rose-500/20 space-y-4 text-xs">
            <h3 className="font-black text-rose-400 flex items-center gap-2">
              <ShieldCheck size={18}/> تعهدنامه انضباطی ورزشکار
            </h3>
            <p className="text-gray-300 leading-relaxed">
              اینجانب تأیید می‌کنم که تمام اطلاعات این فرم را صادقانه و کامل وارد کرده‌ام، هرگونه تغییر در وضعیت جسمانی خود را فوراً به مربی اطلاع می‌دهم و متعهد می‌شوم گزارش‌های منظم (چک‌این هفتگی) را طبق برنامه ارسال کنم.
            </p>
            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input type="checkbox" name="تأیید تعهدنامه" value="تایید شد" onChange={handleInputChange} className="w-5 h-5 accent-primary rounded" />
              <strong className="text-white">تعهدنامه بالا را با دقت خواندم و تایید می‌کنم.</strong>
            </label>
          </div>

          {/* دکمه ثبت */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className="w-full bg-primary hover:bg-primary-hover text-dark font-black py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'در حال ارسال پرونده به مربی...' : isSubmitted ? 'پرونده با موفقیت ثبت شد ✔' : <><Send size={18}/> ثبت نهایی پرونده و ارسال به مربی دانیال سلیمانی</>}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AthleteIntake;
