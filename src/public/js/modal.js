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

  console.log(
    'time per round element',
    document.getElementById('timePerRound'),
  );

  console.log('Team Size:', teamSize);
  console.log('Time Per Round:', timePerRound);
  console.log('Rounds Total:', roundsTotal);

  const gameData = {
    hostUserId,
    roundsTotal,
    teamSize,
    timePerRound,
  };

  const url = 'http://localhost:3000/api/v1/gameRooms';

  await createNewGame(gameData, url);

  document.getElementById('createGameForm').reset();
  modal.style.display = 'none';
};

async function createNewGame(gameData, url) {
  try {
    const response = await fetch(url, {
      body: JSON.stringify(gameData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log('response with json:', json);
  } catch (error) {
    console.error(error);
  }
}
