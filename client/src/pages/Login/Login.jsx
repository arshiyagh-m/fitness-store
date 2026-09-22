import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Loader2, ArrowRight, Phone, Lock, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();
  const { register: registerForm, handleSubmit } = useForm();
  const { login, register, isLoading, error, user } = useAuthStore();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const onSubmit = async (data) => {
    if (isLoginMode) await login(data.phone, data.password);
    else await register(data.name, data.phone, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4 relative overflow-hidden">
      {/* بک‌گراند جذاب */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-[420px] bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800 overflow-hidden relative z-10">
        <div className="p-8 sm:p-10">
          
          <div className="flex justify-between items-center mb-10">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-800 text-gray-400 transition-colors"><ArrowRight size={22} /></Link>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary text-dark p-2 rounded-xl"><Dumbbell size={28} strokeWidth={2.5} /></div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">Team 9</span>
            </Link>
            <div className="w-10"></div>
          </div>

          <h2 className="text-2xl font-black text-white mb-2">{isLoginMode ? 'ورود به حساب' : 'عضویت در تیم ۹'}</h2>
          <p className="text-sm text-gray-400 mb-8">{isLoginMode ? 'شماره موبایل و رمز عبور خود را وارد کنید.' : 'اطلاعات خود را ثبت کنید.'}</p>

          {error && <div className="mb-6 p-4 bg-rose-500/10 text-rose-500 text-sm font-bold rounded-2xl border border-rose-500/20">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {!isLoginMode && (
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 group-focus-within:text-primary"><User size={20} /></div>
                <input type="text" {...registerForm("name")} className="w-full pr-12 pl-4 py-4 bg-gray-800/50 border border-gray-700 focus:bg-gray-800 focus:border-primary rounded-2xl outline-none transition-all text-white" placeholder="نام و نام خانوادگی" />
              </div>
            )}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-primary"><Phone size={20} /></div>
              <input type="tel" dir="ltr" {...registerForm("phone")} className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 focus:bg-gray-800 focus:border-primary rounded-2xl outline-none transition-all text-white text-left font-mono" placeholder="09123456789" />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500 group-focus-within:text-primary"><Lock size={20} /></div>
              <input type="password" dir="ltr" {...registerForm("password")} className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 focus:bg-gray-800 focus:border-primary rounded-2xl outline-none transition-all text-white text-left font-mono" placeholder="••••••••" />
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary-hover text-dark font-black py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center mt-4">
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : (isLoginMode ? 'ورود به حساب' : 'ثبت‌نام')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              {isLoginMode ? 'حساب کاربری ندارید؟ ' : 'قبلاً ثبت‌نام کرده‌اید؟ '}
              <button onClick={() => setIsLoginMode(!isLoginMode)} className="text-primary font-bold hover:underline">{isLoginMode ? 'ثبت‌نام کنید' : 'وارد شوید'}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
