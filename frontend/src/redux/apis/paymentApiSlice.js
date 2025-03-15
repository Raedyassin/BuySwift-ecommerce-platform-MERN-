import apiSlice from '../services/apiSlice'
import { PAYMENT_URL } from '../constance'

const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    paypalPayment: builder.mutation({
      query: (id) => ({
        url: `${PAYMENT_URL}/paypal/${id}`,
        method: "POST",
      })
    }),
    getClientIdPayPal: builder.query({
      query: () => `${PAYMENT_URL}/paypal/config`,
      keepUnusedDataFor: Infinity,
    }),
    paypalPaymentCapture: builder.mutation({
      query: ({ id, paypalOrderId }) => ({
        url: `${PAYMENT_URL}/paypal/${id}/capture`,
        method: "POST",
        body: {paypalOrderId}
      })
    })

  })
})

export const {
  usePaypalPaymentMutation,
  useGetClientIdPayPalQuery,
  usePaypalPaymentCaptureMutation
} = paymentApi

