import { create } from 'zustand';

const cartFromStorage = localStorage.getItem('team9_cart') 
  ? JSON.parse(localStorage.getItem('team9_cart')) 
  : [];

const couponFromStorage = localStorage.getItem('team9_coupon')
  ? JSON.parse(localStorage.getItem('team9_coupon'))
  : null;

const useCartStore = create((set, get) => ({
  cartItems: cartFromStorage,
  appliedCoupon: couponFromStorage,

  addToCart: (product, variant, qty = 1) => {
    const { cartItems } = get();
    const existItem = cartItems.find((x) => x.variant.sku === variant.sku);
    let newCartItems;
    if (existItem) {
      newCartItems = cartItems.map((x) =>
        x.variant.sku === existItem.variant.sku ? { ...x, qty: x.qty + qty } : x
      );
    } else {
      newCartItems = [...cartItems, { product, variant, qty }];
    }
    set({ cartItems: newCartItems });
    localStorage.setItem('team9_cart', JSON.stringify(newCartItems));
  },

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
    localStorage.setItem('team9_cart', JSON.stringify(newCartItems));
  },

  deleteItem: (sku) => {
    const newCartItems = get().cartItems.filter((x) => x.variant.sku !== sku);
    set({ cartItems: newCartItems });
    localStorage.setItem('team9_cart', JSON.stringify(newCartItems));
  },

  clearCart: () => {
    set({ cartItems: [], appliedCoupon: null });
    localStorage.removeItem('team9_cart');
    localStorage.removeItem('team9_coupon');
  },

  // متدهای کوپن
  setCoupon: (coupon) => {
    set({ appliedCoupon: coupon });
    localStorage.setItem('team9_coupon', JSON.stringify(coupon));
  },
  removeCoupon: () => {
    set({ appliedCoupon: null });
    localStorage.removeItem('team9_coupon');
  },

  // محاسبات مالی
  cartTotalItems: () => get().cartItems.reduce((acc, item) => acc + item.qty, 0),
  cartTotalPrice: () => get().cartItems.reduce((acc, item) => acc + (item.variant.discountPrice || item.variant.price) * item.qty, 0),
  cartDiscountAmount: () => {
    const base = get().cartTotalPrice();
    const coupon = get().appliedCoupon;
    if (!coupon) return 0;
    let disc = (base * coupon.discountPercent) / 100;
    return disc > coupon.maxDiscount ? coupon.maxDiscount : disc;
  },
  cartFinalPrice: () => {
    return get().cartTotalPrice() - get().cartDiscountAmount();
  }
}));

export default useCartStore;
