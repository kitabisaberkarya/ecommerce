import { apiSlice } from './apiSlice';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../mock/data';

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

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  sort_by?: string;
}

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    listProducts: builder.query<PaginatedResponse<Product>, ListProductsParams>({
      queryFn: (params) => {
        const { page = 1, limit = 20, search = '', category_id = '', sort_by = 'newest' } = params;

        let result = MOCK_PRODUCTS.filter(p => p.status === 'active');

        if (category_id) {
          result = result.filter(p => p.category_id === category_id);
        }

        if (search.trim()) {
          const q = search.toLowerCase();
          result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            (p.category?.name ?? '').toLowerCase().includes(q)
          );
        }

        switch (sort_by) {
          case 'price_asc':
            result = [...result].sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
            break;
          case 'price_desc':
            result = [...result].sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
            break;
          case 'popular':
            result = [...result].sort((a, b) => b.reviews - a.reviews);
            break;
          case 'rating':
            result = [...result].sort((a, b) => b.rating - a.rating);
            break;
          default:
            break;
        }

        const pageNum = Math.max(1, page);
        const limitNum = Math.min(50, Math.max(1, limit));
        const total = result.length;
        const total_pages = Math.max(1, Math.ceil(total / limitNum));
        const offset = (pageNum - 1) * limitNum;
        const data = result.slice(offset, offset + limitNum);

        return {
          data: {
            success: true,
            data,
            meta: { page: pageNum, limit: limitNum, total, total_pages, has_next: pageNum < total_pages, has_prev: pageNum > 1 },
          },
        };
      },
      providesTags: ['Product'],
    }),

    getProduct: builder.query<{ success: boolean; data: Product }, string>({
      queryFn: (idOrSlug) => {
        const product = MOCK_PRODUCTS.find(p => p.id === idOrSlug || p.slug === idOrSlug);
        if (!product) return { error: { status: 404, data: { message: 'Produk tidak ditemukan' } } };
        return { data: { success: true, data: product } };
      },
      providesTags: (_result, _err, id) => [{ type: 'Product', id }],
    }),

    listCategories: builder.query<{ success: boolean; data: Category[] }, void>({
      queryFn: () => ({ data: { success: true, data: MOCK_CATEGORIES } }),
      providesTags: ['Category'],
    }),

  }),
});

export const { useListProductsQuery, useGetProductQuery, useListCategoriesQuery } = productApi;
