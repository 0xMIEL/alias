import express, { NextFunction, Request, Response } from 'express';
import { create } from 'express-handlebars';
import http from 'node:http';
import { Server } from 'socket.io';

import dontenv from 'dotenv';
dontenv.config({ path: '.env' });

import { HTTP_STATUS_CODES } from './constants/httpStatusCodes';
import { AppError } from './core/AppError';
import { gameRoomRouter } from './entities/gameRooms/gameRoutes';
import { userRouter } from './entities/users/userRoutes';
import { wordCheckRouter } from './entities/word/wordCheckerRoutes';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import { connect } from './setup/database';
// import { frontEndRouter } from './entities/frontEnd/frontEndRoutes';
import cookieParser from 'cookie-parser';
import views from './views';
import path from 'node:path'

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.log(err);

  process.exit(1);
});

const app = express();
const server = http.createServer(app);

app.use(express.static('src/public'));
app.use('/js/socket.io', express.static('node_modules/socket.io-client/dist'));
app.use('/js/axios', express.static('node_modules/axios/dist'));
app.use(cookieParser());

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// connect database
connect();

// body parser
app.use(express.json());

app.use('/api/v1/gameRooms', gameRoomRouter);

app.use('/api/v1/users', userRouter);

// WORD CHECKER ROUTES
app.use('/api', wordCheckRouter);

const hbs = create({
  partialsDir: path.join(__dirname, 'views', 'components'),
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// app.use('/', frontEndRouter);

app.use('/', views);
// route not found on server
app.use('*', (req: Request, _res: Response, _next: NextFunction) => {
  throw new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    HTTP_STATUS_CODES.NOT_FOUND_404,
  );
});

app.use(globalErrorHandler);

export { io, server };
