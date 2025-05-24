import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../Helpers/axiousInstance';
import { toast } from 'react-hot-toast';

const initialState = {
    classes: [],
    students: [],
    activities: [],
    loading: false,
    error: null,
}

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

export const getAllStudentsByClassId = createAsyncThunk(
    'student/getAllStudentsByClassId',
    async (classId, { rejectWithValue }) => {
        try {
            console.log("Class ID from front-end:", classId);
            const res = await axiosInstance.get(`teacher/getAllStudent/${classId}`);
            toast.success(res?.data?.message || "Students fetched successfully!");
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to fetch students";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

// Async thunk to mark attendance
export const markAttendance = createAsyncThunk(
    "teacher/markAttendance",
    async (attendanceData, { rejectWithValue }) => {
        console.log("attendence data", attendanceData);
        try {
            const res = await axiosInstance.post("/teacher/mark-attendance", { attendance: attendanceData });
            console.log("res of attendece", res);
            toast.success(res?.data?.message || "Attendance marked successfully!");
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to mark attendance";
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

export const createActivity = createAsyncThunk(
    'activity/createActivity',
    async (activityData, { rejectWithValue }) => {
        console.log("upper activity", activityData)
        try {
            const res = await axiosInstance.post('/teacher/createActivity', activityData);
            console.log("lower activity", activityData)
            toast.success(res?.data?.message || 'Activity recorded successfully!');
            return res.data;
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to record activity';
            toast.error(message);
            return rejectWithValue(message);
        }
    }
);

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,

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
                state.classes = action.payload.data; // ✅ only assign actual class array
            })

            .addCase(getAllClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })


            //getstudetnbyclassId
            .addCase(getAllStudentsByClassId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllStudentsByClassId.fulfilled, (state, action) => {
                state.loading = false;
                state.students = action.payload.data; // data contains student array
            })
            .addCase(getAllStudentsByClassId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            // markAttendance handlers
            .addCase(markAttendance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(markAttendance.fulfilled, (state, action) => {
                state.loading = false;
                state.attendance = action.payload;

            })
            .addCase(markAttendance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(createActivity.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createActivity.fulfilled, (state, action) => {
                state.loading = false; // good to set loading false here too
                state.activities.unshift({
                    ...action.payload,
                    timestamp: new Date().toISOString()
                });
            })

            .addCase(createActivity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
    },
});

export default teacherSlice.reducer;
