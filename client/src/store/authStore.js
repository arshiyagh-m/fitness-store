import { create } from 'zustand';
import api from '../services/api';

const toEnglishDigits = (str) => {
  if (!str) return '';
  return str.toString()
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
};

const userInfoFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const useAuthStore = create((set) => ({
  user: userInfoFromStorage,
  isLoading: false,
  error: null,

  login: async (phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const cleanPhone = toEnglishDigits(phone).trim();
      const cleanPassword = toEnglishDigits(password).trim();
      const { data } = await api.post('/auth/login', { phone: cleanPhone, password: cleanPassword });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'شماره موبایل یا رمز عبور اشتباه است',
        isLoading: false,
      });
      return false;
    }
  },

  // ارسال کد پیامک ثبت‌نام
  sendRegisterOtp: async (phone) => {
    set({ isLoading: true, error: null });
    try {
      const cleanPhone = toEnglishDigits(phone).trim();
      const { data } = await api.post('/auth/register/send-otp', { phone: cleanPhone });
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'خطا در ارسال کد تایید',
        isLoading: false,
      });
      return null;
    }
  },

  // تایید کد و تکمیل ثبت‌نام
  verifyRegisterOtp: async (name, phone, password, code) => {
    set({ isLoading: true, error: null });
    try {
      const cleanPhone = toEnglishDigits(phone).trim();
      const cleanPassword = toEnglishDigits(password).trim();
      const cleanCode = toEnglishDigits(code).trim();

      const { data } = await api.post('/auth/register/verify', {
        name,
        phone: cleanPhone,
        password: cleanPassword,
        code: cleanCode
      });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'کد تایید نامعتبر است',
        isLoading: false,
      });
      return false;
    }
  },

  // ارسال کد بازیابی رمز
  sendResetOtp: async (phone) => {
    set({ isLoading: true, error: null });
    try {
      const cleanPhone = toEnglishDigits(phone).trim();
      const { data } = await api.post('/auth/reset-password/send-otp', { phone: cleanPhone });
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'شماره یافت نشد',
        isLoading: false,
      });
      return null;
    }
  },

  // تایید کد و تغییر رمز عبور
  verifyResetPassword: async (phone, code, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const cleanPhone = toEnglishDigits(phone).trim();
      const cleanCode = toEnglishDigits(code).trim();
      const cleanPassword = toEnglishDigits(newPassword).trim();

      const { data } = await api.post('/auth/reset-password/verify', {
        phone: cleanPhone,
        code: cleanCode,
        newPassword: cleanPassword
      });
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'کد نامعتبر است',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
