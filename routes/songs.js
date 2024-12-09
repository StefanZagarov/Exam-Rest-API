import { Router } from 'express';
import songsController from '../controllers/songsController.js';

const router = Router();

router.get(`/ranking`, songsController.getAllSongsByLikes);
router.post(`/create`, songsController.createSong);
router.get(`/:songId`, songsController.getSong);
router.post(`/:songId`, songsController.updateSong);
router.post(`/:songId/like`, songsController.likeSong);
router.post(`/:songId/unlike`, songsController.unlikeSong);
router.post(`/:songId/comment`, songsController.addComment);
router.delete(`/:songId/:commentId`, songsController.deleteComment);
router.delete(`/:songId/`, songsController.deleteSong);

export default router;