import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiousInstance";

// Initial state setup
const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",  // Ensuring boolean value
  role: localStorage.getItem("role") || "",
  data: JSON.parse(localStorage.getItem("data")) || {},
};

// Async thunk for login
export const login = createAsyncThunk("/auth/login", async (data) => {
  try {
    const loginPromise = axiosInstance.post("user/login", data);
    console.log(loginPromise);

    toast.promise(loginPromise, {
      loading: "Authenticating...",
      success: (res) => res?.data?.message || "Login successful!",
      error: (err) => err?.response?.data?.message || "Login failed",
    });

    const res = await loginPromise;
    return res.data;
  } catch (error) {
    // Optional here because toast.promise already handles it
    throw error;
  }
});


// Async thunk for logout
// Async thunk for logout
export const logout = createAsyncThunk("/auth/logout", async () => {
  try {
    const logoutPromise = axiosInstance.post("user/logout");
    console.log(logoutPromise);

    toast.promise(logoutPromise, {
      loading: "Logging out...",
      success: (res) => res?.data?.message || "Logged out successfully!",
      error: (err) => err?.response?.data?.message || "Logout failed",
    });

    const res = await logoutPromise;
    return res.data;
  } catch (error) {
    // Optional here because toast.promise already handles it
    throw error;
  }
});
// Async thunk to get user data
export const getUserData = createAsyncThunk("/auth/getData", async () => {
  try {
    // Fetch user data
    const response = await axiosInstance.get("/user/me");
    return response.data;  // Returning the user data
  } catch (error) {
    toast.error(error?.message || "Failed to fetch user");
    throw error;
  }
});

// Auth slice to handle login/logout states and actions
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},  // No reducers, only async thunks are used
  extraReducers: (builder) => {
    builder
      // Handle successful login
      .addCase(login.fulfilled, (state, action) => {
        const user = action?.payload?.user;

        // Update localStorage with user info
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");

        // Update state with user data
        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })

      // Handle successful logout
      .addCase(logout.fulfilled, (state) => {
        // Clear localStorage and reset state
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = "";
      });
  },
});

export default authSlice.reducer;
