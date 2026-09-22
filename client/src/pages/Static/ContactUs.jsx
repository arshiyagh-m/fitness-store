import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-white rounded-xl shadow-sm"><ArrowRight size={20}/></Link>
          <h1 className="text-2xl font-black text-gray-900">تماس با کارشناسان Team 9</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="md:col-span-1 space-y-4">
            <div className="bg-dark text-white p-6 rounded-3xl space-y-6 border border-gray-800">
              <h2 className="font-black text-base text-primary pb-3 border-b border-gray-800">اطلاعات تماس و پشتیبانی</h2>
              
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="block text-gray-400 mb-1">تلفن پشتیبانی:</span>
                    <strong className="text-sm font-mono tracking-wider">021-12345678</strong>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="block text-gray-400 mb-1">ایمیل رسمی:</span>
                    <span className="font-mono">support@team9.ir</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="block text-gray-400 mb-1">دفتر مرکزی و انبار:</span>
                    <span>تهران، خیابان ولیعصر، برج ورزشی، طبقه ۵</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-primary shrink-0" />
                  <div>
                    <span className="block text-gray-400 mb-1">ساعات پاسخگویی:</span>
                    <span>شنبه تا پنج‌شنبه ۹ الی ۲۱</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-base font-black text-gray-900 mb-4 pb-3 border-b border-gray-100">ارسال پیام به واحد پشتیبانی</h2>
            
            {submitted && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} className="text-emerald-600"/> پیام شما با موفقیت ثبت شد. به زودی تماس خواهیم گرفت.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">نام و نام خانوادگی</label>
                  <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">شماره تماس</label>
                  <input required type="tel" dir="ltr" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary text-left font-mono" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">موضوع پیام</label>
                <input required type="text" className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">متن پیام یا سوال شما</label>
                <textarea required rows="4" className="w-full p-4 bg-gray-50 border rounded-xl text-xs outline-none focus:border-primary resize-none"></textarea>
              </div>

              <button type="submit" className="w-full bg-dark text-primary hover:bg-gray-800 font-black py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-xs">
                <Send size={14}/> ارسال پیام به کارشناسان
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactUs;
