/* eslint-disable no-undef */
const socket = io();
const gameList = document.getElementById('gameList');

socket.on('gameListUpdate', (data) => {
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

  newGame.innerHTML = `
        <div class="game-list__item-info">
  <h3 class="game-list__item-title">Game: ${game._id}</h3>
  <div>
    <span class="game-list__item-property">Status:</span>
    <span class="game-list__item-property-value" id="status">${game.status}</span>
  </div>
  <div>
    <span class="game-list__item-property">Rounds:</span>
    <span class="game-list__item-property-value" id="rounds">${game.roundsTotal}</span>
  </div>
  <div>
    <span class="game-list__item-property">Time per Round:</span>
    <span class="game-list__item-property-value" id="timePerRound">${game.timePerRound} minutes</span>
  </div>
  <div>
    <span class="game-list__item-property">Players per Team:</span>
    <span class="game-list__item-property-value" id="playersPerTeam">${game.teamSize}</span>
  </div>
  <div>
    <span class="game-list__item-property">Currently Players:</span>
    <span class="game-list__item-property-value" id="playersCurrently">${game.players.length}</span>
  </div>
  <button class="button button-action button-join">Join the game</button>
</div>
    `;

  gameList.appendChild(newGame);
}

function updateGameInList(game) {
  const gameToUpdate = document.getElementById(game._id);

  if (game.players.length >= game.teamSize) {
    gameToUpdate.classList.add('full');
  }

  if (game.status === 'inProgress') {
    return removeGameFromList(game);
  }

  gameToUpdate.innerHTML = `
        <div class="game-list__item-info">
  <h3 class="game-list__item-title">Game: ${game._id}</h3>
  <div>
    <span class="game-list__item-property">Status</span>
    <span class="game-list__item-property-value" id="status">${game.status}</span>
  </div>
  <div>
    <span class="game-list__item-property">Rounds</span>
    <span class="game-list__item-property-value" id="rounds">${game.roundsTotal}</span>
  </div>
  <div>
    <span class="game-list__item-property">Time per Round</span>
    <span class="game-list__item-property-value" id="timePerRound">${game.timePerRound}</span>
  </div>
  <div>
    <span class="game-list__item-property">Players per Team</span>
    <span class="game-list__item-property-value" id="playersPerTeam">${game.teamSize}</span>
  </div>
  <div>
    <span class="game-list__item-property">Currently Players</span>
    <span class="game-list__item-property-value" id="playersCurrently">${game.players.length}</span>
  </div>
</div>
    `;
}

function removeGameFromList(game) {
  const gameToUpdate = document.getElementById(game._id);
  gameToUpdate.remove();
}
