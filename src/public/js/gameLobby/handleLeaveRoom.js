import { leaveRoom } from '../api/gameRoomApi.js';

const gameId = document
  .querySelector('.game-lobby')
  .getAttribute('data-game-id');

const leaveRoomButton = document.getElementById('button-leave-room');

async function leaveRoomHandler() {
  await leaveRoom({ gameId });

  window.location.replace(`/`);
}

leaveRoomButton.addEventListener('click', leaveRoomHandler);
