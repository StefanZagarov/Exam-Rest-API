import { Router } from 'express';
import bandsController from '../controllers/bandsController.js';

const router = Router();

router.get(`/ranking`, bandsController.getAllBands);
router.post(`/create`, bandsController.createBand);
router.get(`/:bandId`, bandsController.getBand);

export default router;