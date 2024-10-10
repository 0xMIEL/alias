import { NextFunction, Request, Response } from 'express';
import { asyncErrorCatch } from '../utils/asyncErrorCatch';
import { AppError } from '../core/AppError';
import { HTTP_STATUS_CODE } from '../constants/constants';
import { verifyToken } from '../entities/users/helpers/jwtHelpers';
import { UserService } from '../entities/users/UserService';
import { User } from '../entities/users/User';

export const protect = asyncErrorCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
      throw new AppError(
        'You are not not logged in. Please log in to get access.',
        HTTP_STATUS_CODE.UNAUTHORIZED_401,
      );
    }

    const { userId } = verifyToken(token);

    const userService = new UserService(User);
    const user = await userService.getOneById(userId);

    if (!user) {
      throw new AppError(
        'The user belonging to this token no longer exists. Please log in or create an account.',
        HTTP_STATUS_CODE.UNAUTHORIZED_401,
      );
    }

    req.user = user;
    next();
  },
);
