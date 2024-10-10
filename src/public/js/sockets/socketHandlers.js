import { SOCKET_EVENT } from '../constants/constants.js';
import { socket } from './socket.js';

export function joinGameRoomWithSocket(roomId) {
  socket.emit(SOCKET_EVENT.JOIN_ROOM, { roomId });
}

export function leaveGameRoomWithSocket(roomId) {
  socket.emit(SOCKET_EVENT.LEAVE_ROOM, { roomId });
}

export function joinGameWithSocket(roomId) {
  socket.emit(SOCKET_EVENT.JOIN_GAME, { roomId });
}

export function startGameWithSocket(roomId) {
  socket.emit(SOCKET_EVENT.START_GAME, { roomId });
}

export function sendGameMessageWithSocket(roomId, message) {
  socket.emit(SOCKET_EVENT.GAME_MESSAGE, { message, roomId });
}
