// filepath: client/src/store/authStore.js
import { create } from 'zustand';
import api from '../services/api';

// خواندن اطلاعات کاربر از لوکال استوریج در زمان لود اولیه
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
      const { data } = await api.post('/auth/login', { phone, password });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true; // موفقیت‌آمیز
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message 
          ? error.response.data.message 
          : error.message, 
        isLoading: false 
      });
      return false; // شکست
    }
  },

  register: async (name, phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, phone, password });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({ 
        error: error.response && error.response.data.message 
          ? error.response.data.message 
          : error.message, 
        isLoading: false 
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
