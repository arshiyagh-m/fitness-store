import { create } from 'zustand';

const wishlistFromStorage = localStorage.getItem('team9_wishlist')
  ? JSON.parse(localStorage.getItem('team9_wishlist'))
  : [];

const useWishlistStore = create((set, get) => ({
  wishlistItems: wishlistFromStorage,

  toggleWishlist: (product) => {
    const { wishlistItems } = get();
    const exists = wishlistItems.some((item) => item._id === product._id);
    let updated;

    if (exists) {
      updated = wishlistItems.filter((item) => item._id !== product._id);
    } else {
      updated = [...wishlistItems, product];
    }

    set({ wishlistItems: updated });
    localStorage.setItem('team9_wishlist', JSON.stringify(updated));
  },

  isInWishlist: (id) => {
    return get().wishlistItems.some((item) => item._id === id);
  },

  clearWishlist: () => {
    set({ wishlistItems: [] });
    localStorage.removeItem('team9_wishlist');
  },
}));

export default useWishlistStore;
