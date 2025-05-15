

import { Router } from 'express';
import { getLoggedInUserDetails, getStudentActivities, getStudentAssignments, getStudentAttendance, login, logoutUser, registerUser } from '../controller/Student.controller.js';
import upload from "../middlewares/multer.middleware.js"
import { isLoggedIn } from '../middlewares/auth.middleware.js';






const router = Router();

router.post('/login', login);
router.post('/logout', logoutUser);
router.post('/register', upload.single('profilePic'), registerUser);
router.get('/me', isLoggedIn, getLoggedInUserDetails);
router.get('/attendance', isLoggedIn, getStudentAttendance);
router.get('/activity', isLoggedIn, getStudentActivities);
router.get('/assiginment', isLoggedIn, getStudentAssignments);



export default router;
