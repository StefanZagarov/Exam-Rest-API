import { Router } from 'express';
import bandsController from '../controllers/bandsController.js';

const router = Router();

router.post(`/create`, bandsController.createBand);

export default router;