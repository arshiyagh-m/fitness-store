import { create } from 'zustand';
import api from '../services/api';

// تابع هوشمند تبدیل اعداد فارسی به انگلیسی
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

  register: async (name, phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const cleanPhone = toEnglishDigits(phone).trim();
      const cleanPassword = toEnglishDigits(password).trim();

      const { data } = await api.post('/auth/register', { name, phone: cleanPhone, password: cleanPassword });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'خطا در ثبت‌نام',
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
