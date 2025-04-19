import apiSlice from '../services/apiSlice'
import { PAYMENT_URL } from '../constance'

const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClientIdPayPal: builder.query({
      query: () => `${PAYMENT_URL}/paypal/config`,
      keepUnusedDataFor: Infinity,
    }),

    intializePaypalPayment: builder.mutation({
      query: (order) => ({
        url: `${PAYMENT_URL}/paypal`,
        method: "POST",
        body: {order}
      })
    }),
    paypalPaymentCapture: builder.mutation({
      query: ({ paypalOrderId }) => ({
        url: `${PAYMENT_URL}/paypal/capture`,
        method: "POST",
        body: { paypalOrderId }
      })
    })
  })
})

export const {
  useIntializePaypalPaymentMutation,
  useGetClientIdPayPalQuery,
  usePaypalPaymentCaptureMutation
} = paymentApi

