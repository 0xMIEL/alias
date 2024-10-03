import { addPlayer } from './api/gameRoomsApi.js';

/* eslint-disable no-undef */
const socket = io();

const joinRoomButtons = document.querySelectorAll('.button-join');

joinRoomButtons.forEach((button) => {
  button.addEventListener('click', async function () {
    const roomId = this.getAttribute('data-room-id');
    const player = { team: 1, userId: '66fe7a402b71f7d792940d60' };

    console.log('click');

    await handleJoinGameRoom(roomId, player);

    await joinGameRoom(roomId);
  });
});

async function handleJoinGameRoom(roomId, player) {
  const result = await addPlayer({ data: player, id: roomId });

  console.log(result);
}

async function joinGameRoom(roomId) {
  socket.emit('joinRoom', roomId);

  //   window.location.replace(`/game-lobby/${roomId}`);
}
