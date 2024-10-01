/* eslint-disable no-console */
const modal = document.getElementById('gameModal');
const createGameBtn = document.getElementById('createGameBtn');
const closeModal = document.querySelector('.close');

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

document.getElementById('createGameForm').onsubmit = async function (event) {
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

  await createNewGame(gameData);
  modal.style.display = 'none';
};

async function createNewGame(gameData, url) {
  try {
    const response = await fetch(url, {
      body: JSON.stringify(gameData),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(error.message);
  }
}
