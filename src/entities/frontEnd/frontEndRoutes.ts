import { Router } from 'express';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { GameRoom } from '../gameRooms/GameRoom';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { FrontEndController } from './FrontEndController';
import { UserController } from '../users/UserController';
import { UserService } from '../users/UserService';
import { User } from '../users/User';

export const frontEndRouter = Router();

const gameRoomService = new GameRoomService(GameRoom);
const userService = new UserService(User);
const frontEndController = new FrontEndController(gameRoomService);
const userController = new UserController(userService);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get the home page
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Successfully rendered the home page
 */
frontEndRouter
  .route('/')
  .get(asyncErrorCatch(frontEndController.getHome.bind(frontEndController)));

/**
 * @swagger
 * /sign-up:
 *   get:
 *     summary: Render the sign-up page
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Successfully rendered the sign-up page
 *   post:
 *     summary: Create a new user
 *     tags: [Frontend]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 */
frontEndRouter
  .route('/sign-up')
  .get(frontEndController.getSingUpPage.bind(frontEndController))
  .post(asyncErrorCatch(userController.create.bind(userController)));

/**
 * @swagger
 * /log-in:
 *   get:
 *     summary: Render the log-in page
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Successfully rendered the log-in page
 *   post:
 *     summary: Log in an existing user
 *     tags: [Frontend]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
frontEndRouter
  .route('/log-in')
  .get(frontEndController.getLogInPage.bind(frontEndController))
  .post(asyncErrorCatch(userController.getOne.bind(userController)));

/**
 * @swagger
 * /game-lobby:
 *   get:
 *     summary: Get the game lobby
 *     tags: [Frontend]
 *     responses:
 *       200:
 *         description: Successfully rendered the game lobby
 */
frontEndRouter
  .route('/game-lobby')
  .get(frontEndController.getGameLobby.bind(frontEndController));

/**
 * @swagger
 * /game-lobby/{id}:
 *   get:
 *     summary: Get the game lobby by ID
 *     tags: [Frontend]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the game lobby
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully rendered the game lobby
 *       404:
 *         description: Game lobby not found
 */
frontEndRouter
  .route('/game-lobby/:id')
  .get(frontEndController.getGameLobby.bind(frontEndController));
