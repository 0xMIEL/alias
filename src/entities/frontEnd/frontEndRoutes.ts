import { Router } from 'express';
import { FrontEndController } from './FrontEndController';
import { GameRoomService } from '../gameRooms/GameRoomService';
import { GameRoom } from '../gameRooms/GameRoom';

export const frontEndRouter = Router();

const gameRoomService = new GameRoomService(GameRoom);
const frontEndController = new FrontEndController(gameRoomService);

frontEndRouter
  .route('/')
  .get(frontEndController.getHome.bind(frontEndController));

frontEndRouter
  .route('/game-lobby')
  .get(frontEndController.getGameLobby.bind(frontEndController));