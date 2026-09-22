import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell, Loader2, ArrowRight, Phone, Lock, User, KeyRound, CheckCircle2, ArrowLeft } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  // حالت‌ها: login | register_step1 | register_step2 | forgot_step1 | forgot_step2
  const [view, setView] = useState('login');

  const { 
    login, sendRegisterOtp, verifyRegisterOtp, 
    sendResetOtp, verifyResetPassword, 
    isLoading, error, user, clearError 
  } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    code: '',
    newPassword: ''
  });

  const [testCodeHint, setTestCodeHint] = useState(''); // فقط برای نمایش کمکی در حالت تست

  useEffect(() => {
    if (user) navigate('/');
    clearError();
  }, [user, navigate, view, clearError]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ۱. ورود عادی
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    await login(formData.phone, formData.password);
  };

  // ۲. ارسال پیامک برای ثبت‌نام
  const handleRegisterSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password) {
      return alert('لطفاً تمام فیلدها را پر کنید');
    }
    const res = await sendRegisterOtp(formData.phone);
    if (res) {
      if (res.mockCode) setTestCodeHint(res.mockCode);
      setView('register_step2');
    }
  };

  // ۳. تایید پیامک و تکمیل ثبت‌نام
  const handleRegisterVerify = async (e) => {
    e.preventDefault();
    await verifyRegisterOtp(formData.name, formData.phone, formData.password, formData.code);
  };

  // ۴. ارسال پیامک برای فراموشی رمز
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone) return alert('شماره موبایل را وارد کنید');
    const res = await sendResetOtp(formData.phone);
    if (res) {
      if (res.mockCode) setTestCodeHint(res.mockCode);
      setView('forgot_step2');
    }
  };

  // ۵. تایید پیامک و تغییر رمز
  const handleForgotVerify = async (e) => {
    e.preventDefault();
    const ok = await verifyResetPassword(formData.phone, formData.code, formData.newPassword);
    if (ok) {
      alert('رمز عبور شما با موفقیت تغییر کرد! اکنون با رمز جدید وارد شوید.');
      setView('login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-[420px] bg-gray-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800 overflow-hidden relative z-10">
        <div className="p-8 sm:p-10">
          
          <div className="flex justify-between items-center mb-8">
            <Link to="/" className="p-2 rounded-full hover:bg-gray-800 text-gray-400 transition-colors">
              <ArrowRight size={22} />
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary text-dark p-2 rounded-xl"><Dumbbell size={26} strokeWidth={2.5} /></div>
              <span className="text-2xl font-black text-white tracking-tighter uppercase">Team 9</span>
            </Link>
            <div className="w-8"></div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-black text-white mb-1.5">
              {view === 'login' && 'ورود به حساب کاربری'}
              {view === 'register_step1' && 'عضویت در باشگاه Team 9'}
              {view === 'register_step2' && 'تایید شماره تلفن همراه'}
              {view === 'forgot_step1' && 'بازیابی رمز عبور'}
              {view === 'forgot_step2' && 'تنظیم رمز عبور جدید'}
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              {view === 'login' && 'شماره موبایل و رمز عبور خود را وارد نمایید.'}
              {view === 'register_step1' && 'اطلاعات خود را وارد کنید تا کد تایید برایتان ارسال شود.'}
              {view === 'register_step2' && `کد ۵ رقمی ارسال شده به شماره ${formData.phone} را وارد کنید.`}
              {view === 'forgot_step1' && 'شماره موبایل حسابتان را جهت دریافت کد بازیابی وارد کنید.'}
              {view === 'forgot_step2' && `کد پیامک‌شده به ${formData.phone} و رمز جدید را وارد نمایید.`}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-500/10 text-rose-500 text-xs font-bold rounded-2xl border border-rose-500/20">
              {error}
            </div>
          )}

          {testCodeHint && (view === 'register_step2' || view === 'forgot_step2') && (
            <div className="mb-5 p-3 bg-primary/10 border border-primary/30 rounded-2xl text-center text-xs text-primary font-mono font-bold">
              [حالت شبیه‌ساز پیامک] کد تایید: {testCodeHint}
            </div>
          )}

          {/* ۱. فرم ورود */}
          {view === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input 
                  required
                  type="tel" 
                  dir="ltr" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912 345 6789" 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 focus:border-primary rounded-2xl outline-none text-white text-left font-mono text-sm"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input 
                  required
                  type="password" 
                  dir="ltr" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 focus:border-primary rounded-2xl outline-none text-white text-left font-mono text-sm"
                />
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <button 
                  type="button" 
                  onClick={() => setView('forgot_step1')} 
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  رمز عبور را فراموش کرده‌اید؟
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-dark font-black py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center text-sm disabled:opacity-50 mt-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : 'ورود به حساب'}
              </button>
            </form>
          )}

          {/* ۲. فرم ثبت‌نام: مرحله اول (اطلاعات اولیه) */}
          {view === 'register_step1' && (
            <form onSubmit={handleRegisterSendOtp} className="space-y-4">
              <div className="relative">
                <User size={18} className="absolute right-4 top-3.5 text-gray-500" />
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="نام و نام خانوادگی" 
                  className="w-full pr-12 pl-4 py-3.5 bg-gray-800/50 border border-gray-700 focus:border-primary rounded-2xl outline-none text-white text-sm"
                />
              </div>

              <div className="relative">
                <Phone size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input 
                  required
                  type="tel" 
                  dir="ltr" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912 345 6789" 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 focus:border-primary rounded-2xl outline-none text-white text-left font-mono text-sm"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input 
                  required
                  type="password" 
                  dir="ltr" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="تعیین رمز عبور (حداقل ۶ کاراکتر)" 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 focus:border-primary rounded-2xl outline-none text-white text-left text-sm"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-dark font-black py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center text-sm disabled:opacity-50 mt-2"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : 'دریافت کد تایید پیامکی'}
              </button>
            </form>
          )}

          {/* ۳. فرم ثبت‌نام: مرحله دوم (وارد کردن کد پیامک) */}
          {view === 'register_step2' && (
            <form onSubmit={handleRegisterVerify} className="space-y-4">
              <div className="relative">
                <KeyRound size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input 
                  required
                  type="text" 
                  dir="ltr" 
                  maxLength={5}
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="- - - - -" 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 focus:border-primary rounded-2xl outline-none text-primary text-center font-mono text-xl tracking-widest font-black"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center text-sm disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : 'تایید شماره و عضویت در سایت'}
              </button>

              <button 
                type="button" 
                onClick={() => setView('register_step1')} 
                className="w-full text-xs text-gray-400 hover:text-white py-2"
              >
                ویرایش شماره موبایل
              </button>
            </form>
          )}

          {/* ۴. فراموشی رمز: مرحله اول (دریافت کد) */}
          {view === 'forgot_step1' && (
            <form onSubmit={handleForgotSendOtp} className="space-y-4">
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input 
                  required
                  type="tel" 
                  dir="ltr" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0912 345 6789" 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 focus:border-primary rounded-2xl outline-none text-white text-left font-mono text-sm"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-dark font-black py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center text-sm disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : 'ارسال کد بازیابی رمز'}
              </button>
            </form>
          )}

          {/* ۵. فراموشی رمز: مرحله دوم (کد + رمز جدید) */}
          {view === 'forgot_step2' && (
            <form onSubmit={handleForgotVerify} className="space-y-4">
              <div className="relative">
                <KeyRound size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input 
                  required
                  type="text" 
                  dir="ltr" 
                  maxLength={5}
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="کد ۵ رقمی پیامک شده" 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 focus:border-primary rounded-2xl outline-none text-primary text-center font-mono text-lg tracking-widest font-black"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-4 top-3.5 text-gray-500" />
                <input 
                  required
                  type="password" 
                  dir="ltr" 
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="رمز عبور جدید" 
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 focus:border-primary rounded-2xl outline-none text-white text-left text-sm"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary-hover text-dark font-black py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center text-sm disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20}/> : 'تایید و تغییر رمز'}
              </button>
            </form>
          )}

          {/* فوتر لینک‌های جابجایی */}
          <div className="mt-8 pt-6 border-t border-gray-800/60 text-center text-xs text-gray-400">
            {view === 'login' && (
              <p>
                ورزشکار جدید هستید؟{' '}
                <button onClick={() => setView('register_step1')} className="text-primary font-black hover:underline mr-1">
                  عضویت در Team 9
                </button>
              </p>
            )}

            {(view === 'register_step1' || view === 'forgot_step1' || view === 'forgot_step2') && (
              <p>
                حساب کاربری دارید؟{' '}
                <button onClick={() => setView('login')} className="text-primary font-black hover:underline mr-1">
                  ورود به حساب
                </button>
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
