import { leaveRoom } from './api/gameRoomsApi.js';

const gameId = document
  .querySelector('.game-lobby')
  .getAttribute('data-game-id');

const leaveRoomButton = document.getElementById('button-leave-room');

async function leaveRoomHandler() {
  const playerId = '66fe7a402b71f7d792940d60';

  await leaveRoom({ gameId, playerId });
}

leaveRoomButton.addEventListener('click', leaveRoomHandler);
