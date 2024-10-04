import { socket } from './socket.js';

export function joinGameRoomSocket(roomId) {
  socket.emit('joinRoom', roomId);
}
