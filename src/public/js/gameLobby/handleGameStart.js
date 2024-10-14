import { SOCKET_EVENT } from '../constants/constants.js';
import { socket } from '../sockets/socket.js';
import {
  addStartButtonClickListenerOnReload,
  disableStartButton,
  enableStartButton,
} from './helpers/helpers.js';

const gameRoomId = document
  .getElementById('game-lobby')
  .getAttribute('data-game-id');

document.addEventListener('DOMContentLoaded', () => {
  addStartButtonClickListenerOnReload(gameRoomId);

  socket.on(SOCKET_EVENT.FULL_LOBBY, () => {
    enableStartButton(gameRoomId);
  });

  socket.on(SOCKET_EVENT.NOT_FULL_LOBBY, () => {
    disableStartButton(gameRoomId);
  });
});

socket.on(SOCKET_EVENT.START_GAME, (roomId) => {
  window.location.href = `/in-game/${roomId}`;
});
