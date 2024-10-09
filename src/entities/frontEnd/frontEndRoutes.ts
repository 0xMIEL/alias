import { Router } from 'express';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { GameRoom } from '../gameRooms/GameRoom';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { FrontEndController } from './FrontEndController';
import { UserController } from '../users/UserController';
import { UserService } from '../users/UserService';
import { User } from '../users/User';
import { isAuthenticated } from '../../middleware/isAuthenticated';

export const frontEndRouter = Router();

const gameRoomService = new GameRoomService(GameRoom);
const userService = new UserService(User);
const frontEndController = new FrontEndController(gameRoomService);
const userController = new UserController(userService);

frontEndRouter
  .route('/sign-up')
  .get(frontEndController.getSingUpPage.bind(frontEndController))
  .post(asyncErrorCatch(userController.create.bind(userController)));

frontEndRouter
  .route('/log-in')
  .get(frontEndController.getLogInPage.bind(frontEndController))
  .post(asyncErrorCatch(userController.getOne.bind(userController)));

frontEndRouter.use(isAuthenticated);

frontEndRouter
  .route('/')
  .get(asyncErrorCatch(frontEndController.getHome.bind(frontEndController)));

frontEndRouter
  .route('/game-lobby')
  .get(frontEndController.getGameLobby.bind(frontEndController));

frontEndRouter
  .route('/game-lobby/:id')
  .get(frontEndController.getGameLobby.bind(frontEndController));

  frontEndRouter
  .route('/start-game')
  .get(frontEndController.getStartGame.bind(frontEndController));