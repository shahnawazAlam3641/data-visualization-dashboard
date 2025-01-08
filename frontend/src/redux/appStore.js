import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import dataSetReducer from "./dataSetSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    dataSet: dataSetReducer,
  },
});

export default appStore;
