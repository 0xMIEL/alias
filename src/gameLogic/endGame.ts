import { Server } from 'socket.io';
import { SOCKET_EVENT } from '../constants/constants';
import { IGameRoom } from '../entities/gameRooms/types/gameRoom';

function endGame(gameRoom: IGameRoom, io: Server) {
  io.in(gameRoom._id).emit(SOCKET_EVENT.END_GAME, gameRoom);
}

export { endGame };
