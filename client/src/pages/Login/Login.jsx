// filepath: client/src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Loader2, ArrowRight, Phone, Lock, User, KeyRound, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';

const Login = () => {
  // view: 'login' | 'register' | 'forgot_request' | 'forgot_verify'
  const [view, setView] = useState('login');
  const [resetPhone, setResetPhone] = useState(''); // ذخیره شماره برای مرحله دوم فراموشی
  const [testOtpMock, setTestOtpMock] = useState(''); // فقط برای نمایش لاگ تست در UI

  const navigate = useNavigate();
  const { register: registerForm, handleSubmit, formState: { errors }, reset } = useForm();
  
  const { 
    login, register, requestOtp, resetPassword, 
    isLoading, error, successMessage, user, clearMessages 
  } = useAuthStore();

  useEffect(() => {
    if (user) navigate('/');
    clearMessages();
    reset(); // فرم را با تغییر ویو ریست می‌کنیم
  }, [user, navigate, view, clearMessages, reset]);

  const onSubmit = async (data) => {
    if (view === 'login') {
      await login(data.phone, data.password);
    } 
    else if (view === 'register') {
      await register(data.name, data.phone, data.password);
    } 
    else if (view === 'forgot_request') {
      const mockCode = await requestOtp(data.phone);
      if (mockCode) {
        setResetPhone(data.phone);
        setTestOtpMock(mockCode); // فقط برای محیط تست
        setView('forgot_verify');
      }
    }
    else if (view === 'forgot_verify') {
      const success = await resetPassword(resetPhone, data.code, data.newPassword);
      if (success) {
        setTimeout(() => setView('login'), 2000);
      }
    }
  };

  return (
    // پس‌زمینه با گرادیان ملایم برای حس مدرن
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      
      {/* کارت اصلی با سایه نرم، گردی بیشتر و ترانزیشن */}
      <div className="w-full max-w-[420px] bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-white/60 overflow-hidden transform transition-all duration-500 hover:shadow-[0_20px_60px_-12px_rgba(239,64,86,0.15)]">
        <div className="p-8 sm:p-10">
          
          {/* هدر کارت */}
          <div className="flex justify-between items-center mb-10">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowRight size={22} />
            </Link>
            <Link to="/" className="flex items-center gap-2 text-primary group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <Dumbbell size={28} strokeWidth={2.5} className="text-current" />
              </div>
              <span className="text-2xl font-black tracking-tight text-gray-900">فیت‌کالا</span>
            </Link>
            <div className="w-10"></div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {view === 'login' && 'خوش آمدید!'}
              {view === 'register' && 'عضویت در فیت‌کالا'}
              {view === 'forgot_request' && 'بازیابی رمز عبور'}
              {view === 'forgot_verify' && 'تغییر رمز عبور'}
            </h2>
            <p className="text-sm text-gray-500">
              {view === 'login' && 'لطفاً شماره موبایل و رمز عبور خود را وارد کنید.'}
              {view === 'register' && 'برای خریدی سریع‌تر، اطلاعات خود را ثبت کنید.'}
              {view === 'forgot_request' && 'شماره موبایل خود را وارد کنید تا کد تایید ارسال شود.'}
              {view === 'forgot_verify' && `کد ارسال شده به ${resetPhone} را وارد کنید.`}
            </p>
          </div>

          {/* پیام‌های سیستم */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 flex items-center animate-pulse">
              <span className="block">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 text-sm rounded-2xl border border-emerald-100 flex items-center gap-2">
              <CheckCircle2 size={20} />
              <span className="block">{successMessage}</span>
            </div>
          )}
          {view === 'forgot_verify' && testOtpMock && (
            <div className="mb-6 p-3 bg-blue-50 text-blue-700 text-xs rounded-xl border border-blue-100 text-center font-mono">
              [محیط تست] کد شما: {testOtpMock}
            </div>
          )}

          {/* فرم اصلی */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {view === 'register' && (
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  {...registerForm("name", { required: true })}
                  className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all duration-300 text-gray-700"
                  placeholder="نام و نام خانوادگی"
                />
              </div>
            )}

            {(view === 'login' || view === 'register' || view === 'forgot_request') && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Phone size={20} />
                </div>
                <input
                  type="tel"
                  dir="ltr"
                  {...registerForm("phone", { required: true, pattern: /^09\d{9}$/ })}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all duration-300 text-gray-700 text-left font-mono tracking-wider"
                  placeholder="0912 345 6789"
                />
              </div>
            )}

            {(view === 'login' || view === 'register') && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  dir="ltr"
                  {...registerForm("password", { required: true, minLength: 6 })}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all duration-300 text-gray-700 text-left font-mono tracking-wider"
                  placeholder="••••••••"
                />
              </div>
            )}

            {view === 'forgot_verify' && (
              <>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <KeyRound size={20} />
                  </div>
                  <input
                    type="text"
                    dir="ltr"
                    maxLength={5}
                    {...registerForm("code", { required: true })}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all duration-300 text-gray-700 text-left font-mono tracking-widest text-lg"
                    placeholder="- - - - -"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                    <Lock size={20} />
                  </div>
                  <input
                    type="password"
                    dir="ltr"
                    {...registerForm("newPassword", { required: true, minLength: 6 })}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent focus:bg-white focus:border-primary/30 focus:ring-4 focus:ring-primary/10 rounded-2xl outline-none transition-all duration-300 text-gray-700 text-left font-mono tracking-wider"
                    placeholder="رمز عبور جدید"
                  />
                </div>
              </>
            )}

            {view === 'login' && (
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setView('forgot_request')}
                  className="text-sm text-primary/80 hover:text-primary font-medium transition-colors focus:outline-none"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </button>
              </div>
            )}

            {/* دکمه با استایل پریمیوم و افکت Hover */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-rose-500 hover:from-primary-hover hover:to-rose-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                view === 'login' ? 'ورود به حساب' :
                view === 'register' ? 'ثبت‌نام' :
                view === 'forgot_request' ? 'دریافت کد تایید' : 'تایید و تغییر رمز'
              )}
            </button>
          </form>

          {/* Footer لینک‌های تغییر حالت */}
          <div className="mt-8 text-center">
            {view === 'login' && (
              <p className="text-sm text-gray-600">
                حساب کاربری ندارید؟ {' '}
                <button onClick={() => setView('register')} className="text-primary font-bold hover:underline focus:outline-none">ثبت‌نام کنید</button>
              </p>
            )}
            {(view === 'register' || view === 'forgot_request' || view === 'forgot_verify') && (
              <p className="text-sm text-gray-600">
                بازگشت به {' '}
                <button onClick={() => setView('login')} className="text-primary font-bold hover:underline focus:outline-none">صفحه ورود</button>
              </p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
