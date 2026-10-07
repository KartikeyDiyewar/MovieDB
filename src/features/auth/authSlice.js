import { createSlice } from "@reduxjs/toolkit";

const loadStoredUser = () => {
  try {
    const raw = localStorage.getItem("kd_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialUser = loadStoredUser();

const initialState = {
  user: initialUser,
  isAuthenticated: Boolean(initialUser),
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    loginUser: (state, action) => {
      const user = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      try {
        localStorage.setItem("kd_user", JSON.stringify(user));
      } catch (e) {
        console.error("Failed to save auth state to local storage", e);
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      try {
        localStorage.removeItem("kd_user");
      } catch (e) {
        console.error("Failed to clear auth state from local storage", e);
      }
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAuthLoading,
  loginUser,
  logoutUser,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;
