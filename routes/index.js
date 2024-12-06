import { Router } from "express";
import authController from '../controllers/authController.js';
import user from './user.js';
import bands from './bands.js';
import songs from './songs.js';

const router = Router();

router.post(`/register`, authController.register);
router.post(`/login`, authController.login);
router.post(`/logout`, authController.logout);

router.use('/user', user);
router.use(`/band`, bands);
router.use(`/song`, songs);

export default router;