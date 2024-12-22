import { body } from 'express-validator';
import { PowerSign } from '../types';

export const registerValidator = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  
  body('preferredPowerSigns')
    .optional()
    .isArray()
    .custom((signs: string[]) => 
      signs.every(sign => Object.values(PowerSign).includes(sign as PowerSign))
    )
    .withMessage('Invalid power signs provided')
];

export const loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const updateProfileValidator = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be between 3 and 20 characters'),
  
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('preferredPowerSigns')
    .optional()
    .isArray()
    .custom((signs: string[]) => 
      signs.every(sign => Object.values(PowerSign).includes(sign as PowerSign))
    )
    .withMessage('Invalid power signs provided')
];

export const updatePasswordValidator = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
];
