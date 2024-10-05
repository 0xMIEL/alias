import { Response, Router } from 'express';
import { HTTP_STATUS_CODES } from './constants/httpStatusCodes';

const router = Router();

router.get('/', (req, res: Response) => {
  if (req.cookies.jwtToken) {
    res.status(HTTP_STATUS_CODES.SUCCESS_200).send('/root');
    return;
  }

  return res.redirect(HTTP_STATUS_CODES.REDIRECT_302, '/sign-up');
});

router.get('/sign-up', (req, res: Response) => {
  res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .render('sign-up', { pageTitle: 'Sign up' });
});

router.get('/log-in', (req, res: Response) => {
  res
    .status(HTTP_STATUS_CODES.SUCCESS_200)
    .render('log-in', { pageTitle: 'Log in' });
});

export default router;
