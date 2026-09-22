import { create } from 'zustand';

const cartFromStorage = localStorage.getItem('cart') 
  ? JSON.parse(localStorage.getItem('cart')) 
  : [];

const useCartStore = create((set, get) => ({
  cartItems: cartFromStorage,

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
    localStorage.setItem('cart', JSON.stringify(newCartItems));
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
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  },

  deleteItem: (sku) => {
    const newCartItems = get().cartItems.filter((x) => x.variant.sku !== sku);
    set({ cartItems: newCartItems });
    localStorage.setItem('cart', JSON.stringify(newCartItems));
  },

  clearCart: () => {
    set({ cartItems: [] });
    localStorage.removeItem('cart');
  },

  cartTotalItems: () => get().cartItems.reduce((acc, item) => acc + item.qty, 0),
  cartTotalPrice: () => get().cartItems.reduce((acc, item) => acc + (item.variant.discountPrice || item.variant.price) * item.qty, 0),
  cartTotalOriginalPrice: () => get().cartItems.reduce((acc, item) => acc + (item.variant.price * item.qty), 0),
}));

export default useCartStore;
