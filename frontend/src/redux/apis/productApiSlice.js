import apiSlice from '../services/apiSlice'
import { PRODUCT_URL, UPLOAD_URL, productTage } from '../constance'
const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (buil) => ({
    // ??????????????????????????
    getProducts: buil.query({
      query: ({ keyword }) => ({
        url: PRODUCT_URL,
        params:{keyword}
      }),
      keepUnusedDataFor: 5,
      providesTags:[productTage]
    }),

    // ??????????????????????????
    allProducts: buil.query({
      query: () => ({
        url: `${PRODUCT_URL}/allproducts`,
      }),
    }),

    // ??????????????????????????
    getProductDetails: buil.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
      }),
      keepUnusedDataFor:5
    }),

    // ??????????????????????????
    getProductById: buil.query({
      query: ( id ) => ({
        url: `${PRODUCT_URL}/${id}`,
      }),
      providesTags: (res, err, id) => [{ type: productTage, id }],
    }),

    // ??????????????????????????
    createProduct: buil.mutation({
      query: (body) => ({
        url: PRODUCT_URL,
        method: "POST",
        body
      }),
      invalidatesTags: [productTage]
    }),

    // ??????????????????????????
    uploadProductImage: buil.mutation({
      query: (body) => ({
        url: UPLOAD_URL,
        method: "POST",
        body
      }),
      invalidatesTags: [productTage]
    }),

    

    // ??????????????????????????
    updateProduct: buil.mutation({
      query: ({ id, body }) => {
        console.log(body)
        console.log(id)
        return {
          url: `${PRODUCT_URL}/${id}`,
          method: "PUT",
          body
        }
      },
    }),

    // ??????????????????????????
    deleteProduct: buil.mutation({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
        method: "DELETE",
      }),
      providesTags:[productTage]
    }),


    // ??????????????????????????
    createReview: buil.mutation({
      query: ({id,...body}) => ({
        url: `${PRODUCT_URL}/${id}/reviews`,
        method: "POST",
        body
      }),
    }),


    // ??????????????????????????
    getTopProducts: buil.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
      }),
      keepUnusedDataFor:5
    }),

    // ??????????????????????????
    getNewProducts: buil.query({
      query: () => ({
        url: `${PRODUCT_URL}/new`,
      }),
      keepUnusedDataFor: 5
    }),
    getFilteredProducts: buil.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCT_URL}/filter-products`,
        method: "POST",
        body: { checked, radio }
      }),
      keepUnusedDataFor: 5
    }),


  })
})


export const {
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useCreateReviewMutation,
  useDeleteProductMutation,
  useGetNewProductsQuery,
  useGetProductByIdQuery,
  useGetProductDetailsQuery,
  useGetProductsQuery,
  useGetTopProductsQuery,
  useUploadProductImageMutation,
  // why i use query wiht post method because i query make auto-fetch and post don't make caching 
  // and mutation don't make caching but i need post to but the data in the body of the reqest
  useGetFilteredProductsQuery
} = productApiSlice

