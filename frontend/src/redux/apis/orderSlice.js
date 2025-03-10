import apiSlice from '../services/apiSlice'

import { ORDER_URL, orderTage, PAYPAL_URL } from '../constance';
const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (buil) => ({
    createOrder: buil.mutation({
      query: (body) => ({
        url: ORDER_URL,
        method: "POST",
        body
      }),
      invalidatesTags:[orderTage]
    }),
    getAllOrders: buil.query({
      query: () => ({
        url: ORDER_URL,
      }),
      providesTags: [orderTage]
    }),
    getOrderDetails: buil.query({
      query: (id) => ({
        url:`${ORDER_URL}/${id}`
      }),
      keepUnusedDataFor: 5
    }),
    markOrderAsPaid: buil.mutation({
      query: ({id,body}) => ({
        url: `${ORDER_URL}/${id}/pay`,
        method: "PATCH",
        body
      }),
      invalidatesTags:[orderTage]
    }),
    markorderDeliver: buil.mutation ({
      query: ({ id, body }) => ({
        url: `${ORDER_URL}/${id}/deliver`,
        method: "PATCH",
        body
      }),
      invalidatesTags: [orderTage]
    }),
    getUserOrders: buil.query({
      query: () => ({
        url: `${ORDER_URL}/myorders`,
      }),
      providesTags:[orderTage]
    }),
    getPayPalClientId: buil.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5
    }),



  })
})

export const {
  useCreateOrderMutation,
  useMarkOrderAsPaidMutation,
  useMarkorderDeliverMutation,
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useGetUserOrdersQuery,
  useGetPayPalClientIdQuery
} = orderApiSlice;