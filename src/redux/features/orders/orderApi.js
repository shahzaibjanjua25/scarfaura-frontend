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
    // Get orders by email
    getOrdersByEmail: builder.query({
      query: (email) => ({
        url: `/${email}`,
        method: 'GET',
      }),
      // ✅ FIX: Transform response to ensure it's always an array
      transformResponse: (response) => {
        console.log('📦 getOrdersByEmail response:', response);
        if (Array.isArray(response)) return response;
        if (response?.orders && Array.isArray(response.orders)) return response.orders;
        if (response?.data && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: ['Order'],
    }),

    // Get order by ID
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: 'GET',
      }),
      transformResponse: (response) => {
        if (response && typeof response === 'object') return response;
        return null;
      },
      providesTags: ['Order'],
    }),

    // Get all orders (admin)
    getAllOrders: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
      transformResponse: (response) => {
        console.log('📦 getAllOrders response:', response);
        if (Array.isArray(response)) return response;
        if (response?.orders && Array.isArray(response.orders)) return response.orders;
        if (response?.data && Array.isArray(response.data)) return response.data;
        return [];
      },
      providesTags: ['Order'],
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/update-order-status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),

    // Delete order
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/delete-order/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),
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