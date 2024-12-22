import express from 'express';
import { authController } from '../controllers/authController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerValidator,
  loginValidator,
  updateProfileValidator,
  updatePasswordValidator
} from '../validators/authValidators';

const router = express.Router();

// Public routes
router.post('/register', validate(registerValidator), authController.register);
router.post('/login', validate(loginValidator), authController.login);
router.get('/users', authController.listUsers); // Temporary development route

// Protected routes
router.use(protect); // All routes after this middleware require authentication
router.get('/me', authController.getMe);
router.patch('/updateMe', validate(updateProfileValidator), authController.updateMe);
router.patch('/updatePassword', validate(updatePasswordValidator), authController.updatePassword);

export default router;
