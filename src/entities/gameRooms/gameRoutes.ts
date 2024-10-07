import { Router } from 'express';
import { asyncErrorCatch } from '../../utils/asyncErrorCatch';
import { GameRoomService } from './GameRoomService';
import { GameRoom } from './GameRoom';
import { GameRoomController } from './GameRoomController';
import { validateId } from '../../middleware/validateId';

export const gameRoomRouter = Router();

gameRoomRouter.use('/:id', validateId);

const gameRoomService = new GameRoomService(GameRoom);
const gameRoomeController = new GameRoomController(gameRoomService);

gameRoomRouter
  .route('/')
  .post(asyncErrorCatch(gameRoomeController.create.bind(gameRoomeController)))
  .get(asyncErrorCatch(gameRoomeController.getMany.bind(gameRoomeController)))
  .delete(
    asyncErrorCatch(gameRoomeController.removeAll.bind(gameRoomeController)),
  );

gameRoomRouter
  .route('/:id')
  .get(asyncErrorCatch(gameRoomeController.getOne.bind(gameRoomeController)))
  .patch(asyncErrorCatch(gameRoomeController.update.bind(gameRoomeController)))
  .delete(
    asyncErrorCatch(gameRoomeController.remove.bind(gameRoomeController)),
  );

gameRoomRouter
  .route('/:roomId/room/:player')
  .patch(
    asyncErrorCatch(gameRoomeController.joinRoom.bind(gameRoomeController)),
  )
  .delete(
    asyncErrorCatch(gameRoomeController.removePlayer.bind(gameRoomeController)),
  );

gameRoomRouter
  .route('/:roomId/team')
  .patch(
    asyncErrorCatch(gameRoomeController.joinTeam.bind(gameRoomeController)),
  );
