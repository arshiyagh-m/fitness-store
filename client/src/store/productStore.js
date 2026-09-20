// filepath: client/src/store/productStore.js
import { create } from 'zustand';
import api from '../services/api';

const useProductStore = create((set) => ({
  products: [],
  productDetail: null,
  isLoading: false,
  error: null,

  fetchProducts: async (filters = '') => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/products${filters}`);
      set({ products: data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/products/${id}`);
      // حذف محصول از لیست فعلی استیت بدون نیاز به رفرش
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        isLoading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      return false;
    }
  },
}));

export default useProductStore;
