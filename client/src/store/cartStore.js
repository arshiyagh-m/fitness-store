// filepath: client/src/store/cartStore.js
import { create } from 'zustand';

// خواندن سبد قبلی از لوکال استوریج (اگر کاربر قبلا چیزی به سبد اضافه کرده باشد)
const cartFromStorage = localStorage.getItem('cart') 
  ? JSON.parse(localStorage.getItem('cart')) 
  : [];

const useCartStore = create((set, get) => ({
  cartItems: cartFromStorage,

  // افزودن کالا به سبد
  addToCart: (product, variant, qty = 1) => {
    const { cartItems } = get();
    // بررسی اینکه آیا این محصول با همین متغیر دقیقاً در سبد هست یا نه
    const existItem = cartItems.find((x) => x.variant.sku === variant.sku);

    let newCartItems;
    if (existItem) {
      // اگر بود، فقط تعدادش رو زیاد کن
      newCartItems = cartItems.map((x) =>
        x.variant.sku === existItem.variant.sku ? { ...x, qty: x.qty + qty } : x
      );
    } else {
      // اگر نبود، محصول جدید با مشخصات متغیرش اضافه کن
      newCartItems = [...cartItems, { product, variant, qty }];
    }

    set({ cartItems: newCartItems });
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  },

  // کم کردن یا حذف کالا
  removeFromCart: (sku) => {
    const { cartItems } = get();
    const existItem = cartItems.find((x) => x.variant.sku === sku);
    let newCartItems;

    if (existItem.qty === 1) {
      newCartItems = cartItems.filter((x) => x.variant.sku !== sku);
    } else {
      newCartItems = cartItems.map((x) =>
        x.variant.sku === sku ? { ...x, qty: x.qty - 1 } : x
      );
    }

    set({ cartItems: newCartItems });
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  },

  // حذف کامل یک آیتم (مهم نیست تعدادش چقدره)
  deleteItem: (sku) => {
    const newCartItems = get().cartItems.filter((x) => x.variant.sku !== sku);
    set({ cartItems: newCartItems });
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  },

  // خالی کردن کل سبد
  clearCart: () => {
    set({ cartItems: [] });
    localStorage.removeItem('cart');
  },

  // توابع کمکی برای محاسبات
  cartTotalItems: () => get().cartItems.reduce((acc, item) => acc + item.qty, 0),
  cartTotalPrice: () => get().cartItems.reduce((acc, item) => acc + (item.variant.discountPrice || item.variant.price) * item.qty, 0),
  cartTotalOriginalPrice: () => get().cartItems.reduce((acc, item) => acc + (item.variant.price * item.qty), 0),
}));

export default useCartStore;
