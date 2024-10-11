import { SOCKET_EVENT } from '../constants/constants.js';
import { socket } from '../sockets/socket.js';
import { joinGameRoomWithSocket } from '../sockets/socketHandlers.js';

const button = document.getElementById('button-game-lobby-send-message');
const roomId = document
  .getElementById('game-lobby')
  .getAttribute('data-game-id');

button.addEventListener('click', () => {
  const input = document.getElementById('game-lobby-message-input');
  if (!input.value) return;

  const message = input.value;
  socket.emit(SOCKET_EVENT.GAME_LOBBY_MESSAGE, { message, roomId });
  input.value = '';
});

function addMessage(message) {
  const messageList = document.getElementById('chat-window__list');
  const listElement = document.createElement('li');
  listElement.textContent = message;

  messageList.appendChild(listElement);
}

socket.on(SOCKET_EVENT.GAME_LOBBY_MESSAGE, (message) => {
  addMessage(message);
});

document.addEventListener('DOMContentLoaded', () => {
  joinGameRoomWithSocket(roomId);
});

export { addMessage };