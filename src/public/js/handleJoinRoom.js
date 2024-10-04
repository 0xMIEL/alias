import { joinRoom } from './api/gameRoomsApi.js';
import { joinGameRoomSocket } from './sockets/socketHandlers.js';

const gameList = document.getElementById('gameList');

gameList.addEventListener('click', async function (event) {
  if (!event.target.classList.contains('button-join')) {
    return;
  }

  const roomId = event.target.getAttribute('data-room-id');
  const player = { team: 1, userId: '66fe7a402b71f7d792940d60' };

  await joinRoomApiCall(roomId, player);

  joinGameRoomSocket(roomId);

  // window.location.replace(`/game-lobby/${roomId}`);
});

async function joinRoomApiCall(roomId, player) {
  await joinRoom({ data: player, id: roomId });
}
