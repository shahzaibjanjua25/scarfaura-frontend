// redux/features/orders/orderApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getBaseUrl } from '../../../utils/baseURL';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    // Fetch orders by email
    getOrdersByEmail: builder.query({
      query: (email) => ({
        url: `/${email}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    
    // Fetch order by ID
    getOrderById: builder.query({
      query: (orderId) => ({
        url: `/order/${orderId}`,
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),

    // Fetch all orders (admin)
    getAllOrders: builder.query({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
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