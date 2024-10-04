import { socket } from './socket.js';

export function joinGameRoomWithSocket(roomId, userId) {
  socket.emit('joinRoom', { roomId, userId });
}
