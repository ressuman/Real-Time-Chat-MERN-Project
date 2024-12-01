import { configureStore } from "@reduxjs/toolkit";
import loaderReducer from "../slice/loaderSlice";
//import userReducer from "./usersSlice";

const store = configureStore({
  reducer: {
    loaderReducer,
    //userReducer,
  },
});

export default store;
