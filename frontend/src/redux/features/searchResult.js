import { createSlice } from "@reduxjs/toolkit";

const searchResultSlice = createSlice({
  name: "homeSearchbarEffect",
  initialState: false,
  reducers: {
    showSearchResult: () => {
      return true;
    },
    hiddenSearchResult: () => {
      return false;
    },
  },
});

export const {
  showSearchResult,
  hiddenSearchResult,
} = searchResultSlice.actions;
export default searchResultSlice.reducer;