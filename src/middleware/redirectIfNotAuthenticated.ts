import { NextFunction, Request, Response } from 'express';
import { getAuthenticatedUser } from '../utils/getAuthenticatedUser';
import { HTTP_STATUS_CODE } from '../constants/constants';

export const redirectIfNotAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getAuthenticatedUser(req);

    req.user = user;
    next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.REDIRECT_302).redirect('/log-in');
  }
};
