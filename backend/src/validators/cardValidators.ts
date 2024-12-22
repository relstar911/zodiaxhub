import { body } from 'express-validator';
import { CardType, PowerSign, CardRarity } from '../types';

export const createCardValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Card name is required'),

  body('type')
    .isIn(Object.values(CardType))
    .withMessage('Invalid card type'),

  body('powerSign')
    .isIn(Object.values(PowerSign))
    .withMessage('Invalid power sign'),

  body('rarity')
    .isIn(Object.values(CardRarity))
    .withMessage('Invalid card rarity'),

  body('energyCost')
    .isInt({ min: 0 })
    .withMessage('Energy cost must be a non-negative integer'),

  body('limitPerDeck')
    .optional()
    .isInt({ min: 1, max: 4 })
    .withMessage('Limit per deck must be between 1 and 4'),

  body('attributes')
    .optional()
    .isObject()
    .withMessage('Attributes must be an object'),

  body('abilities')
    .optional()
    .isArray()
    .withMessage('Abilities must be an array'),

  body('abilities.*.name')
    .optional()
    .isString()
    .withMessage('Ability name must be a string'),

  body('abilities.*.description')
    .optional()
    .isString()
    .withMessage('Ability description must be a string'),

  body('abilities.*.cost')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Ability cost must be a non-negative integer')
];

export const updateCardValidator = createCardValidator.map(validator => 
  validator.optional()
);
