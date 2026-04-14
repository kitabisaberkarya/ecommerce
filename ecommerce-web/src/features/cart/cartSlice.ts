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
  slug: string;
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

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem('shopkita_cart');
    if (raw) {
      const parsed = JSON.parse(raw) as CartState;
      return parsed;
    }
  } catch { /* ignore */ }
  return { cart: null, itemCount: 0 };
}

function saveCart(state: CartState) {
  try {
    localStorage.setItem('shopkita_cart', JSON.stringify(state));
  } catch { /* ignore */ }
}

function mkCart(): Cart {
  return { id: 'cart-local', session_id: 'local-' + Date.now(), items: [] };
}

const initialState: CartState = loadCart();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // sync from API response (legacy)
    setCart(state, action: PayloadAction<Cart>) {
      state.cart = action.payload;
      state.itemCount = action.payload.items?.length ?? 0;
      saveCart({ cart: state.cart, itemCount: state.itemCount });
    },

    // add item client-side
    addItem(state, action: PayloadAction<{ product: CartProduct; variant: CartVariant; quantity: number }>) {
      const { product, variant, quantity } = action.payload;
      if (!state.cart) state.cart = mkCart();

      const existing = state.cart.items.find(i => i.variant_id === variant.id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, variant.stock);
      } else {
        state.cart.items.push({
          id: 'ci-' + Date.now().toString(36),
          cart_id: state.cart.id,
          product_id: product.id,
          variant_id: variant.id,
          quantity: Math.min(quantity, variant.stock),
          product,
          variant,
        });
      }
      state.itemCount = state.cart.items.length;
      saveCart({ cart: state.cart, itemCount: state.itemCount });
    },

    // update quantity client-side
    updateItemQuantity(state, action: PayloadAction<{ itemId: string; quantity: number }>) {
      const { itemId, quantity } = action.payload;
      const item = state.cart?.items.find(i => i.id === itemId);
      if (!item) return;
      if (quantity <= 0) {
        state.cart!.items = state.cart!.items.filter(i => i.id !== itemId);
      } else {
        item.quantity = Math.min(quantity, item.variant?.stock ?? 999);
      }
      state.itemCount = state.cart?.items.length ?? 0;
      saveCart({ cart: state.cart, itemCount: state.itemCount });
    },

    // remove item client-side
    removeItem(state, action: PayloadAction<string>) {
      if (!state.cart) return;
      state.cart.items = state.cart.items.filter(i => i.id !== action.payload);
      state.itemCount = state.cart.items.length;
      saveCart({ cart: state.cart, itemCount: state.itemCount });
    },

    clearCartState(state) {
      state.cart = null;
      state.itemCount = 0;
      try { localStorage.removeItem('shopkita_cart'); } catch { /* ignore */ }
    },
  },
});

export const { setCart, addItem, updateItemQuantity, removeItem, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
