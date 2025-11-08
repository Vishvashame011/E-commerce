import { createSlice } from '@reduxjs/toolkit';

const loadOrdersFromStorage = () => {
  try {
    const serializedOrders = localStorage.getItem('orders');
    if (serializedOrders === null) {
      return [];
    }
    return JSON.parse(serializedOrders);
  } catch (err) {
    return [];
  }
};

const saveOrdersToStorage = (orders) => {
  try {
    const serializedOrders = JSON.stringify(orders);
    localStorage.setItem('orders', serializedOrders);
  } catch (err) {
    console.error('Could not save orders to localStorage:', err);
  }
};

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: loadOrdersFromStorage(),
  },
  reducers: {
    placeOrder: (state, action) => {
      const { items, total, address, promoCode, discount } = action.payload;
      const newOrder = {
        id: Date.now().toString(),
        items,
        total,
        address,
        promoCode,
        discount,
        status: 'Pending',
        orderDate: new Date().toISOString(),
        deliveryDate: null,
      };
      
      state.orders.unshift(newOrder);
      saveOrdersToStorage(state.orders);
      
      // Auto-update to delivered after 6 hours (for demo, we'll use 30 seconds)
      setTimeout(() => {
        // This is a simplified demo - in a real app, this would be handled by the backend
        console.log(`Order ${newOrder.id} should be marked as delivered`);
      }, 30000); // 30 seconds for demo (change to 6 * 60 * 60 * 1000 for 6 hours)
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order.id === orderId);
      if (order) {
        order.status = status;
        if (status === 'Delivered') {
          order.deliveryDate = new Date().toISOString();
        }
        saveOrdersToStorage(state.orders);
      }
    },
  },
});

export const { placeOrder, updateOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;