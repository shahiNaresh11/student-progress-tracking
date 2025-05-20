import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/AuthSlice";
import teacherSliceReducer from "./Slices/TeacherSlice"

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        teacher: teacherSliceReducer
    },
    devTools: true,
});
export default store;
