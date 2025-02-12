import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL,categoryTage,orderTage,productTage,userTage } from '../constance'

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include'
})

const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery,
  tagTypes: [userTage, orderTage, categoryTage, productTage],
  endpoints:()=>({})
})

export default apiSlice;


