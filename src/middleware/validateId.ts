import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../core/AppError';

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new AppError('Invalid id'));
  }

  next();
};
