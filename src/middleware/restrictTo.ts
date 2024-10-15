import { NextFunction, Request, Response } from 'express';
import { AppError } from '../core/AppError';
import { HTTP_STATUS_CODE } from '../constants/constants';

export const restrictTo =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user!;

    if (!allowedRoles.includes(role)) {
      throw new AppError(
        'User does not have piermissions',
        HTTP_STATUS_CODE.FORBIDDEN_403,
      );
    }

    next();
  };
