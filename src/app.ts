import express, { NextFunction, Request, Response } from 'express';
import dontenv from 'dotenv';
import { connect } from './setup/database';
import { AppError } from './core/AppError';
import { HTTP_STATUS_CODES } from './constants/httpStatusCodes';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { userRouter } from './entities/users/UserRoutes';

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log(err);

  process.exit(1);
});

dontenv.config({ path: '.env' });
export const app = express();

// connect database
connect();

// body parser
app.use(express.json());

// routes
app.use('/api/v1/users', userRouter);

app.get('/api/v1', (req, res, next) => {
  res.json({
    message: 'Hello world',
    status: 'success',
  });
});

// route not found on server
app.use('*', (req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    HTTP_STATUS_CODES.NOT_FOUND_404,
  );
});

app.use(globalErrorHandler);
