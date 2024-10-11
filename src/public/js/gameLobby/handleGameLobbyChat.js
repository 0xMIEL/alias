/* eslint-disable */
import { SOCKET_EVENT } from '../constants/constants.js';
import { getCookie } from '../helpers/getCookie.js';
import { socket } from '../sockets/socket.js';
import { joinGameRoomWithSocket } from '../sockets/socketHandlers.js';

const button = document.getElementById('button-game-lobby-send-message');
const input = document.getElementById('game-lobby-message-input');
const roomId = document
  .getElementById('game-lobby')
  .getAttribute('data-game-id');

function sendMessage() {
  if (!input.value) return;

  const message = input.value;
  socket.emit(SOCKET_EVENT.GAME_LOBBY_MESSAGE, { message, roomId });
  input.value = '';
}

button.addEventListener('click', sendMessage);

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function scrollToBottom() {
  const messageList = document.getElementById('chat-window');
  messageList.scrollTop = messageList.scrollHeight;
}

function formatCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function createMessageElement(username, message, isYours = false) {
  const listElement = document.createElement('li');
  listElement.className = isYours ? 'message message--yours' : 'message';

  const messageInfo = document.createElement('p');
  messageInfo.className = 'message__info';

  const userSpan = document.createElement('span');
  userSpan.className = 'message__user';
  userSpan.textContent = username;

  const timeSpan = document.createElement('span');
  timeSpan.className = 'message__timestamp';
  timeSpan.textContent = formatCurrentTime();

  messageInfo.appendChild(userSpan);
  messageInfo.appendChild(document.createTextNode(' at '));
  messageInfo.appendChild(timeSpan);

  const messageText = document.createElement('p');
  messageText.className = 'message__text';
  messageText.textContent = message;

  listElement.appendChild(messageInfo);
  listElement.appendChild(messageText);

  return listElement;
}

function addMessage(message) {
  const messageList = document.getElementById('chat-window__list');
  const listElement = document.createElement('li');
  listElement.textContent = message;

  messageList.appendChild(listElement);
}

function addYourMessage(message) {
  const messageList = document.getElementById('chat-window__list');
  const listElement = createMessageElement('you', message, true);
  messageList.appendChild(listElement);

  scrollToBottom();
}

function addOtherMessage(username, message) {
  const messageList = document.getElementById('chat-window__list');
  const listElement = createMessageElement(username, message, false);
  messageList.appendChild(listElement);

  scrollToBottom();
}

socket.on(SOCKET_EVENT.GAME_LOBBY_MESSAGE, (data) => {
  const username = getCookie('username');
  if (username === data.username) {
    addYourMessage(data.message);
  } else {
    addOtherMessage(data.username, data.message);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  joinGameRoomWithSocket(roomId);
  scrollToBottom();
});

export { addMessage };
