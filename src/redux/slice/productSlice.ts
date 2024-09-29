// redux/slice/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Product {
    id: string;
    name: string;
    description: string;
    quantity: number;
    category: string;
    brand: string;
    price: number;
    discountedPrice: number;
    costPrice: number;
    img: string;
}

interface ProductState {
  products: Product[];
  filteredProducts: Product[];
  searchText: string;
  selectedCategory: string;
}

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  searchText: '',
  selectedCategory: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
      state.filteredProducts = action.payload; // Initially, all products are filtered
    },
    filterByCategory: (state, action: PayloadAction<string>) => {
        state.selectedCategory = action.payload;
        if (action.payload === "all") {
          state.filteredProducts = state.products; // Show all products when "all" is selected
        } else {
          state.filteredProducts = state.products.filter(product =>
            product.category.toLowerCase() === action.payload.toLowerCase() // Use strict equality
          );
        }
      },
      
      
    searchProducts: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
      state.filteredProducts = state.products.filter(product =>
        product.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    clearFilters: (state) => {
      state.filteredProducts = state.products; // Reset to all products
      state.searchText = '';
      state.selectedCategory = '';
    },
  },
});

export const { setProducts, filterByCategory, searchProducts, clearFilters } = productSlice.actions;
export default productSlice.reducer;
