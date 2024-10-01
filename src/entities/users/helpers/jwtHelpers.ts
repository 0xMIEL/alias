import jwt from 'jsonwebtoken';
import { AppError } from '../../../core/AppError'; 
import { HTTP_STATUS_CODES } from '../../../constants/httpStatusCodes';

if (!process.env.JWT_SECRET) {
  throw new AppError('JWT_SECRET is not defined in the environment variables', HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500);
}

const JWT_SECRET = process.env.JWT_SECRET; 

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET); 
  } catch (error) {
    throw new AppError('Invalid token', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }
};
