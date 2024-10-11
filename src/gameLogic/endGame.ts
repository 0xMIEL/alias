import { Server } from 'socket.io';
import { SOCKET_EVENT } from '../constants/constants';
import {
  gameRoomStatuses,
  IGameRoom,
} from '../entities/gameRooms/types/gameRoom';
import { GameRoomService } from '../entities/gameRooms/GameRoomService';

async function endGame(
  gameRoom: IGameRoom,
  io: Server,
  gameRoomService: GameRoomService,
) {
  await gameRoomService.update(
    { status: gameRoomStatuses.finished },
    gameRoom._id,
  );

  io.in(gameRoom._id.toString()).emit(SOCKET_EVENT.END_GAME, gameRoom);
}

export { endGame };
