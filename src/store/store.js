import { configureStore } from "@reduxjs/toolkit";
import baseReducer from "../features/baseUrl/basicDataSlice";
import authReducer from "../features/auth/authSlice";

export default configureStore({
  reducer: {
    base: baseReducer,
    auth: authReducer,
  },
});
