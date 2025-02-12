import { USERS_URL,  userTage } from "../constance";
import apiSlice from "../services/apiSlice";


const userApi = apiSlice.injectEndpoints({
  /////////////////////////////////////
  endpoints: (build) => ({
    createUser: build.mutation({
      query: (body) => ({
        url: USERS_URL,
        method: "POST",
        body
      }),
    }),
    ////////////////////////////////////
    login: build.mutation({
      query: (body) => ({
        url: USERS_URL + "/login",
        method: "POST",
        body
      }),
    }),
    ////////////////////////////////////
    logout: build.mutation({
      query: () => ({
        url: USERS_URL + "/logout",
        method: "POST",
      }),
    }),
    ////////////////////////
    profile: build.mutation({
      query: (body) => ({
        url: USERS_URL + "/profile",
        method: "PATCH",
        body
      }),
    }),
    /// admin actions
    ////////////////////////
    getAllUsersByAdmin: build.query({
      query: () => ({ url: USERS_URL }),
      providTage: [userTage],
      keepUnusedDataFor: 5
    }),
    ////////////////////////
    deleteUserByAdmin: build.mutation({
      query: (id) => ({
        url: USERS_URL + `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [userTage],
    }),
    ////////////////////////
    userGetDetailsByAdmin: build.query({
      query: (id) => USERS_URL + `/${id}`,
      keepUnusedDataFor: 5,
    }),
    ////////////////////////
    userUpdateDetailsByAdmin: build.mutation({
      query: ({ id, body }) => ({
          url: USERS_URL + `/${id}`,
          method: "PATCH", 
          body
        }),
      invalidatesTags: [userTage],
    }),
  }),
})
  

export const {
  useCreateUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetAllUsersByAdminQuery,
  useDeleteUserByAdminMutation,
  useUserGetDetailsByAdminQuery,
  useUserUpdateDetailsByAdminMutation
} = userApi