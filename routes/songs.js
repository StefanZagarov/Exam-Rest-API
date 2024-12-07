import { Router } from 'express';
import songsController from '../controllers/songsController.js';

const router = Router();

router.get(`/ranking`, songsController.getAllSongsByLikes);
router.post(`/create`, songsController.createSong);
router.get(`/:songId`, songsController.getSong);
router.post(`/:songId`, songsController.updateSong);

export default router;