import { CHAT, SOCKET_EVENT } from '../constants/constants.js';
import {
  addExplanationToChat,
  addGuessToChat,
  addServerResponseToChat,
  handleEndRound,
  insertSecretWord,
  startRound,
  updateGameOnCorrectGuess,
} from '../inGame/helpers.js';
import { socket } from './socket.js';
import { joinGameWithSocket } from './socketHandlers.js';

function registerGameSocketListeners(roomId) {
  socket.on(
    SOCKET_EVENT.START_ROUND,
    ({ timePerRoundInMilliseconds, updatedGameRoom }) => {
      startRound({ timePerRoundInMilliseconds, updatedGameRoom });
    },
  );

  socket.on(SOCKET_EVENT.WORD_EXPLANATION, ({ message }) => {
    addExplanationToChat(message);
  });

  socket.on(SOCKET_EVENT.CHEATING_EXPLANATION, ({ message }) => {
    addServerResponseToChat(message, CHAT.EXPLANATION);
  });

  socket.on(SOCKET_EVENT.WORD_GUESS, ({ message }) => {
    addGuessToChat(message);
  });

  socket.on(SOCKET_EVENT.INCORRECT_GUESS, ({ message }) => {
    addServerResponseToChat(message, CHAT.GUESS);
  });

  socket.on(SOCKET_EVENT.CORRECT_GUESS, ({ updatedGameRoom, message }) => {
    addServerResponseToChat(message, CHAT.GUESS);
    updateGameOnCorrectGuess(updatedGameRoom);
  });

  socket.on(SOCKET_EVENT.END_ROUND, () => {
    handleEndRound();
  });

  socket.on(SOCKET_EVENT.END_GAME, (gameRoom) => {
    addServerResponseToChat(`Game ${gameRoom._id} is over!`, CHAT.EXPLANATION);
  });

  socket.on(SOCKET_EVENT.SHOW_SECRET, ({ secret }) => {
    insertSecretWord(secret);
  });

  document.addEventListener('DOMContentLoaded', () => {
    joinGameWithSocket(roomId);
  });
}

export { registerGameSocketListeners };
