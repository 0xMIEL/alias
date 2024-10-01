import jwt, {JwtPayload} from 'jsonwebtoken';
import { AppError } from '../../../core/AppError';
import { HTTP_STATUS_CODES } from '../../../constants/httpStatusCodes';

const {JWT_SECRET} = process.env;

if (!JWT_SECRET) {
  throw new AppError(
    'JWT_SECRET is not defined in the environment variables',
    HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR_500,
  );
}

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): JwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new AppError('Invalid token', HTTP_STATUS_CODES.UNAUTHORIZED_401);
  }
};
