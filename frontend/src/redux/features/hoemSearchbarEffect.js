import { createSlice } from "@reduxjs/toolkit";

const homeSearchbarEffect = createSlice({
  name: "homeSearchbarEffect",
  initialState: "dark",
  reducers: {
    changeToDarkSearchbar: () => {
      return "dark";
    },
    changeToLightSearchbar: () => {
      return 'light';
    },
  },
});

export const {
  changeToDarkSearchbar,
  changeToLightSearchbar,
} = homeSearchbarEffect.actions;
export default homeSearchbarEffect.reducer;