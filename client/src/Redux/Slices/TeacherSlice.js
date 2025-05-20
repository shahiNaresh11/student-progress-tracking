import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Helpers/axiousInstance';
import { toast } from 'react-hot-toast';

// Async thunk to create a class
export const createClass = createAsyncThunk(
    "teacher/createClass",
    async (classData, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.post("/teacher/createClass", classData);
            toast.success(res?.data?.message || "Class created successfully!");
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to create class";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// Async thunk to get all classes
export const getAllClass = createAsyncThunk(
    'teacher/getAllClass',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosInstance.get("/teacher/getAllClass");
            toast.success(res?.data?.message || "Classes fetched successfully!");
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch classes";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const teacherSlice = createSlice({
    name: 'teacher',
    initialState: {
        classes: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // createClass handlers
            .addCase(createClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClass.fulfilled, (state, action) => {
                state.loading = false;
                state.classes.push(action.payload);
            })
            .addCase(createClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // getAllClass handlers
            .addCase(getAllClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllClass.fulfilled, (state, action) => {
                state.loading = false;
                state.classes = action.payload; // adapt if API differs
            })
            .addCase(getAllClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export default teacherSlice.reducer;
