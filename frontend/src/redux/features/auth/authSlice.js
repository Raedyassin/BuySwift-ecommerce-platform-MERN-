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
      const expirationTokenDate = new Date(Date.now() + 23.5 * 60 * 60 * 1000);;
      localStorage.setItem("expirationTokenDate", JSON.stringify(expirationTokenDate));
    },

    //////////////////////////////////////
    logOut: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("expirationTokenDate");
    }
  }
})


export const { logOut, setCredientials } = authSlice.actions;
export default authSlice.reducer;