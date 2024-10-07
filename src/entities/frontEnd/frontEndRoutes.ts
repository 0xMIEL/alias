import { Router } from 'express';
import { FrontEndController } from './FrontEndController';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { GameRoom } from '../gameRooms/GameRoom';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';

export const fronEndRouter = Router();

const gameRoomService = new GameRoomService(GameRoom);
const frontEndController = new FrontEndController(gameRoomService);

fronEndRouter
  .route('/')
  .get(asyncErrorCatch(frontEndController.getHome.bind(frontEndController)));

fronEndRouter
  .route('/game-lobby/:id')
  .get(frontEndController.getGameLobby.bind(frontEndController));
