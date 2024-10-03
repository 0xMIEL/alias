import { Router } from 'express';
import { FrontEndController } from './FrontEndController';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { GameRoom } from '../gameRooms/GameRoom';

export const fronEndRouter = Router();

const gameRoomService = new GameRoomService(GameRoom);
const frontEndController = new FrontEndController(gameRoomService);

fronEndRouter
  .route('/')
  .get(frontEndController.getHome.bind(frontEndController));

fronEndRouter
  .route('/game-lobby/:id')
  .get(frontEndController.getGameLobby.bind(frontEndController));
