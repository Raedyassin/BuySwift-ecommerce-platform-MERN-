import { createSlice } from "@reduxjs/toolkit";

const changeSearchbarPosition = createSlice({
  name: "changeSearchbarPosition",
  initialState: 'relative',
  reducers: {
    chageToFixed: () => {
      return 'fixed';
    },
    changeToRelative: () => {
      return 'relative';
    },
  },
});

export const {
  chageToFixed,
  changeToRelative,
} = changeSearchbarPosition.actions;
export default changeSearchbarPosition.reducer;