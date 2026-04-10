import { apiSlice } from './apiSlice';

export interface ProductVariant {
  id: string;
  sku: string;
  name: string;
  price: number;
  compare_price: number;
  stock: number;
  images: string[];
  attributes: Record<string, string>;
  is_active: boolean;
}

export interface Product {
  id: string;
  seller_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  status: string;
  weight: number;
  condition: string;
  min_purchase: number;
  max_purchase: number;
  rating: number;
  reviews: number;
  variants: ProductVariant[];
  category?: { id: string; name: string; slug: string };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface Category {
  id: string;
  parent_id?: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  children?: Category[];
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    listProducts: builder.query<PaginatedResponse<Product>, { page?: number; limit?: number; search?: string; category_id?: string; sort_by?: string }>({
      query: (params) => ({
        url: '/products',
        params: { page: 1, limit: 20, ...params },
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query<{ success: boolean; data: Product }, string>({
      query: (idOrSlug) => `/products/${idOrSlug}`,
      providesTags: (_result, _err, id) => [{ type: 'Product', id }],
    }),
    listCategories: builder.query<{ success: boolean; data: Category[] }, void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),
  }),
});

export const { useListProductsQuery, useGetProductQuery, useListCategoriesQuery } = productApi;
