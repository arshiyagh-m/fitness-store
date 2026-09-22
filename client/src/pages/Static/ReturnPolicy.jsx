import React from 'react';
import { RotateCcw, CheckCircle, ArrowRight, ShieldAlert, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-white rounded-xl shadow-sm"><ArrowRight size={20}/></Link>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <RotateCcw className="text-primary" size={28} /> رویه ۷ روزه بازگرداندن و عودت وجه
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6 text-sm text-gray-700 leading-relaxed">
          <h2 className="text-base font-black text-gray-900 border-b border-gray-100 pb-3">شرایط بازگشت کالا در Team 9</h2>
          <p>
            رضایت و اطمینان خاطر ورزشکاران اولویت نخست ماست. به همین جهت، کلیه خریداران تا <strong>۷ روز کاری</strong> پس از تحویل سفارش حق بازگرداندن محصول را دارند.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-2xl text-emerald-900 border border-emerald-200">
              <CheckCircle size={20} className="shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <strong className="block mb-1">عدم تطابق یا مغایرت طعم/وزن:</strong>
                <span>اگر مکمل ارسال شده با سفارش ثبت شده شما مغایرت داشته باشد (مثلا وانیل به جای شکلات)، کالا بدون هیچ هزینه‌ای تعویض یا مبلغ تماماً عودت داده می‌شود.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl text-amber-900 border border-amber-200">
              <ShieldAlert size={20} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <strong className="block mb-1">شرط مهم بهداشتی بازگرداندن مکمل:</strong>
                <span>به دلیل رعایت پروتکل‌های بهداشتی و سلامت مواد غذایی، مکمل تنها در صورتی قابل بازگشت است که <strong>پلمپ پلاستیکی دور درب قوطی و برچسب اصالت به هیچ وجه باز یا پاره نشده باشد</strong>.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl text-gray-800 border border-gray-200">
              <FileText size={20} className="shrink-0 text-primary mt-0.5" />
              <div>
                <strong className="block mb-1">رویه بازگشت وجه:</strong>
                <span>پس از دریافت کالا توسط انبار مرکزی Team 9 و تایید سلامت فیزیکی پلمپ، مبلغ سفارش ظرف مدت <strong>۲۴ الی ۴۸ ساعت کاری</strong> به شماره شبای ثبت‌شده در سفارش واریز خواهد شد.</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReturnPolicy;
