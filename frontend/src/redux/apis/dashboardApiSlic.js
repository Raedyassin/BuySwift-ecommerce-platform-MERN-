import apiSlice from '../services/apiSlice'

import { DASHBOARD_URL } from '../constance';
const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (buil) => ({
    getDashboardInfo: buil.query({
      query: () => ({
        url: `${DASHBOARD_URL}/`,
        method: "GET",
      }),
    }),
  })
})

export const {
  useGetDashboardInfoQuery
} = orderApiSlice;