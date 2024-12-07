import { Router } from 'express';
import bandsController from '../controllers/bandsController.js';

const router = Router();

router.get(`/ranking`, bandsController.getAllBandsByLikes);
router.post(`/create`, bandsController.createBand);
router.get(`/:bandId`, bandsController.getBand);
router.post(`/:bandId`, bandsController.updateBand);
router.post(`/:bandId/like`, bandsController.likeBand);
router.post(`/:bandId/unlike`, bandsController.unlikeBand);

export default router;