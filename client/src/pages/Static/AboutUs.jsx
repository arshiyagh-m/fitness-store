import React from 'react';
import { Dumbbell, Award, Users, HeartHandshake, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-white rounded-xl shadow-sm"><ArrowRight size={20}/></Link>
          <h1 className="text-2xl font-black text-gray-900">درباره باشگاه و فروشگاه تخصصی Team 9</h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6 text-sm text-gray-700 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="p-3 bg-dark text-primary rounded-2xl">
              <Dumbbell size={28} />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900">تیم ۹؛ پیشرو در سلامت و تغذیه قهرمانان</h2>
              <p className="text-xs text-gray-400 mt-0.5">تاسیس ۱۳۹۸ - مرجع تخصصی مکمل‌های مجاز ورزشی</p>
            </div>
          </div>

          <p>
            فروشگاه اینترنتی <strong>Team 9</strong> با هدف پایان دادن به عرضه مکمل‌های فیک و زیرپله‌ای در بازار ورزش ایران راه‌اندازی شد. ما تیمی متشکل از مربیان بدنسازی، قهرمانان ملی و داروسازان هستیم که بر این باوریم سوخت بدن یک ورزشکار باید پاک‌ترین، خالص‌ترین و مطمئن‌ترین باشد.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-5 bg-gray-50 rounded-2xl text-center border border-gray-100">
              <Award className="mx-auto text-primary mb-2" size={28} />
              <strong className="block text-gray-900 mb-1">۱۰۰٪ ضمانت اصالت</strong>
              <span className="text-xs text-gray-500">فقط مکمل‌های شرکتی با هولوگرام</span>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl text-center border border-gray-100">
              <Users className="mx-auto text-primary mb-2" size={28} />
              <strong className="block text-gray-900 mb-1">+۵۰,۰۰۰ ورزشکار</strong>
              <span className="text-xs text-gray-500">جامعه مشتریان وفادار در سراسر کشور</span>
            </div>
            <div className="p-5 bg-gray-50 rounded-2xl text-center border border-gray-100">
              <HeartHandshake className="mx-auto text-primary mb-2" size={28} />
              <strong className="block text-gray-900 mb-1">مشاوره تخصصی</strong>
              <span className="text-xs text-gray-500">پاسخگویی مربیان تغذیه ورزشی</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
