import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  email: "",
  photo: "",
  uid: "",
  sessionid: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserLoginDetails: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.photo = action.payload.photo;
      state.uid = action.payload.uid;
    },
    setSignOutState: (state) => {
      state.name = null;
      state.email = null;
      state.photo = null;
      state.uid = null;
    },
    setGuestSessionId: (state, action) => {
      state.sessionid = action.payload;
    },
  },
});

export const { setUserLoginDetails, setSignOutState, setGuestSessionId } = userSlice.actions;

export const selectUserName = (state) => state.user.name;
export const selectUserEmail = (state) => state.user.email;
export const selectUserPhoto = (state) => state.user.photo;
export const selectUserUID = (state) => state.user.uid;
export const selectGuestSessionId = (state) => state.user.sessionid;

export default userSlice.reducer;
