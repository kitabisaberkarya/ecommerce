import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartVariant {
  id: string;
  name: string;
  price: number;
  compare_price: number;
  stock: number;
  images: string[];
}

export interface CartProduct {
  id: string;
  name: string;
  images: string[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  product?: CartProduct;
  variant?: CartVariant;
}

export interface Cart {
  id: string;
  user_id?: string;
  session_id: string;
  items: CartItem[];
}

interface CartState {
  cart: Cart | null;
  itemCount: number;
}

const initialState: CartState = {
  cart: null,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<Cart>) {
      state.cart = action.payload;
      state.itemCount = action.payload.items?.length ?? 0;
    },
    clearCartState(state) {
      state.cart = null;
      state.itemCount = 0;
    },
  },
});

export const { setCart, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
