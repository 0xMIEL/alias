import { createGameRoom } from '../api/gameRoomApi.js';

const modal = document.getElementById('gameModal');
const createGameBtn = document.getElementById('createGameBtn');
const closeModal = document.getElementById('closeModal');
const createGameRoomForm = document.getElementById('createGameForm');

createGameBtn.onclick = function () {
  modal.style.display = 'block';
};

closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

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
  const difficulty = document.getElementById('difficulty').value;

  const gameData = {
    difficulty,
    roundsTotal,
    teamSize,
    timePerRound,
  };
  console.log(gameData);

  const { data } = await createGameRoom({ gameData });

  createGameRoomForm.reset();
  modal.style.display = 'none';
  window.location.href = `/game-lobby/${data._id}`;
}

createGameRoomForm.addEventListener('submit', handleCreateGameRoom);
