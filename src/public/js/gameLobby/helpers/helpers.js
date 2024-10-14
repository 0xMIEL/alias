import { startGameWithSocket } from '../../sockets/socketHandlers.js';

function enableStartButton(gameRoomId) {
  const startButton = document.getElementById('button-start-game');
  if (!startButton) return;

  startButton.disabled = false;
  startButton.classList.remove('disabled');
  startButton.addEventListener('click', () => {
    startGameWithSocket(gameRoomId);
  });
}

function disableStartButton(gameRoomId) {
  const startButton = document.getElementById('button-start-game');
  if (!startButton) return;

  startButton.disabled = true;
  startButton.classList.add('disabled');
  startButton.removeEventListener('click', () => {
    startGameWithSocket(gameRoomId);
  });
}

function addStartButtonClickListenerOnReload(gameRoomId) {
  const startButton = document.getElementById('button-start-game');

  if (!startButton || startButton.disabled === true) return;

  startButton.addEventListener('click', () => {
    startGameWithSocket(gameRoomId);
  });
}

export {
  enableStartButton,
  disableStartButton,
  addStartButtonClickListenerOnReload,
};
