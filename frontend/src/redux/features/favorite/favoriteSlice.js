import { createSlice } from "@reduxjs/toolkit";

const favoriteSlice = createSlice({
  name: "favorite",
  initialState:[],
  reducers: {
    addToFavorite: (state, action) => {
      console.log("action.payload", action.payload);
      state.push(action.payload);
    },
    removeFromFavorite: (state, action) => {
      return state.filter(
        (product) => product._id !== action.payload
      );
    },
    setFavorite: (state, action) => {
      return action.payload;
    },
  },
});

export const { addToFavorite, removeFromFavorite, setFavorite }
  = favoriteSlice.actions;
export const selectFavoriteProduct = (state) => state.favorites;
export default favoriteSlice.reducer;
