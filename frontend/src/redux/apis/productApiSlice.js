import apiSlice from '../services/apiSlice'
import { PRODUCT_URL, productTage, productReviewTage } from '../constance'
const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (buil) => ({

    // ??????????????????????????
    getProductById: buil.query({
      query: (id) => ({
        url: `${PRODUCT_URL}/${id}`,
      }),
      providesTags: [productTage],
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
    updateProduct: buil.mutation({
      query: ({ id, body }) => {
        return {
          url: `${PRODUCT_URL}/${id}`,
          method: "PUT",
          body
        }
      },
      invalidatesTags: [productTage]
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
            numComments: newData.data.numComments,
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

    /******************
     * product groups *
     ******************
    */

    // getAllProductsPage  and getAllProductsTable call the same api endpoint 
    getAllProductsPage: buil.query({
      query: ({ page, limit}) => ({
        url: `${PRODUCT_URL}/products-list?page=${page}&limit=${limit}`,
      }),
      providesTags: [productTage],
      serializeQueryArgs: ({ endpointName }) => endpointName,
      merge: (currentCache, newData) => {
        return {
          ...currentCache,
          data: { products: [...currentCache.data.products , ...newData.data.products] },
          currentPage: newData.currentPage,
          pageSize: newData.pageSize,
          hasNextPage: newData.hasNextPage,
          hasPrevPage: newData.hasPrevPage
        }
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg.page !== previousArg?.page
      }
    }),

    getAllProductsTable: buil.query({
      query: ({ page, limit, createdAt, id, name, brand, category, price, rating, quantity }) => ({
        url: `${PRODUCT_URL}/products-list?page=${page}&limit=${limit}&createdAt=${createdAt}&id=${id}&name=${name}&brand=${brand}&category=${category}&price=${price}&rating=${rating}&quantity=${quantity}`,
      }),
    }),

    // ??????????????????????????
    getHomeProducts: buil.query({
      query: () => ({
        url: `${PRODUCT_URL}/home`,
      }),
      keepUnusedDataFor: Infinity,
      providesTags: [productTage],
    }),


    getSearchedProducts: buil.query({
      query: ({ selectedCategory, price, page, searchName, limit }) => ({
        url: `${PRODUCT_URL}/search?page=${page}&limit=${limit}&searchName=${searchName}&cateogries=${selectedCategory}&price=${price}`,
      }),
      transformResponse: (response, meta, arg) => ({
        ...response,
        searchName: arg.searchName,
        selectedCategory: arg.selectedCategory,
        price: arg.price
      }),
      serializeQueryArgs: ({ endpointName }) => endpointName,
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg.page !== previousArg?.page ||
          currentArg.selectedCategory !== previousArg?.selectedCategory ||
          currentArg.price !== previousArg?.price ||
          currentArg.searchName !== previousArg?.searchName
        );
      },
      merge: (currentCache = {}, newData) => {
        if (currentCache.searchName !== newData.searchName ||
          currentCache.selectedCategory !== newData.selectedCategory ||
          currentCache.price !== newData.price) {
          return newData
        }
        return {
          ...currentCache,
          data: { products: [...currentCache.data.products , ...newData.data.products] },
          currentPage: newData.currentPage,
          pageSize: newData.pageSize,
          hasNextPage: newData.hasNextPage,
          hasPrevPage: newData.hasPrevPage,
          searchName: newData.searchName,
          selectedCategory: newData.selectedCategory,
          price: newData.price
        }
      },
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
  useGetAllProductsTableQuery,
  useGetAllProductsPageQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useCreateReviewMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useGetHomeProductsQuery,
  // why i use query wiht post method because i query make auto-fetch and post don't make caching 
  // and mutation don't make caching but i need post to but the data in the body of the reqest
  useGetSearchedProductsQuery,
  useRelatedProductsQuery,
  useGetReviewsProductByIdQuery,
  useEditeProductReviewMutation,
  useCreateRatingMutation
} = productApiSlice

