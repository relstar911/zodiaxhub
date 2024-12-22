import express from 'express';
import { cardController } from '../controllers/cardController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCardValidator, updateCardValidator } from '../validators/cardValidators';

const router = express.Router();

// Public routes
router.get('/', cardController.getCards);
router.get('/:id', cardController.getCard);

// Protected routes
router.use(protect);

// Admin only routes
router.post('/', authorize('admin'), validate(createCardValidator), cardController.createCard);
router.put('/:id', authorize('admin'), validate(updateCardValidator), cardController.updateCard);
router.delete('/:id', authorize('admin'), cardController.deleteCard);

export default router;
