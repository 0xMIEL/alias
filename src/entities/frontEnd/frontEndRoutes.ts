import { Router } from 'express';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { GameRoom } from '../gameRooms/GameRoom';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { FrontEndController } from './FrontEndController';
import { redirectIfNotAuthenticated } from '../../middleware/redirectIfNotAuthenticated';
import { redirectIfAuthenticated } from '../../middleware/redirectIfAuthenticated';

export const frontEndRouter = Router();

const gameRoomService = new GameRoomService(GameRoom);
const frontEndController = new FrontEndController(gameRoomService);

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

frontEndRouter.use(redirectIfNotAuthenticated);

frontEndRouter
  .route('/')
  .get(asyncErrorCatch(frontEndController.getHome.bind(frontEndController)));

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
