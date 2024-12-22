import express from 'express';
import { deckController } from '../controllers/deckController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createDeckValidator, updateDeckValidator } from '../validators/deckValidators';

const router = express.Router();

// Public routes
router.get('/', deckController.getDecks);
router.get('/:id', deckController.getDeck);

// Protected routes
router.use(protect);
router.post('/', validate(createDeckValidator), deckController.createDeck);
router.put('/:id', validate(updateDeckValidator), deckController.updateDeck);
router.delete('/:id', deckController.deleteDeck);

export default router;
