import { leaveRoom } from '../api/gameRoomApi.js';
import { baseUrl } from '../setup/config.js';

const gameId = document
  .querySelector('.game-lobby')
  .getAttribute('data-game-id');

const leaveRoomButton = document.getElementById('button-leave-room');
let hasLeft = false;

async function leaveRoomHandler() {
  await leaveRoom({ gameId });
  hasLeft = true;

  window.location.replace(`/`);
}

window.addEventListener('beforeunload', () => {
  if (!hasLeft) {
    navigator.sendBeacon(`${baseUrl}/gameRooms/${gameId}/room`);
  }
});

leaveRoomButton.addEventListener('click', leaveRoomHandler);
