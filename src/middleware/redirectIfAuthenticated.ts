import { NextFunction, Request, Response } from 'express';
import { getAuthenticatedUser } from '../utils/getAuthenticatedUser';
import { HTTP_STATUS_CODE } from '../constants/constants';

export const redirectIfAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await getAuthenticatedUser(req);

    res.status(HTTP_STATUS_CODE.REDIRECT_302).redirect('/');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    next();
  }
};
