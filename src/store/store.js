import { configureStore } from "@reduxjs/toolkit";
import baseReducer from "../features/baseUrl/basicDataSlice";

export default configureStore({
  reducer: {
    base: baseReducer,
  },
});
