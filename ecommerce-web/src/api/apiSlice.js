import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: '' }); // Base URL will be set later via environment variables

export const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: [], // Define tag types for caching
  endpoints: (builder) => ({}),
});
