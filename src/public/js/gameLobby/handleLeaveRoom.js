import { leaveRoom } from '../api/gameRoomApi.js';
// import { baseUrl } from '../setup/config.js';
// commented leaving room on some browser actions like go back

const gameId = document
  .querySelector('.game-lobby')
  .getAttribute('data-game-id');

const leaveRoomButton = document.getElementById('button-leave-room');
// let hasLeft = false;

async function leaveRoomHandler() {
  await leaveRoom({ gameId });
  // hasLeft = true;

  window.location.replace(`/`);
}

// window.addEventListener('unload', async () => {
//   if (!hasLeft) {
//     navigator.sendBeacon(`${baseUrl}/gameRooms/${gameId}/room/${playerId}`);
//   }
// });

leaveRoomButton.addEventListener('click', leaveRoomHandler);
