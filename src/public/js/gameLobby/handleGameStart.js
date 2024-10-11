import { SOCKET_EVENT } from '../constants/constants.js';
import { socket } from '../sockets/socket.js';

socket.on(SOCKET_EVENT.START_GAME, (roomId) => {
  window.location.href = `/in-game/${roomId}`;
});
