import { CHAT } from '../constants/constants.js';
import { sendGameMessageWithSocket } from '../sockets/socketHandlers.js';

function addGuessToChat(message) {
  const guessMessageList = document.getElementById('chat-guess__message-list');
  const messageElement = document.createElement('li');
  messageElement.classList = 'chat-guess__message';
  messageElement.textContent = message;

  guessMessageList.appendChild(messageElement);
}

function addExplanationToChat(message) {
  const explanationMessageList = document.getElementById(
    'chat-explanation__message-list',
  );
  const messageElement = document.createElement('li');
  messageElement.classList = 'chat-explanation__message';
  messageElement.textContent = message;

  explanationMessageList.appendChild(messageElement);
}

function addServerResponseToChat(message, chat) {
  const guessMessageList = document.getElementById('chat-guess__message-list');
  const explanationMessageList = document.getElementById(
    'chat-explanation__message-list',
  );

  const messageElement = document.createElement('li');
  messageElement.textContent = message;

  if (chat === CHAT.GUESS) {
    messageElement.classList = 'chat-guess__message';
    guessMessageList.appendChild(messageElement);
  } else {
    messageElement.classList = 'chat-explanation__message';
    explanationMessageList.appendChild(messageElement);
  }
}

function insertSecretWord(word) {
  const secret = document.getElementById('secret');
  secret.textContent = word;
}

function changeScoreElement(score) {
  const scoreTeam1 = document.getElementById('score-team1');
  const scoreTeam2 = document.getElementById('score-team2');

  scoreTeam1.textContent = score.team1;
  scoreTeam2.textContent = score.team2;
}

function setRound(round) {
  const roundElement = document.getElementById('round');

  roundElement.textContent = `Round ${round}`;
}

function startRoundTimer(timePerRoundInMilliseconds) {
  const timerElement = document.getElementById('timer');
  const millisecondsInSecond = 1000;
  const secondsInMinute = 60;

  let totalSeconds = Math.floor(
    timePerRoundInMilliseconds / millisecondsInSecond,
  );

  const updateTimerDisplay = (seconds) => {
    const minutes = Math.floor(seconds / secondsInMinute);
    const remainingSeconds = seconds % secondsInMinute;

    const padStartZeroesQuantity = 2;
    const formattedTime = `${String(minutes).padStart(padStartZeroesQuantity, '0')}:${String(remainingSeconds).padStart(padStartZeroesQuantity, '0')}`;
    timerElement.textContent = formattedTime;
  };

  updateTimerDisplay(totalSeconds);

  const timerInterval = setInterval(() => {
    totalSeconds--;

    if (totalSeconds < 0) {
      clearInterval(timerInterval);
      timerElement.textContent = '00:00';
    } else {
      updateTimerDisplay(totalSeconds);
    }
  }, millisecondsInSecond);
}

function setExplanaitor(username) {
  const explanaitorElement = document.getElementById('explanaitor');

  explanaitorElement.textContent = `${username}`;
}

function setActiveTeam(team) {
  const activeTeam = document.getElementById('active-team');

  activeTeam.textContent = team;
}

function startRound({ timePerRoundInMilliseconds, updatedGameRoom }) {
  const { currentTeam, currentWord, currentRound, currentExplanaitor } =
    updatedGameRoom;

  clearChatFields();
  startRoundTimer(timePerRoundInMilliseconds);
  insertSecretWord(currentWord);
  setExplanaitor(currentExplanaitor);
  setActiveTeam(currentTeam);
  setRound(currentRound);
}

function updateGameOnCorrectGuess(gameRoom) {
  const { currentWord, team1, team2 } = gameRoom;

  changeScoreElement({ team1: team1.score, team2: team2.score });
  insertSecretWord(currentWord);
}

function clearChatFields() {
  const explanationMessageList = document.getElementById(
    'chat-explanation__message-list',
  );
  const guessMessageList = document.getElementById('chat-guess__message-list');

  explanationMessageList.innerHTML = '';
  guessMessageList.innerHTML = '';
}

function handleEndRound() {
  addServerResponseToChat('New round will begin shortly!', CHAT.EXPLANATION);
}

function handleGameMessageSend(e, roomId) {
  e.preventDefault();
  const chatInputField = document.getElementById('chat-input-field');
  const message = chatInputField.value;

  if (!message) return;

  sendGameMessageWithSocket(roomId, message);
  chatInputField.value = '';
}

export {
  addGuessToChat,
  addExplanationToChat,
  addServerResponseToChat,
  insertSecretWord,
  changeScoreElement,
  setRound,
  startRoundTimer,
  startRound,
  updateGameOnCorrectGuess,
  handleEndRound,
  handleGameMessageSend,
};
