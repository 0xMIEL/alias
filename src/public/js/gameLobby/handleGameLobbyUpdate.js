import { SOCKET_EVENT } from '../constants/constants.js';
import { addMessage } from './handleGameLobbyChat.js';
import {
  createGameLobbyPlayersLists,
  createStartGameButton,
} from '../helpers/createHtmlFunctions.js';
import { socket } from '../sockets/socket.js';
import { startGameWithSocket } from '../sockets/socketHandlers.js';

socket.on(SOCKET_EVENT.KILL_ROOM, () => {
  window.location.replace(`/`);
});

socket.on(SOCKET_EVENT.JOIN_ROOM, (data) => {
  const { updatedRoom, message } = data;

  updatePlayerLists(updatedRoom);

  addMessage(message);
});

socket.on(SOCKET_EVENT.LEAVE_ROOM, (data) => {
  const { updatedRoom, message } = data;

  updatePlayerLists(updatedRoom);

  addMessage(message);
});

socket.on(SOCKET_EVENT.JOIN_TEAM, (data) => {
  const { updatedRoom, message } = data;

  updatePlayerLists(updatedRoom);

  addMessage(message);
});

function updatePlayerLists(room) {
  const totalTeamsInGame = 1;

  if (
    // userId === room.hostUserId &&
    // room.players.length >= room.teamSize * totalTeamsInGame
    totalTeamsInGame
  ) {
    const button = createStartGameButton();

    button.addEventListener('click', () => {
      startGameWithSocket(room._id);
    });

    const buttonsContainer = document.getElementById(
      'action-buttons-container',
    );

    buttonsContainer.appendChild(button);
  }

  const team1List = document.getElementById('team1-list');
  const team2List = document.getElementById('team2-list');
  const waitingPlayersList = document.getElementById('waiting-list');

  const { team1HTML, team2HTML, waitingHTML } =
    createGameLobbyPlayersLists(room);

  team1List.innerHTML = team1HTML;
  team2List.innerHTML = team2HTML;
  waitingPlayersList.innerHTML = waitingHTML;
}
