import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from '../../../core/AppError';
import { HTTP_STATUS_CODE } from '../../../constants/constants';

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new AppError(
    'JWT_SECRET is not defined in the environment variables',
    HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR_500,
  );
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    throw new AppError('Invalid token', HTTP_STATUS_CODE.UNAUTHORIZED_401);
  }
};
