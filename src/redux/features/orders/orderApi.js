// redux/features/orders/orderApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: 'include',
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    // ✅ Ensure getAllOrders always returns an array
    getAllOrders: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
      // ✅ Transform response to ensure it's always an array
      transformResponse: (response) => {
        // If response is an array, return it
        if (Array.isArray(response)) {
          return response;
        }
        // If response is an object with orders property
        if (response && typeof response === 'object' && Array.isArray(response.orders)) {
          return response.orders;
        }
        // If response is an object with data property
        if (response && typeof response === 'object' && Array.isArray(response.data)) {
          return response.data;
        }
        // Default: return empty array
        return [];
      },
      providesTags: ['Order'],
    }),
    // ... other endpoints
  }),
});

export const {
  useGetOrdersByEmailQuery,
  useGetOrderByIdQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;

export default orderApi;