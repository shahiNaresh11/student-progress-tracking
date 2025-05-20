import { Router } from 'express';
import { createClass, getAllClasses, registerTeacher } from '../controller/Teacher.controller.js';
import upload from "../middlewares/multer.middleware.js"






const router = Router();

router.post('/register', upload.single('profilePic'), registerTeacher);
router.get('/getAllClass', getAllClasses);
router.post('/createClass', createClass)


export default router;