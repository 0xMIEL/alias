import { Socket } from 'socket.io';
import { AppError } from '../core/AppError';
import { HTTP_STATUS_CODE } from '../constants/constants';
import { verifyToken } from '../entities/users/helpers/jwtHelpers';
import { UserService } from '../entities/users/UserService';
import { User } from '../entities/users/User';
import { extractJwtToken } from '../utils/extractJwt';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const socketAuth = async (socket: Socket, next: Function) => {
  try {
    const cookies = socket.handshake.headers.cookie || '';

    const token = extractJwtToken(cookies);

    if (!token) {
      return next(
        new AppError(
          'You are not logged in. Please log in to get access.',
          HTTP_STATUS_CODE.UNAUTHORIZED_401,
        ),
      );
    }

    const { userId } = verifyToken(token);

    const userService = new UserService(User);
    const user = await userService.getOneById(userId);

    if (!user) {
      return next(
        new AppError(
          'The user belonging to this token no longer exists. Please log in or create an account.',
          HTTP_STATUS_CODE.UNAUTHORIZED_401,
        ),
      );
    }

    socket.user = user;

    next();
  } catch (error) {
    next(error);
  }
};