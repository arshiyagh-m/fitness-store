import { create } from 'zustand';

const userInfoFromStorage = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

const useAuthStore = create((set) => ({
  user: userInfoFromStorage,
  isLoading: false,
  error: null,
  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
}));

export default useAuthStore;
