import jwt from 'jsonwebtoken';
import config from '../config';
import { IUser } from '../models/User';

export const generateToken = (user: IUser): string => {
  console.log('Generating token with secret:', config.jwt.secret);
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn
    }
  );
};

export const verifyToken = (token: string): any => {
  try {
    console.log('Verifying token with secret:', config.jwt.secret);
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    console.error('Token verification error:', error);
    throw new Error('Invalid token');
  }
};
