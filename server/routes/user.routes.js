

import { Router } from 'express';
import { getLoggedInUserDetails, getStudentAttendance, login, logoutUser, registerUser } from '../controller/Student.controller.js';
import upload from "../middlewares/multer.middleware.js"
import { isLoggedIn } from '../middlewares/auth.middleware.js';






const router = Router();

router.post('/login', login);
router.post('/logout', logoutUser);
router.post('/register', upload.single('profilePic'), registerUser);
router.get('/me', isLoggedIn, getLoggedInUserDetails);
router.get('/attendance', isLoggedIn, getStudentAttendance)



export default router;
