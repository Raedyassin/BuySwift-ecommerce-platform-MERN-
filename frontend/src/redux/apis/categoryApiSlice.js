import apiSlice from '../services/apiSlice'
import { CATEGORY_URL, categoryTage } from '../constance'


const categoryApiSlice = apiSlice.injectEndpoints({
  // add category
  endpoints: (build) => ({

    // create category
    createCategory: build.mutation({
      query: (body) => ({
        url: CATEGORY_URL,
        method: "POST",
        body
      }),
      invalidatesTags:[categoryTage],
    }),

    // update category
    updateCategory: build.mutation({
      query: ({ id, body }) => ({
        url:CATEGORY_URL+`/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: [categoryTage]
    }),


    /// get all categories
    getAllCategory: build.query({
      query: () => CATEGORY_URL + "/categories",
      providesTags: [categoryTage],
      keepUnusedDataFor: Infinity
    }),

    /// get single category
    getCategory: build.query({
      query: (id) => CATEGORY_URL + `/${id}`,
    }),
    
    // delete category
    deleteCategory: build.mutation({
      query: (id) => ({
        url: CATEGORY_URL + `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:[categoryTage]
    })


  })
})

export const {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllCategoryQuery,
  useGetCategoryQuery,
  useDeleteCategoryMutation
} = categoryApiSlice
