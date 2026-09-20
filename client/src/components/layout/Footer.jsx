// filepath: client/src/components/layout/Footer.jsx
import React from 'react';
import { ChevronUp, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-200 mt-12 pt-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-primary">فیت‌کالا</div>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
          >
            بازگشت به بالا
            <ChevronUp size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-sm text-gray-600">
          <div>
            <h4 className="text-gray-800 font-bold mb-4 text-base">با فیت‌کالا</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary">درباره ما</a></li>
              <li><a href="#" className="hover:text-primary">تماس با ما</a></li>
              <li><a href="#" className="hover:text-primary">فرصت‌های شغلی</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gray-800 font-bold mb-4 text-base">خدمات مشتریان</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary">پاسخ به پرسش‌های متداول</a></li>
              <li><a href="#" className="hover:text-primary">رویه بازگرداندن کالا</a></li>
              <li><a href="#" className="hover:text-primary">شرایط استفاده</a></li>
              <li><a href="#" className="hover:text-primary">حریم خصوصی</a></li>
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="text-gray-800 font-bold mb-4 text-base">ارتباط با ما</h4>
            <p className="mb-4">تیم پشتیبانی ما ۷ روز هفته، ۲۴ ساعته پاسخگوی شماست.</p>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-2"><Phone size={18} className="text-gray-400"/> ۰۲۱-۱۲۳۴۵۶۷۸</div>
              <div className="flex items-center gap-2"><Mail size={18} className="text-gray-400"/> info@fitkala.com</div>
              <div className="flex items-center gap-2"><MapPin size={18} className="text-gray-400"/> تهران، خیابان ورزشی، پلاک ۱۰۰</div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 py-6 text-center text-xs text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>استفاده از مطالب فروشگاه اینترنتی فیت‌کالا فقط برای مقاصد غیرتجاری و با ذکر منبع بلامانع است. کلیه حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;