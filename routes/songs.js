import { Router } from 'express';
import songsController from '../controllers/songsController.js';

const router = Router();

router.get(`/ranking`, songsController.getAllSongs);
router.post(`/create`, songsController.createSong);
router.get(`/:songId`, songsController.getSong);

export default router;