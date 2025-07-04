import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiousInstance";


// Initial state setup
const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  role: localStorage.getItem("role") || "",
  data: (() => {
    try {
      const data = localStorage.getItem("data");
      return data ? JSON.parse(data) : {}; // Safely handle null/undefined
    } catch (error) {
      console.error("Failed to parse localStorage data:", error);
      return {}; // Fallback if JSON is invalid
    }
  })(),
  attendanceData: null,
  activityData: null,

};

// Async thunk for creating new account (by superadmin)
export const createAccount = createAsyncThunk(
  "/auth/signup", async (data, { rejectWithValue }) => {
    try {
      console.log("upper", data)

      const response = await axiosInstance.post("/user/register", data);
      console.log(data)

      toast.success(response?.data?.message || "User created successfully!");
      return response.data;

    } catch (error) {
      const message = error?.response?.data?.message || "Failed to create user";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const createTeacherAccount = createAsyncThunk(
  "/auth/signup", async (data, { rejectWithValue }) => {
    try {
      console.log("upper", data)

      const response = await axiosInstance.post("/teacher/register", data);
      console.log(data)

      toast.success(response?.data?.message || "User created successfully!");
      return response.data;

    } catch (error) {
      const message = error?.response?.data?.message || "Failed to create Teacher";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);


// Async thunk for login
export const login = createAsyncThunk(
  "/auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/user/login", data);
      toast.success(res?.data?.message || "Login successful!");
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  "/auth/logout",
  async () => {
    try {
      const res = await axiosInstance.post("/user/logout");
      toast.success(res?.data?.message || "Logged out successfully!");
      return res.data;
    } catch (error) {
      const message = error?.response?.data?.message || "Logout failed";
      toast.error(message);
      throw error;
    }
  }
);

// Async thunk to get user data
export const getUserData = createAsyncThunk(

  "/auth/getData",

  async () => {

    try {
      const response = await axiosInstance.get("/user/me");
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user data");
      throw error;
    }
  }
);

export const getStudentAttendance = createAsyncThunk("user/attendance",
  async () => {
    try {
      const response = await axiosInstance.get("/user/attendance");
      return response.data;


    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user data");
      throw error;


    }
  }

);

export const getActivity = createAsyncThunk("user/activity",
  async () => {
    try {
      const response = await axiosInstance.get("/user/activity");
      toast.success("Fetch activityData sucessfully");

      // console.log("actvity of user", response.data);
      // console.log("actvity of user 2", response);
      return response.data;


    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user activity");
      throw error;

    }
  }
);

export const getAssignments = createAsyncThunk("user/assiginment",
  async () => {
    try {
      const response = await axiosInstance.get("/user/assiginment");
      console.log("actvity of assiginment", response.data);
      return response.data;


    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user activity");
      throw error;

    }
  }
);

export const getRecommendation = createAsyncThunk("user/recommendation",
  async () => {
    try {
      const response = await axiosInstance.get("/recommend");
      console.log("actvity of recommend", response.data);
      return response.data;


    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch user recommend");
      throw error;

    }
  }
);


// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTeacherAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createTeacherAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.teacher = action.payload;
      })
      .addCase(createTeacherAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Handle successful login
      .addCase(login.fulfilled, (state, action) => {
        const user = action?.payload?.user;
        localStorage.setItem("data", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", user?.role || "");

        state.isLoggedIn = true;
        state.data = user;
        state.role = user?.role || "";
      })

      // Handle successful logout
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.data = {};
        state.isLoggedIn = false;
        state.role = "";
      })

      // Handle getting user data
      .addCase(getUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // ✅ store full user data, including .points
        localStorage.setItem("data", JSON.stringify(action.payload)); // optional: keep localStorage updated
        console.log("Updated user data (with points):", action.payload);
      })

      .addCase(getUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getStudentAttendance.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getStudentAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceData = action.payload;

      })
      .addCase(getStudentAttendance.rejected, (state, action) => {
        state.loading = false;
        state.attendanceError = action.payload || "Failed to fetch attendance! from extrareducer";
      })


      //for activity
      .addCase(getActivity.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.activityData = action.payload;

      })
      .addCase(getActivity.rejected, (state, action) => {
        state.loading = false;
        state.activityError = action.payload || "Failed to fetch actvity! from extrareducer";
      })

      // for Assiginment
      .addCase(getAssignments.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(getAssignments.fulfilled, (state, action) => {
        state.loading = false;
        state.assiginmentData = action.payload;

      })
      .addCase(getAssignments.rejected, (state, action) => {
        state.loading = false;
        state.assiginmentError = action.payload || "Failed to fetch actvity! from extrareducer";
      })

      .addCase(getRecommendation.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendationData = action.payload?.recommendations || null;
      })
      .addCase(getRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.recommendationError = action.payload || "Failed to fetch recommendation data!";
      });


  },
});

export default authSlice.reducer;