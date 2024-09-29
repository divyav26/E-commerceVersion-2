import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface WishlistItem {
  id: string;
  name: string;
  price: number;
  img: string;
  discountedPrice: number;
  costPrice: number;
}

interface WishlistState {
  items: WishlistItem[];
  countwishlist: number;

}

const initialState: WishlistState = {
  items: [],
  countwishlist: 0,

};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      
      if (!existingItem) {
        state.items.push(item);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter((i) => i.id !== itemId);
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    setWishlistCount: (state, action: PayloadAction<number>) => {   
      state.countwishlist = action.payload;
    }
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, setWishlistCount } = wishlistSlice.actions;
export default wishlistSlice.reducer;
