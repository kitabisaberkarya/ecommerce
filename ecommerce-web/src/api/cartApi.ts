import { apiSlice } from './apiSlice';
import type { Cart } from '../features/cart/cartSlice';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<Cart>, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<ApiResponse<Cart>, { product_id: string; variant_id: string; quantity: number }>({
      query: (body) => ({ url: '/cart/items', method: 'POST', body }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<ApiResponse<Cart>, { item_id: string; quantity: number }>({
      query: ({ item_id, quantity }) => ({
        url: `/cart/items/${item_id}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation<ApiResponse<Cart>, string>({
      query: (item_id) => ({ url: `/cart/items/${item_id}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<void, void>({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} = cartApi;
