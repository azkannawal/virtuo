import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import searchReducer from  "../features/movie/searchSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

console.log("oncreate store : ", store.getState());

store.subscribe(() => {
  console.log("STORE CHANGE: ", store.getState());
});

export default store;
