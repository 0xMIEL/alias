import { SOCKET_EVENT } from '../constants/constants.js';
import { createGameListItemHTML } from '../helpers/createHtmlFunctions.js';
import { socket } from '../sockets/socket.js';

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
  const team1Players = game.team1.players;
  const team2Players = game.team2.players;

  gameToUpdate.innerHTML = createGameListItemHTML(game);

  if (
    team1Players.length >= game.teamSize &&
    team2Players.length >= game.teamSize
  ) {
    gameToUpdate.classList.add('full');
  }

  gameToUpdate.innerHTML = createGameListItemHTML(game);
}

function removeGameFromList(game) {
  const gameToUpdate = document.getElementById(game._id);

  if (gameToUpdate) {
    gameToUpdate.remove();
  }
}
