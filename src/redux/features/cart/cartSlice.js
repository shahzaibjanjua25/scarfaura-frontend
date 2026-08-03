import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  selectedItems: 0,
  totalPrice: 0,
  deliveryCharge: 200, // 💰 fixed delivery charge
  grandTotal: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExist = state.products.find(
        (product) => product._id === action.payload._id
      );
      if (!isExist) {
        state.products.push({ ...action.payload, quantity: 1 });
      }
      updateCartSummary(state);
    },
    updateQuantity: (state, action) => {
      state.products = state.products.map((product) => {
        if (product._id === action.payload.id) {
          if (action.payload.type === "increment") {
            product.quantity += 1;
          } else if (action.payload.type === "decrement" && product.quantity > 1) {
            product.quantity -= 1;
          }
        }
        return product;
      });
      updateCartSummary(state);
    },
    removeFromCart: (state, action) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload.id
      );
      updateCartSummary(state);
    },
    clearCart: (state) => {
      state.products = [];
      state.selectedItems = 0;
      state.totalPrice = 0;
      state.grandTotal = 0;
    },
  },
});

// 🔁 Shared logic to calculate cart summary
const updateCartSummary = (state) => {
  state.selectedItems = selectSelectedItems(state);
  state.totalPrice = selectTotalPrice(state);
  state.grandTotal = selectGrandTotal(state);
};

// ✅ Selectors
export const selectSelectedItems = (state) =>
  state.products.reduce((total, product) => total + product.quantity, 0);

export const selectTotalPrice = (state) =>
  state.products.reduce((total, product) => total + product.quantity * product.price, 0);

export const selectGrandTotal = (state) =>
  selectTotalPrice(state) + state.deliveryCharge;

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
