import { SOCKET_EVENT } from './constants/constants.js';
import { createGameListItemHTML } from './helpers/createHtmlFunctions.js';
import { socket } from './sockets/socket.js';

const gameList = document.getElementById('gameList');

socket.on(SOCKET_EVENT.GAME_LIST_UPDATE, (data) => {
  const { action, game } = data;

  if (action === 'create') {
    addGameToList(game);
  }

  if (action === 'update') {
    updateGameInList(game);
  }

  if (action === 'remove') {
    removeGameFromList(game);
  }
});

function addGameToList(game) {
  const newGame = document.createElement('li');
  newGame.className = 'game-list__item';
  newGame.id = game._id;

  newGame.innerHTML = createGameListItemHTML(game);

  gameList.appendChild(newGame);
}

function updateGameInList(game) {
  const gameToUpdate = document.getElementById(game._id);

  gameToUpdate.innerHTML = createGameListItemHTML(game);

  if (game.players.length >= game.teamSize) {
    gameToUpdate.classList.add('full');
  }

  gameToUpdate.innerHTML = createGameListItemHTML(game);
}

function removeGameFromList(game) {
  const gameToUpdate = document.getElementById(game._id);
  gameToUpdate.remove();
}
