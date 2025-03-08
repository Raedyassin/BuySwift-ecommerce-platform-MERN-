import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import apiSlice from './services/apiSlice'
import authSlice from './features/auth/authSlice'
import favoriteSlice from './features/favorite/favoriteSlice'
import { getFavoritesFromLocalStorage } from '../utils/localstorage'
import cartSlice from './features/cart/cartSlice'
import shopeSlice from './features/shop/shopSlice'

const initialFavoritesState = getFavoritesFromLocalStorage() || [];


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    favorites: favoriteSlice,
    cart: cartSlice,
    shop: shopeSlice,
  },

  preloadedState: {
    favorites: initialFavoritesState,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools:true,
})

setupListeners(store.dispatch)