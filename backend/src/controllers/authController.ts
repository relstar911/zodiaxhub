import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';

const createSendToken = (user: any, statusCode: number, res: Response) => {
  console.log('Creating token for user:', user._id);
  const token = generateToken(user);
  console.log('Token generated successfully');

  const userResponse = user.toObject();
  delete (userResponse as any).password;

  console.log('Sending response with token');
  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user: userResponse
    }
  });
};

export const authController = {
  // Register new user
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, password, preferredPowerSigns } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { username }]
      });

      if (existingUser) {
        throw new AppError('User already exists', 400);
      }

      // Create user
      const user = await User.create({
        username,
        email,
        password,
        preferredPowerSigns
      });

      createSendToken(user, 201, res);
    } catch (error) {
      next(error);
    }
  },

  // Login user
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      console.log('Login attempt for email:', email);

      // Check if email and password exist
      if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
      }

      // Check if user exists && password is correct
      const user = await User.findOne({ email }).select('+password');
      console.log('User found:', user ? 'Yes' : 'No');

      if (!user || !(await user.comparePassword(password))) {
        console.log('Password comparison failed');
        throw new AppError('Incorrect email or password', 401);
      }

      console.log('Login successful, generating token...');
      createSendToken(user, 200, res);
    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  },

  // Get current user
  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError('Not authenticated', 401);
      }

      const user = await User.findById(req.user.id)
        .select('-password')
        .lean();

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      console.error('GetMe Error:', error);
      next(error);
    }
  },

  // Update user details
  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, email, preferredPowerSigns } = req.body;

      // Prevent password update on this route
      if (req.body.password) {
        throw new AppError('This route is not for password updates', 400);
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { username, email, preferredPowerSigns },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  },

  // Update password
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id).select('+password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      if (!(await user.comparePassword(currentPassword))) {
        throw new AppError('Current password is incorrect', 401);
      }

      user.password = newPassword;
      await user.save();

      // Generate new token
      const token = generateToken(user);

      res.status(200).json({
        status: 'success',
        token
      });
    } catch (error) {
      next(error);
    }
  },

  // List all users (temporary development endpoint)
  async listUsers(req: Request, res: Response) {
    const users = await User.find().select('-password');
    res.json({ users });
  }
};
