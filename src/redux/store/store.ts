import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../slice/CartSlice";
import whishlistReducer from "../slice/whishlistSlice";
import productSlice from "../slice/productSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    whishlist:whishlistReducer,
    product: productSlice,
  },
});