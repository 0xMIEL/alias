export function createGameListItemHTML(game) {
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
  <span class="game-list__item-property-value">${game.players.length}</span>
  </div>
  <button class="button button-action button-join">Join the game</button>
  </div>
  `;
}
