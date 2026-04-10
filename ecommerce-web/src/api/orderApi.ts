import { apiSlice } from './apiSlice';

export interface OrderItem {
  id: string;
  product_id: string;
  variant_id: string;
  product_name: string;
  variant_name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  image_url: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  total: number;
  payment_method: string;
  items: OrderItem[];
  created_at: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<ApiResponse<Order>, {
      address_id: string;
      payment_method: string;
      voucher_code?: string;
      notes?: string;
      shipping_cost: number;
    }>({
      query: (body) => ({ url: '/orders', method: 'POST', body }),
      invalidatesTags: ['Order', 'Cart'],
    }),
    listMyOrders: builder.query<{ success: boolean; data: Order[]; meta: object }, { status?: string; page?: number }>({
      query: (params) => ({ url: '/orders', params }),
      providesTags: ['Order'],
    }),
    getOrder: builder.query<ApiResponse<Order>, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Order', id }],
    }),
    cancelOrder: builder.mutation<ApiResponse<void>, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/orders/${id}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useListMyOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
} = orderApi;
