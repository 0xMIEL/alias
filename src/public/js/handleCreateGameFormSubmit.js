import { createGameRoom } from './api/gameRoomsApi.js';
import { baseUrl } from './setup/config.js';

const modal = document.getElementById('gameModal');
const createGameBtn = document.getElementById('createGameBtn');
const closeModal = document.querySelector('.close');
const createGameRoomForm = document.getElementById('createGameForm');

createGameBtn.onclick = function () {
  modal.style.display = 'block';
};

closeModal.onclick = function () {
  modal.style.display = 'none';
};

window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

async function handleCreateGameRoom(event) {
  event.preventDefault();

  const teamSize = document.getElementById('playersPerTeam').value;
  const timePerRound = document.getElementById('timePerRound').value;
  const roundsTotal = document.getElementById('totalRounds').value;
  const hostUserId = '6555f6f9ceae7adbfa0c49f7';

  const gameData = {
    hostUserId,
    roundsTotal,
    teamSize,
    timePerRound,
  };

  const url = `${baseUrl}/gameRooms`;

  const { data } = await createGameRoom(gameData, url);

  createGameRoomForm.reset();
  modal.style.display = 'none';
  window.location.replace(`/game-lobby/${data._id}`);
}

createGameRoomForm.addEventListener('submit', handleCreateGameRoom);
