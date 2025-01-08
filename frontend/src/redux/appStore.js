import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import dataSetReducer from "./dataSetSlice";
import loadingReducer from "./loadingSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    dataSet: dataSetReducer,
    loading: loadingReducer,
  },
});

export default appStore;
