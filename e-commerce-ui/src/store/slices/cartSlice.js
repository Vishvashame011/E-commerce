import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem('cart');
    if (serializedCart === null) {
      return { items: [], total: 0, itemCount: 0, promoCode: '', discount: 0 };
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return { items: [], total: 0, itemCount: 0, promoCode: '', discount: 0 };
  }
};

const saveCartToStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem('cart', serializedCart);
  } catch (err) {
    console.error('Could not save cart to localStorage:', err);
  }
};

const calculateTotals = (items, discount = 0) => {
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const total = subtotal - discount;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  return { subtotal, total: Math.max(0, total), itemCount };
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: loadCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      
      const totals = calculateTotals(state.items, state.discount);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      saveCartToStorage(state);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      
      const totals = calculateTotals(state.items, state.discount);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      saveCartToStorage(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item && quantity > 0) {
        item.quantity = quantity;
      }
      
      const totals = calculateTotals(state.items, state.discount);
      state.total = totals.total;
      state.itemCount = totals.itemCount;
      saveCartToStorage(state);
    },
    applyPromoCode: (state, action) => {
      const promoCode = action.payload;
      state.promoCode = promoCode;
      
      // Calculate discount based on promo code
      let discountPercentage = 0;
      if (promoCode === 'SAVE10') {
        discountPercentage = 10;
      } else if (promoCode === 'SAVE20') {
        discountPercentage = 20;
      } else if (promoCode === 'WELCOME15') {
        discountPercentage = 15;
      }
      
      const subtotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      const discount = subtotal * (discountPercentage / 100);
      
      state.discount = discount;
      state.total = subtotal - discount;
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.promoCode = '';
      state.discount = 0;
      saveCartToStorage(state);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, applyPromoCode, clearCart } = cartSlice.actions;
export default cartSlice.reducer;