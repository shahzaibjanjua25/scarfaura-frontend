import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/products`,
    credentials: "include",
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: ({ category, color, age, minPrice, maxPrice, page = 1, limit = 10 }) => {
        const queryParams = new URLSearchParams({
          category: category || '',
          color: color || '',
          minPrice: minPrice || 0,
          maxPrice: maxPrice || '',
          age: age || '',
          page: page.toString(),
          limit: limit.toString()
        }).toString();

        return `/?${queryParams}`;
      },
      providesTags: ["Products"],
    }),

    // ✅ NEW: Fetch sorted products (e.g. for trending by rating)
    getSortedProducts: builder.query({
      query: ({ sortBy = "rating", order = "desc", limit = 8 }) =>
        `/?sortBy=${sortBy}&order=${order}&limit=${limit}`,
      providesTags: ["Products"],
    }),

    fetchProductById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),

    AddProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/create-product",
        method: "POST",
        body: newProduct,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    fetchRelatedBlogs: builder.query({
      query: (id) => `blogs/related/${id}`,
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `update-product/${id}`,
        method: "PATCH",
        body: rest,
        credentials: "include",
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Products", id }],
    }),
  }),
});

// ✅ Export new hook here
export const {
  useFetchAllProductsQuery,
  useFetchProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useFetchRelatedBlogsQuery,
  useGetSortedProductsQuery, // ✅ this is the new export
} = productsApi;

export default productsApi;
