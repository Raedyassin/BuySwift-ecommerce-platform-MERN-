import { createSlice } from "@reduxjs/toolkit";

const changeColorSidebarSlice = createSlice({
  name: "changeColorSidebar",
  initialState: 'dark',
  reducers: {
    changeToDark: () => {
      return 'dark';
    },
    changeToLight: () => {
      return 'light';
    },
  },
});

export const {
  changeToDark,
  changeToLight,
} = changeColorSidebarSlice.actions;
export default changeColorSidebarSlice.reducer;