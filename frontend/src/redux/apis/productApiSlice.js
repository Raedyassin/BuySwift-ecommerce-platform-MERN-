import apiSlice from '../services/apiSlice'
import { PRODUCT_URL, UPLOAD_URL, productTage, productReviewTage } from '../constance'
const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (buil) => ({
    // ??????????????????????????
    getProducts: buil.query({
      query: ({ keyword }) => ({
        url: PRODUCT_URL,
        params: { keyword }
      }),
      keepUnusedDataFor: 5,
      providesTags: [productTage]
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
      keepUnusedDataFor: 5
    }),

    // ??????????????????????????
    getProductById: buil.query({
      query: (id) => ({
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
      providesTags: [productTage]
    }),

    /******************
     * product review *
     ******************
     */
    getReviewsProductById: buil.query({
      query: ({ id, page, limit }) => ({
        url: `${PRODUCT_URL}/${id}/reviews?page=${page || 1}&limit=${limit || 10}`,
      }),
      transformResponse: (response, meta, arg) => ({
        ...response,
        productId: arg.id, // Pass id to newData for comparison
      }),
      keepUnusedDataFor: 5,
      providesTags: (res, err, { id }) => [{ type: productReviewTage, id }],
      serializeQueryArgs: ({ endpointName, queryArgs }) =>
        `${endpointName}-${queryArgs.id}`,
      merge: (currentCache = {}, newData) => {
        // If no cache or id changes, replace entirely
        if (!currentCache.productId || currentCache.productId !== newData.productId) {
          return {
            ...newData,
            productId: newData.productId, 
          };
        }
        // Same id, append reviews for pagination
        return {
          ...currentCache,
          data: {
            reviews: [...currentCache.data.reviews, ...newData.data.reviews],
          },
          currentPage: newData.currentPage,
          pageSize: newData.pageSize,
          hasNextPage: newData.hasNextPage,
          hasPrevPage: newData.hasPrevPage,
          productId: newData.productId,  
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {        
        return currentArg.id !== previousArg?.id &&
          currentArg.page !== previousArg?.page
      }
    }),

    editeProductReview: buil.mutation({
      query: ({ id, reviewId, comment }) => ({
        url: `${PRODUCT_URL}/reviewsedit/${id}/${reviewId}`,
        method: "PATCH",
        body: { comment }
      }),
    }),
    // editeProductRating: buil.mutation({
    //   query: ({ id, reviewId, rating }) => ({
    //     url: `${PRODUCT_URL}/ratingsedit/${id}/${reviewId}`,
    //     method: "PATCH",
    //     body: { rating }
    //   }),
    // }),

    // ??????????????????????????
    createReview: buil.mutation({
      query: ({ id, ...body }) => ({
        url: `${PRODUCT_URL}/${id}/reviews`,
        method: "POST",
        body
      }),
    }),
    createRating: buil.mutation({
      query: ({ id, ...body }) => ({
        url: `${PRODUCT_URL}/${id}/rating`,
        method: "POST",
        body
      }),
    }),


    // ??????????????????????????
    getTopProducts: buil.query({
      query: () => ({
        url: `${PRODUCT_URL}/top`,
      }),
      keepUnusedDataFor: 5
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
    RelatedProducts: buil.query({
      query: ({ id }) => ({
        url: `${PRODUCT_URL}/related/${id}`,
      }),
      keepUnusedDataFor: 5,
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        return `${endpointName}-${queryArgs.id}`;
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return (
          currentArg.page !== previousArg?.page ||
          currentArg.id !== previousArg?.id
        );
      }
    })


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
  useGetFilteredProductsQuery,
  useRelatedProductsQuery,
  useGetReviewsProductByIdQuery,
  useEditeProductReviewMutation,
  // useEditeProductRatingMutation,
  useCreateRatingMutation
} = productApiSlice

