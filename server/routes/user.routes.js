import { Router } from 'express';
import { login, logoutUser, registerUser } from '../controller/Student.controller.js';
import upload from "../middlewares/multer.middleware.js"






const router = Router();

router.post('/login', login);
router.post('/logout', logoutUser);
router.post('/register', upload.single('img'), registerUser);


export default router;
