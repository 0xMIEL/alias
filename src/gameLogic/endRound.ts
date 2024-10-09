import { Server } from 'socket.io';
import { SOCKET_EVENT } from '../constants/constants';

function endRound(io: Server, roomId: string) {
  io.in(roomId).emit(SOCKET_EVENT.END_ROUND);
}

export { endRound };
