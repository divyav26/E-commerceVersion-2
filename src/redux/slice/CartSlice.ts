import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Coupon {
  name: string;
  code: string;
  discount: number; // Percentage discount
  minPurchasesAmount: number;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  img: string;
  quantity: number;
  discountedPrice: number;
  costPrice: number;
}

interface CartState {
  items: CartItem[];
  subprice: number;
  totalQuantity: number;
  totalPrice: number;
  appliedCoupon: Coupon | null; // New field for coupon
}

const initialState: CartState = {
  items: [],
  subprice: 0,
  totalQuantity: 0,
  totalPrice: 0,
  appliedCoupon: null, // New field for coupon
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      state.totalQuantity += 1;
      state.subprice += item.price;
      state.totalPrice += item.discountedPrice;

      // Recalculate total with applied coupon (if any)
      if (state.appliedCoupon && state.subprice >= state.appliedCoupon.minPurchasesAmount) {
        const discount = (state.subprice * state.appliedCoupon.discount) / 100;
        state.totalPrice = state.subprice - discount;
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const itemIndex = state.items.findIndex((i) => i.id === itemId);

      if (itemIndex !== -1) {
        const item = state.items[itemIndex];
        state.totalQuantity -= item.quantity;
        state.subprice -= item.price * item.quantity;
        state.totalPrice -= item.discountedPrice * item.quantity;
        state.items.splice(itemIndex, 1);
      }

      // Recalculate total with applied coupon (if any)
      if (state.appliedCoupon && state.subprice >= state.appliedCoupon.minPurchasesAmount) {
        const discount = (state.subprice * state.appliedCoupon.discount) / 100;
        state.totalPrice = state.subprice - discount;
      }
    },
    increment: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (item) {
        item.quantity += 1;
        state.totalQuantity += 1;
        state.subprice += item.price;
        state.totalPrice += item.discountedPrice;

        // Recalculate total with applied coupon (if any)
        if (state.appliedCoupon && state.subprice >= state.appliedCoupon.minPurchasesAmount) {
          const discount = (state.subprice * state.appliedCoupon.discount) / 100;
          state.totalPrice = state.subprice - discount;
        }
      }
    },
    decrement: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find((i) => i.id === itemId);

      if (item && item.quantity > 1) {
        item.quantity -= 1;
        state.totalQuantity -= 1;
        state.subprice -= item.price;
        state.totalPrice -= item.discountedPrice;
      } else if (item) {
        state.items = state.items.filter((i) => i.id !== itemId);
        state.totalQuantity -= 1;
        state.subprice -= item.price;
        state.totalPrice -= item.discountedPrice;
      }

      // Recalculate total with applied coupon (if any)
      if (state.appliedCoupon && state.subprice >= state.appliedCoupon.minPurchasesAmount) {
        const discount = (state.subprice * state.appliedCoupon.discount) / 100;
        state.totalPrice = state.subprice - discount;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.subprice = 0;
      state.totalPrice = 0;
      state.appliedCoupon = null; // Clear coupon when the cart is cleared
    },
    applyCoupon: (state, action: PayloadAction<Coupon>) => {
      const coupon = action.payload;

      if (state.subprice >= coupon.minPurchasesAmount) {
        state.appliedCoupon = coupon;
        const discount = (state.subprice * coupon.discount) / 100;
        state.totalPrice = state.subprice - discount;
      } else {
        // If coupon doesn't meet the minimum purchase amount
        state.appliedCoupon = null;
      }
    },
  },
});

export const { addToCart, removeFromCart, increment, decrement, clearCart, applyCoupon } = cartSlice.actions;
export default cartSlice.reducer;
