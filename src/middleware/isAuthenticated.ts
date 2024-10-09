import { NextFunction, Request, Response } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwtToken;
    if (!token) {
      return res.redirect('/log-in');
    }
    next();
  };
  