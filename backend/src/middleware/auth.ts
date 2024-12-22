import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User } from '../models/User';
import { AppError } from './errorHandler';
import config from '../config';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader);
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Please log in to access this route', 401);
    }

    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);
    
    if (!token) {
      throw new AppError('Please log in to access this route', 401);
    }

    // Verify token
    try {
      console.log('Attempting to verify token with secret:', config.jwt.secret);
      const decoded = verifyToken(token);
      console.log('Token decoded successfully:', decoded);

      if (!decoded || !decoded.id) {
        throw new AppError('Invalid token', 401);
      }

      // Check if user still exists
      const user = await User.findById(decoded.id).select('-password').lean();
      console.log('User found:', user ? 'Yes' : 'No');

      if (!user) {
        throw new AppError('The user belonging to this token no longer exists', 401);
      }

      // Grant access to protected route
      req.user = {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      };
      next();
    } catch (verifyError) {
      console.error('Token verification failed:', verifyError);
      throw new AppError('Invalid token', 401);
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    next(error);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
