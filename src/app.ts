import express, { NextFunction, Request, Response } from 'express';
import dontenv from 'dotenv';
dontenv.config({ path: '.env' });

import { connect } from './setup/database';
import { AppError } from './core/AppError';
import { HTTP_STATUS_CODES } from './constants/httpStatusCodes';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { gameRoomRouter } from './entities/gameRooms/gameRoutes';
import { userRouter } from './entities/users/userRoutes';
import { wordCheckRouter } from './entities/word/wordCheckerRoutes';

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log(err);

  process.exit(1);
});

export const app = express();

// connect database
connect();

// body parser
app.use(express.json());

app.use('/api/v1/gameRooms', gameRoomRouter);

app.use('/api/v1/users', userRouter);

// WORD CHECKER ROUTES
app.use('/api', wordCheckRouter);

// route not found on server
app.use('*', (req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    HTTP_STATUS_CODES.NOT_FOUND_404,
  );
});

app.use(globalErrorHandler);
