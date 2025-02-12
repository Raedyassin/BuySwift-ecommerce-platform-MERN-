import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo") ?
    JSON.parse(localStorage.getItem("userInfo")) :
    null
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredientials: (state, acion) => {
      state.userInfo = acion.payload;
      localStorage.setItem("userInfo", JSON.stringify(acion.payload));
      const expirationTime = new Date() + 24 * 60 * 60 * 100;
      localStorage.setItem("expirationTime", JSON.stringify(expirationTime));
    },
    //////////////////////////////////////
    logOut: (state) => {
      state.userInfo = null;
      localStorage.clear();
    }
  }
})


export const { logOut, setCredientials } = authSlice.actions;
export default authSlice.reducer;