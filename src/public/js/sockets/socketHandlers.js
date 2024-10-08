import { SOCKET_EVENT } from '../constants/constants.js';
import { socket } from './socket.js';

export function joinGameRoomWithSocket(roomId, userId) {
  socket.emit(SOCKET_EVENT.JOIN_ROOM, { roomId, userId });
}

export function leaveGameRoomWithSocket(roomId, userId) {
  console.log('room');

  socket.emit(SOCKET_EVENT.LEAVE_ROOM, { roomId, userId });
}
