import { Router } from 'express';
import { login, logoutUser } from '../controller/Student.controller.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logoutUser);

export default router;
