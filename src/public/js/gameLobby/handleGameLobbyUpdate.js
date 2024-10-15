import { SOCKET_EVENT } from '../constants/constants.js';
import { createGameLobbyPlayersLists } from '../helpers/createHtmlFunctions.js';
import { socket } from '../sockets/socket.js';

function addInfo(message) {
  const messageList = document.getElementById('chat-window__list');
  const li = document.createElement('li');
  li.classList.add('lobby-info')
  li.textContent = message;

  messageList.appendChild(li);
}

socket.on(SOCKET_EVENT.KILL_ROOM, () => {
  window.location.replace(`/`);
});

socket.on(SOCKET_EVENT.JOIN_ROOM, (data) => {
  const { updatedRoom, message } = data;

  updatePlayerLists(updatedRoom);

  addInfo(message);
});

socket.on(SOCKET_EVENT.LEAVE_ROOM, (data) => {
  const { updatedRoom, message } = data;

  updatePlayerLists(updatedRoom);

  addInfo(message);
});

socket.on(SOCKET_EVENT.JOIN_TEAM, (data) => {
  const { updatedRoom, message } = data;

  updatePlayerLists(updatedRoom);

  addInfo(message);
});

function updatePlayerLists(room) {
  const team1List = document.getElementById('team1-list');
  const team2List = document.getElementById('team2-list');
  const waitingPlayersList = document.getElementById('waiting-list');

  const { team1HTML, team2HTML, waitingHTML } =
    createGameLobbyPlayersLists(room);

  team1List.innerHTML = team1HTML;
  team2List.innerHTML = team2HTML;
  waitingPlayersList.innerHTML = waitingHTML;
}
