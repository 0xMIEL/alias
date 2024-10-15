import { SOCKET_EVENT } from '../constants/constants.js';
import { getUsernameFromCookies } from '../helpers/helpers.js';
import { socket } from '../sockets/socket.js';
import { joinGameRoomWithSocket } from '../sockets/socketHandlers.js';

const input = document.getElementById('game-lobby-message-input');
const button = document.getElementById('button-game-lobby-send-message');
const roomId = document
  .getElementById('game-lobby')
  .getAttribute('data-game-id');
const chat = document.querySelector('.chat-window');

const sendMessage = () => {
  if (!input.value.trim()) return;

  const message = input.value;
  socket.emit(SOCKET_EVENT.GAME_LOBBY_MESSAGE, { message, roomId });
  input.value = '';
  input.focus();
};

button.addEventListener('click', sendMessage);

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

function addMessage(data, isYours) {
  const messageList = document.getElementById('chat-window__list');
  const li = document.createElement('li');
  li.classList.add('message');

  if (isYours) {
    li.classList.add('message--yours');
  }

  const infoParagraph = document.createElement('p');
  infoParagraph.classList.add('message__info');

  const userSpan = document.createElement('span');
  userSpan.classList.add('message__user');
  userSpan.textContent = isYours ? 'you' : data.username;

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('message__timestamp');
  timeSpan.textContent = data.createdAt;

  infoParagraph.appendChild(userSpan);
  infoParagraph.appendChild(document.createTextNode(' at '));
  infoParagraph.appendChild(timeSpan);

  const textParagraph = document.createElement('p');
  textParagraph.classList.add('message__text');
  textParagraph.textContent = data.text;

  li.appendChild(infoParagraph);
  li.appendChild(textParagraph);

  messageList.appendChild(li);
}

function scrollDown() {
  chat.scrollTop = chat.scrollHeight;
}

socket.on(SOCKET_EVENT.GAME_LOBBY_MESSAGE, (data) => {
  const isYours = data.username === getUsernameFromCookies();
  addMessage(data, isYours);
  scrollDown();
});

document.addEventListener('DOMContentLoaded', () => {
  joinGameRoomWithSocket(roomId);
});

scrollDown();

export { addMessage };
