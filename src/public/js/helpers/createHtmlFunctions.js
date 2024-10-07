export function createGameListItemHTML(game) {
  const totalPlayersInRoom = game.players.length + game.playerJoined.length;

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

export function createGameLobbyPlayersLists(game) {
  const team1 = [];
  const team2 = [];
  const waitingPlayers = game.playerJoined;

  game.players.forEach((player) => {
    if (player.team === 1) {
      team1.push(player);
    } else {
      team2.push(player);
    }
  });

  const team1HTML = team1
    .map(
      (player) => `
      <li class='team1__list__item' id='${player.userId}'>
        ${player.userId}
      </li>
    `,
    )
    .join('');

  const team2HTML = team2
    .map(
      (player) => `
      <li class='team2__list__item' id='${player.userId}'>
        ${player.userId}
      </li>
    `,
    )
    .join('');

  const waitingHTML = waitingPlayers
    .map(
      (player) => `
      <li class='game-lobby__waiting__item' id='${player.userId}'>
        ${player.userId}
      </li>
    `,
    )
    .join('');

  return { team1HTML, team2HTML, waitingHTML };
}
