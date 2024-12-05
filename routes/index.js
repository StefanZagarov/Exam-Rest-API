import { Router } from "express";
import authController from '../controllers/authController.js';
import user from './user.js';

const router = Router();

router.post(`/register`, authController.register);
router.post(`/login`, authController.login);
router.post(`/logout`, authController.logout);

router.use('/user', user);

export default router;