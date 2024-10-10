import { createGameRoom } from '../api/gameRoomApi.js';

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

  saveUserToStorage(hostUserId);

  const { data } = await createGameRoom({ gameData });

  createGameRoomForm.reset();
  modal.style.display = 'none';
  window.location.replace(`/game-lobby/${data._id}`);
}

function saveUserToStorage(userId) {
  localStorage.setItem('userId', userId);
}

createGameRoomForm.addEventListener('submit', handleCreateGameRoom);
