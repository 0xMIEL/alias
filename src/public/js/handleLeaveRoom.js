import { leaveRoom } from './api/gameRoomApi.js';
import { baseUrl } from './setup/config.js';

const gameId = document
  .querySelector('.game-lobby')
  .getAttribute('data-game-id');

const playerId = '66fe7a402b71f7d792940d60';

const leaveRoomButton = document.getElementById('button-leave-room');

async function leaveRoomHandler() {
  await leaveRoom({ gameId, playerId });

  window.location.replace(`/`);
}

window.addEventListener('unload', async () => {
  navigator.sendBeacon(`${baseUrl}/gameRooms/${gameId}/room/${playerId}`);
});

leaveRoomButton.addEventListener('click', leaveRoomHandler);
