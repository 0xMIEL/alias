function createGameListItemHTML(game) {
  const totalPlayersInRoom =
    game.team1.players.length +
    game.team2.players.length +
    game.playerJoined.length;

  return `
  <div class="game-list__item-info">
  <h3 class="game-list__item-title">Game: ${game._id}</h3>
  <div>
  <span class="game-list__item-property">Status: </span>
  <span class="game-list__item-property-value">${game.status}</span>
  </div>
  <div>
  <span class="game-list__item-property">Rounds: </span>
  <span class="game-list__item-property-value">${game.roundsTotal}</span>
  </div>
  <div>
  <span class="game-list__item-property">Time per Round: </span>
  <span class="game-list__item-property-value">${game.timePerRound}</span>
  </div>
  <div>
  <span class="game-list__item-property">Players per Team: </span>
  <span class="game-list__item-property-value">${game.teamSize}</span>
  </div>
  <div>
  <span class="game-list__item-property">Currently Players: </span>
  <span class="game-list__item-property-value">${totalPlayersInRoom}</span>
  </div>
  <button class="button button-action button-join" id="button-join" data-room-id="${game._id}">Join the game</button>
  </div>
  `;
}

function createGameLobbyPlayersLists(game) {
  const waitingPlayers = game.playerJoined;

  const team1HTML = game.team1.players
    .map(
      (player) => `
      <li class='team1__list__item' id='${player._id}'>
        ${player.username}
      </li>
    `,
    )
    .join('');

  const team2HTML = game.team2.players
    .map(
      (player) => `
      <li class='team2__list__item' id='${player._id}'>
        ${player.username}
      </li>
    `,
    )
    .join('');

  const waitingHTML = waitingPlayers
    .map(
      (player) => `
      <li class='game-lobby__waiting__item' id='${player._id}'>
        ${player.username}
      </li>
    `,
    )
    .join('');

  return { team1HTML, team2HTML, waitingHTML };
}

function createStartGameButton() {
  const button = document.createElement('button');
  button.textContent = 'Start Game';
  button.id = 'button-start-game';
  button.className = 'button button-action button-start-game';
  return button;
}

export {
  createStartGameButton,
  createGameListItemHTML,
  createGameLobbyPlayersLists,
};
