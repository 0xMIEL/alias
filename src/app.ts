import express, { NextFunction, Request, Response } from 'express';
import http from 'node:http';
import { Server } from 'socket.io';
import { engine } from 'express-handlebars';

import dontenv from 'dotenv';
dontenv.config({ path: '.env' });

import { connectDatabase } from './setup/database';
import { AppError } from './core/AppError';
import { HTTP_STATUS_CODE } from './constants/constants';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { gameRoomRouter } from './entities/gameRooms/gameRoutes';
import { userRouter } from './entities/users/userRoutes';
import { wordCheckRouter } from './entities/word/wordCheckerRoutes';
import { fronEndRouter } from './entities/frontEnd/frontEndRoutes';
import cookieParser from 'cookie-parser';
import { initializeSocket } from './socket/socket';
import mongoSanitize from 'express-mongo-sanitize';

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log(err);

  process.exit(1);
});

const app = express();
const server = http.createServer(app);

app.use(express.static('src/public'));
app.use('/js', express.static('node_modules/socket.io-client/dist'));
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.set('io', io);

initializeSocket(io);

connectDatabase();

// body parser
app.use(express.json());
// sanitize user input
app.use(mongoSanitize());

app.use('/api/v1/gameRooms', gameRoomRouter);

app.use('/api/v1/users', userRouter);

// WORD CHECKER ROUTES
app.use('/api', wordCheckRouter);

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/', fronEndRouter);

// route not found on server
app.use('*', (req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    HTTP_STATUS_CODE.NOT_FOUND_404,
  );
});

app.use(globalErrorHandler);

export { server, io };
