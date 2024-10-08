import { Router } from 'express';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { GameRoom } from '../gameRooms/GameRoom';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { FrontEndController } from './FrontEndController';

export const frontEndRouter = Router();

const gameRoomService = new GameRoomService(GameRoom);
const frontEndController = new FrontEndController(gameRoomService);

frontEndRouter
  .route('/')
  .get(asyncErrorCatch(frontEndController.getHome.bind(frontEndController)));

frontEndRouter
  .route('/sign-up')
  .get(frontEndController.getSingUpPage.bind(frontEndController));

frontEndRouter
  .route('/log-in')
  .get(frontEndController.getLogInPage.bind(frontEndController));

frontEndRouter
  .route('/game-lobby')
  .get(frontEndController.getGameLobby.bind(frontEndController));

frontEndRouter
  .route('/game-lobby/:id')
  .get(frontEndController.getGameLobby.bind(frontEndController));
