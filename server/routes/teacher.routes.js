import { Router } from 'express';
import { createActivity, createClass, getAllClasses, getAllStudnet, markAttendance, registerTeacher } from '../controller/Teacher.controller.js';
import upload from "../middlewares/multer.middleware.js"






const router = Router();

router.post('/register', upload.single('profilePic'), registerTeacher);
router.get('/getAllClass', getAllClasses);
router.post('/createClass', createClass);
router.get('/getAllStudent/:classId', getAllStudnet);
router.post('/mark-attendance', markAttendance);
router.post('/activity', createActivity);





export default router;