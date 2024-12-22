import express from 'express';
import { gameController } from '../controllers/gameController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All game routes require authentication
router.use(protect);

// Game management
router.post('/', gameController.createGame);
router.post('/:gameId/join', gameController.joinGame);
router.post('/:gameId/start', gameController.startGame);
router.get('/:gameId', gameController.getGameState);

// Game actions
router.post('/:gameId/play-card', gameController.playCard);
router.post('/:gameId/use-ability', gameController.useAbility);
router.post('/:gameId/attack', gameController.declareAttack);
router.post('/:gameId/end-turn', gameController.endTurn);

export default router;
