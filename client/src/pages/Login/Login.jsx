// filepath: client/src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Loader2, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();
  
  const { register: registerForm, handleSubmit, formState: { errors } } = useForm();
  const { login, register, isLoading, error, user, clearError } = useAuthStore();

  // اگر کاربر لاگین بود، به صفحه اصلی هدایت شود
  useEffect(() => {
    if (user) {
      navigate('/');
    }
    // پاک کردن خطاهای قبلی در صورت تغییر تب
    clearError();
  }, [user, navigate, isLoginMode, clearError]);

  const onSubmit = async (data) => {
    if (isLoginMode) {
      await login(data.phone, data.password);
    } else {
      await register(data.name, data.phone, data.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-8">
          
          {/* لوگو و بازگشت */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowRight size={24} />
            </Link>
            <Link to="/" className="flex items-center gap-1 text-primary mx-auto">
              <Dumbbell size={32} strokeWidth={2.5} />
              <span className="text-2xl font-bold tracking-tight">فیت‌کالا</span>
            </Link>
            <div className="w-6"></div> {/* Spacer */}
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {isLoginMode ? 'ورود به حساب کاربری' : 'ثبت‌نام در فیت‌کالا'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {!isLoginMode && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">نام و نام خانوادگی</label>
                <input
                  type="text"
                  {...registerForm("name", { required: !isLoginMode })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                  placeholder="مثال: علی محمدی"
                />
                {errors.name && <span className="text-xs text-red-500 mt-1">وارد کردن نام الزامی است</span>}
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-700 mb-1">شماره موبایل</label>
              <input
                type="tel"
                dir="ltr"
                {...registerForm("phone", { 
                  required: true,
                  pattern: /^09\d{9}$/
                })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-left"
                placeholder="09123456789"
              />
              {errors.phone && <span className="text-xs text-red-500 mt-1">شماره موبایل نامعتبر است (مثال: 09123456789)</span>}
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-1">رمز عبور</label>
              <input
                type="password"
                dir="ltr"
                {...registerForm("password", { 
                  required: true, 
                  minLength: 6 
                })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-left"
                placeholder="••••••"
              />
              {errors.password && <span className="text-xs text-red-500 mt-1">رمز عبور باید حداقل ۶ کاراکتر باشد</span>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (isLoginMode ? 'ورود' : 'ثبت‌نام')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
            {isLoginMode ? 'حساب کاربری ندارید؟' : 'قبلاً ثبت‌نام کرده‌اید؟'}
            <button
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-primary font-bold mr-2 hover:underline focus:outline-none"
            >
              {isLoginMode ? 'ثبت‌نام کنید' : 'وارد شوید'}
            </button>
          </div>
          
          <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
            با ورود و یا ثبت نام در فیت‌کالا شما شرایط و قوانین استفاده از سرویس‌های سایت و قوانین حریم خصوصی آن را می‌پذیرید.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
