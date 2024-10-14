import { Router } from 'express';
import { redirectIfAuthenticated } from '../../middleware/redirectIfAuthenticated';
import { redirectIfNotAuthenticated } from '../../middleware/redirectIfNotAuthenticated';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { GameRoom } from '../gameRooms/GameRoom';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { User } from '../users/User';
import { UserService } from '../users/UserService';
import { FrontEndController } from './FrontEndController';

export const frontEndRouter = Router();

const gameRoomService = new GameRoomService(GameRoom);
const userService = new UserService(User);
const frontEndController = new FrontEndController(gameRoomService, userService);

frontEndRouter
  .route('/sign-up')
  .get(
    redirectIfAuthenticated,
    frontEndController.getSingUpPage.bind(frontEndController),
  );

frontEndRouter
  .route('/log-in')
  .get(
    redirectIfAuthenticated,
    frontEndController.getLogInPage.bind(frontEndController),
  );

frontEndRouter
  .route('/')
  .get(
    redirectIfNotAuthenticated,
    asyncErrorCatch(frontEndController.getHome.bind(frontEndController)),
  );

frontEndRouter
  .route('/game-lobby')
  .get(
    redirectIfNotAuthenticated,
    frontEndController.getGameLobby.bind(frontEndController),
  );

frontEndRouter
  .route('/game-lobby/:id')
  .get(
    redirectIfNotAuthenticated,
    frontEndController.getGameLobby.bind(frontEndController),
  );

frontEndRouter
  .route('/in-game/:id')
  .get(
    redirectIfNotAuthenticated,
    frontEndController.getInGame.bind(frontEndController),
  );

frontEndRouter
  .route('/history/:id')
  .get(
    redirectIfNotAuthenticated,
    frontEndController.getGameSummary.bind(frontEndController),
  );
