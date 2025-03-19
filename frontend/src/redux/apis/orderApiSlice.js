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
      invalidatesTags:[orderTage]
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

    // admin action get all orders
    // getAllOrders: buil.query({
    //   query: ({page,limit}) => ({
    //     url: `${ORDER_URL}/?page=${page}&limit=${limit}`,
    //     method: "GET"
    //   }),
    //   providesTags: [orderTage],
    //   serializeQueryArgs: ({ endpointName }) => endpointName, 
    //   merge: (currentCache, newData) => {        
    //     return {
    //       ...currentCache,
    //       data: { orders: [...(currentCache.data.orders || []), ...newData.data.orders] },
    //       currentPage: newData.currentPage,
    //       pageSize: newData.pageSize,
    //       hasNextPage: newData.hasNextPage,
    //       hasPrevPage: newData.hasPrevPage
    //     }
    //   },
    //   forceRefetch({ currentArg, previousArg }) {
    //     return currentArg.page !== previousArg?.page;
    //   },
    // }),

    //
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
      query: ({ page, limit}) => ({
        url: `${ORDER_URL}/myorders?page=${page}&limit=${limit}`,
      }),
      providesTags: [orderTage],
      keepUnusedDataFor: 5,
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newData) => {
        return {
          ...currentCache,
          data: { orders: [ ...currentCache.data.orders, ...newData.data.orders ] },
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
  })
})

export const {
  useCreateOrderMutation,
  useMarkOrderAsPaidMutation,
  useMarkorderDeliverMutation,
    // useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useGetUserOrdersQuery,
  useGetAllOrdersByAdminQuery
} = orderApiSlice;