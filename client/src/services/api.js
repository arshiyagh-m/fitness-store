// filepath: client/src/services/api.js
import axios from 'axios';

// ایجاد یک نمونه Axios با تنظیمات پایه
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// اینترسپتور برای افزودن اتوماتیک توکن به هدر درخواست‌ها
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
