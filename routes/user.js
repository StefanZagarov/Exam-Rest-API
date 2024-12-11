import { Router } from "express";
import authController from "../controllers/authController.js";

const router = Router();

router.get(`/profile`, authController.getUserProfile);

export default router;