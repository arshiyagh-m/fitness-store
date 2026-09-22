import { create } from 'zustand';

const useCompareStore = create((set, get) => ({
  compareItems: [],
  addToCompare: (product) => {
    const { compareItems } = get();
    if (compareItems.some(item => item._id === product._id)) return;
    if (compareItems.length >= 3) {
      alert('حداکثر ۳ مکمل را می‌توانید به صورت همزمان مقایسه کنید.');
      return;
    }
    set({ compareItems: [...compareItems, product] });
  },
  removeFromCompare: (id) => {
    set({ compareItems: get().compareItems.filter(item => item._id !== id) });
  },
  clearCompare: () => set({ compareItems: [] }),
}));

export default useCompareStore;
