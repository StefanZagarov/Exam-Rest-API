import { Router } from 'express';
import bandsController from '../controllers/bandsController.js';

const router = Router();

router.get(`/ranking`, bandsController.getAllBands);
router.post(`/create`, bandsController.createBand);

export default router;