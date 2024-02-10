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


store.subscribe(() => {
  store.getState();
});

export default store;
