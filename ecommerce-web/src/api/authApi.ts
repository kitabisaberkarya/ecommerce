import { apiSlice } from './apiSlice';
import type { AuthUser } from '../features/auth/authSlice';

interface TokenPair {
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
  user: AuthUser;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<TokenPair>, { full_name: string; email: string; password: string; phone?: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: builder.mutation<ApiResponse<TokenPair>, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    logout: builder.mutation<void, { refresh_token: string }>({
      query: (body) => ({ url: '/auth/logout', method: 'POST', body }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi;
