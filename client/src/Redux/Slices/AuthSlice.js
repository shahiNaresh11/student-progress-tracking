import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiousInstance";

// Safe JSON parse
const parseJSON = (value, fallback) => {
  try {
    return JSON.parse(value) || fallback;
  } catch (e) {
    return fallback;
  }
};

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  role: localStorage.getItem("role") || "",
  data: parseJSON(localStorage.getItem("data"), {}),
};

// Async thunk for real login
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const res = axiosInstance.post("user/login", data);
    toast.promise(res, {
      loading: "Authenticating...",
      success: (data) => data?.data?.message || "Login successful!",
      error: "Login failed",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Login error");
    throw error;
  }
});

// Logout thunk
export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const res = axiosInstance.post("user/logout");
    toast.promise(res, {
      loading: "Logging out...",
      success: (data) => data?.data?.message || "Logged out!",
      error: "Logout failed",
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || "Logout error");
    throw error;
  }
});

// Get user data thunk
export const getUserData = createAsyncThunk("/auth/getData", async () => {
  try {
    const response = axiosInstance.get("/user/me");
    return (await response).data;
  } catch (error) {
    toast.error(error?.message || "Failed to fetch user");
    throw error;
  }
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginFakeUser: (state, action) => {
      const { user } = action.payload;
      localStorage.setItem("data", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", user.role);

      state.data = user;
      state.isLoggedIn = true;
      state.role = user.role;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");

        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })

      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = "";
      });
  },
});

export const { loginFakeUser } = authSlice.actions;
export default authSlice.reducer;
