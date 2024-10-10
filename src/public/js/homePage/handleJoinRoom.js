import { joinRoom } from '../api/gameRoomApi.js';

const gameList = document.getElementById('gameList');

gameList.addEventListener('click', async function (event) {
  if (!event.target.classList.contains('button-join')) {
    return;
  }

  const roomId = event.target.getAttribute('data-room-id');

  const player = { userId: '66fe7a402b71f7d792940d60' };

  await joinRoom({ data: player, id: roomId });

  window.location.href = `/game-lobby/${roomId}`;
});
