import { joinRoom } from '../api/gameRoomApi.js';

const gameList = document.getElementById('gameList');

gameList.addEventListener('click', async function (event) {
  if (!event.target.classList.contains('button-join')) {
    return;
  }

  const roomId = event.target.getAttribute('data-room-id');

  await joinRoom({ id: roomId });

  window.location.href = `/game-lobby/${roomId}`;
});
