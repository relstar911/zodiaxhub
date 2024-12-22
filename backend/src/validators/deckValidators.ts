import { body } from 'express-validator';
import { PowerSign } from '../types';

export const createDeckValidator = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Deck name must be between 3 and 50 characters'),

  body('description')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),

  body('cards')
    .isArray()
    .withMessage('Cards must be an array')
    .custom((cards) => {
      const totalCards = cards.reduce((sum: number, card: any) => sum + card.quantity, 0);
      return totalCards >= 60 && totalCards <= 100;
    })
    .withMessage('Deck must contain between 60 and 100 cards'),

  body('cards.*.cardId')
    .isMongoId()
    .withMessage('Invalid card ID'),

  body('cards.*.quantity')
    .isInt({ min: 1, max: 4 })
    .withMessage('Card quantity must be between 1 and 4'),

  body('powerSignFocus')
    .isIn(Object.values(PowerSign))
    .withMessage('Invalid power sign focus'),

  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

export const updateDeckValidator = createDeckValidator.map(validator => 
  validator.optional()
);
