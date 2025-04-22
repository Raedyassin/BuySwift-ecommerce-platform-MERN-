import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query/react'
import apiSlice from './services/apiSlice'
import authSlice from './features/auth/authSlice'
import favoriteSlice from './features/favorite/favoriteSlice'
import { getFavoritesFromLocalStorage } from '../utils/localstorage'
import cartSlice from './features/cart/cartSlice'
import shopeSlice from './features/shop/shopSlice'
import changeColorSiderbarSlice from './features/changeColorSidebar'
import changeSearchbarPositionSlice from './features/chagneSearchbarPosition'
import homeSearchbarEffectSlice from './features/hoemSearchbarEffect'
import searchResultSlice from './features/searchResult'
const initialFavoritesState = getFavoritesFromLocalStorage() || [];


export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    favorites: favoriteSlice,
    cart: cartSlice,
    shop: shopeSlice,
    changeColorSidebar: changeColorSiderbarSlice,
    searchbarPosition: changeSearchbarPositionSlice,
    homeSearchbarEffect: homeSearchbarEffectSlice,
    showSearchReasult: searchResultSlice,
  },

  preloadedState: {
    favorites: initialFavoritesState,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools:true,
})

setupListeners(store.dispatch)