import { Response, Router } from 'express';
import { HTTP_STATUS_CODES } from './constants/httpStatusCodes';

const router = Router();

interface RequestWithCookies {
  // in the future RequestWithUserInfo
  cookies: {
    jwtToken: string;
  };
}

router.get('/', (req: RequestWithCookies, res: Response) => {
  if (req.cookies.jwtToken) {
    res
      .status(HTTP_STATUS_CODES.SUCCESS_200)
      .render('game-room', { pageTitle: 'Game room'});
    return;
  }

  res.redirect(HTTP_STATUS_CODES.REDIRECT_302, '/log-in');
});

router.get('/sign-up', (req, res: Response) => {
  if (req.cookies.jwtToken) {
    res.redirect(HTTP_STATUS_CODES.REDIRECT_302, '/');
    return;
  }

  res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .render('sign-up', { pageTitle: 'Sign up' });
});

router.get('/log-in', (req, res: Response) => {
  if (req.cookies.jwtToken) {
    res.redirect(HTTP_STATUS_CODES.REDIRECT_302, '/');
    return;
  }

  res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .render('log-in', { pageTitle: 'Log in' });
});

export default router;
