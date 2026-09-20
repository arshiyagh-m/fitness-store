// filepath: client/src/store/authStore.js
import { create } from 'zustand';
import api from '../services/api';

const userInfoFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null;

const useAuthStore = create((set) => ({
  user: userInfoFromStorage,
  isLoading: false,
  error: null,
  successMessage: null,

  login: async (phone, password) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const { data } = await api.post('/auth/login', { phone, password });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      return false;
    }
  },

  register: async (name, phone, password) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const { data } = await api.post('/auth/register', { name, phone, password });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      return false;
    }
  },

  requestOtp: async (phone) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const { data } = await api.post('/auth/request-otp', { phone });
      set({ successMessage: data.message, isLoading: false });
      return data.mockCode; // برای تست لوکال برمی‌گردانیم
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      return null;
    }
  },

  resetPassword: async (phone, code, newPassword) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const { data } = await api.post('/auth/reset-password', { phone, code, newPassword });
      set({ successMessage: data.message, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  clearMessages: () => set({ error: null, successMessage: null })
}));

export default useAuthStore;
