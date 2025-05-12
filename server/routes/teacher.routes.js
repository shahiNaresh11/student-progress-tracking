import { Router } from 'express';
import { registerTeacher } from '../controller/Teacher.controller.js';
import upload from "../middlewares/multer.middleware.js"






const router = Router();

router.post('/register', upload.single('profilePic'), registerTeacher);


export default router;