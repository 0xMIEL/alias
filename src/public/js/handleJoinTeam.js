import { joinTeam } from './api/gameRoomApi.js';

const gameId = document
  .querySelector('.game-lobby')
  .getAttribute('data-game-id');
const joinTeam1Button = document.getElementById('button-join-team1');
const joinTeam2Button = document.getElementById('button-join-team2');

async function handleJoinTeam(event) {
  const { id } = event.target;

  if (id === 'button-join-team1') {
    const player = { team: 1, userId: '66fe7a402b71f7d792940d60' };

    await joinTeam({ data: player, id: gameId });
  } else if (id === 'button-join-team2') {
    const player = { team: 2, userId: '66fe7a402b71f7d792940d60' };

    await joinTeam({ data: player, id: gameId });
  }
}

joinTeam1Button.addEventListener('click', handleJoinTeam);
joinTeam2Button.addEventListener('click', handleJoinTeam);
