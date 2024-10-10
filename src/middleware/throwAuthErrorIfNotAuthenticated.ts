import { NextFunction, Request, Response } from 'express';
import { asyncErrorCatch } from '../utils/asyncErrorCatch';

import { getAuthenticatedUser } from '../utils/getAuthenticatedUser';

export const throwAuthErrorIfNotAuthenticated = asyncErrorCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    req.user = await getAuthenticatedUser(req);

    next();
  },
);
