import apiSlice from '../services/apiSlice'

import { ORDER_URL, orderTage } from '../constance';
const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (buil) => ({
    createOrder: buil.mutation({
      query: (body) => ({
        url: `${ORDER_URL}/`,
        method: "POST",
        body
      }),
      invalidatesTags: [orderTage]
    }),

    // test
    getAllOrdersByAdmin: buil.query({
      query: ({ page, limit, status, createdAt, price, payment }) => ({
        url: `${ORDER_URL}?page=${page}&limit=${limit}&status=${status}&createdAt=${createdAt}&price=${price}&payment=${payment}`,
        method: "GET"
      }),
      providesTags: [orderTage],
      keepUnusedDataFor: 60,
      // we don't cache the data because the user can chose eache page he want
      // serializeQueryArgs: ({ endpointName }) => endpointName, 
      // merge: (currentCache, newData) => {
      //   return {
      //     ...currentCache,
      //     data: { orders: [...currentCache.data.orders , ...newData.data.orders] },
      //     currentPage: newData.currentPage,
      //     pageSize: newData.pageSize,
      //     hasNextPage: newData.hasNextPage,
      //     hasPrevPage: newData.hasPrevPage
      //   }
      // },
      // forceRefetch({ currentArg, previousArg }) {
      //   return currentArg.page !== previousArg?.page;
      // },
    }),

    getUserOrders: buil.query({
      query: ({ page, limit }) => ({
        url: `${ORDER_URL}/myorders?page=${page}&limit=${limit}`,
      }),
      providesTags: [orderTage],
      keepUnusedDataFor: 5,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newData) => {
        return {
          ...currentCache,
          data: { orders: [...currentCache.data.orders, ...newData.data.orders] },
          currentPage: newData.currentPage,
          pageSize: newData.pageSize,
          hasNextPage: newData.hasNextPage,
          hasPrevPage: newData.hasPrevPage
        };
      },
      forceRefetch({ currentArg, previousArg }) {
        return currentArg.page !== previousArg?.page;
      },
    }),

    getOrderDetails: buil.query({
      query: (id) => ({
        url: `${ORDER_URL}/${id}`
      }),
      keepUnusedDataFor: 5
    }),



    // Orders Admin Actions
    markOrderAsPaid: buil.mutation({
      query: ({ id, ...body }) => ({
        url: `${ORDER_URL}/${id}/pay`,
        method: "PATCH",
        body
      }),
      invalidatesTags: [orderTage]
    }),

    markOrderPacked: buil.mutation({
      query: ({ id, ...body }) => ({
        url: `${ORDER_URL}/${id}/packed`,
        method: "PATCH",
        body
      }),
      invalidatesTags: [orderTage]
    }),

    markOrderTransited: buil.mutation({
      query: ({ id, ...body }) => ({
        url: `${ORDER_URL}/${id}/transited`,
        method: "PATCH",
        body
      }),
      invalidatesTags: [orderTage]
    }),

    markOrderCancel: buil.mutation({
      query: ({ id, ...body }) => ({
        url: `${ORDER_URL}/${id}/cancel`,
        method: "PATCH",
        body
      }),
      invalidatesTags: [orderTage]
    }),

    markOrderDeliver: buil.mutation({
      query: ({ id, ...body }) => ({
        url: `${ORDER_URL}/${id}/delivered`,
        method: "PATCH",
        body
      }),
      invalidatesTags: [orderTage]
    }),
  })
})

export const {
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetAllOrdersByAdminQuery,
  useGetOrderDetailsQuery,

  // Orders Admin Actions
  useMarkOrderAsPaidMutation,
  useMarkOrderPackedMutation,
  useMarkOrderTransitedMutation,
  useMarkOrderDeliverMutation,
  useMarkOrderCancelMutation
} = orderApiSlice;