import { CHAT, SOCKET_EVENT } from '../constants/constants.js';
import {
  addExplanationToChat,
  addGuessToChat,
  addServerResponseToChat,
  handleEndRound,
  startRound,
  updateGameOnCorrectGuess,
} from '../inGame/helpers.js';
import { socket } from './socket.js';
import { joinGameWithSocket } from './socketHandlers.js';

function registerGameSocketListeners(roomId) {
  socket.on(
    SOCKET_EVENT.START_ROUND,
    ({ timePerRoundMiliseconds, updatedGameRoom }) => {
      startRound({ timePerRoundMiliseconds, updatedGameRoom });
    },
  );

  socket.on(SOCKET_EVENT.WORD_EXPLANATION, ({ explanation }) => {
    addExplanationToChat(explanation);
  });

  socket.on(SOCKET_EVENT.CHEATING_EXPLANATION, ({ message }) => {
    addServerResponseToChat(message, CHAT.EXPLANATION);
  });

  socket.on(SOCKET_EVENT.WORD_GUESS, ({ guess }) => {
    addGuessToChat(guess);
  });

  socket.on(SOCKET_EVENT.INCORRECT_GUESS, ({ message }) => {
    addServerResponseToChat(message, CHAT.EXPLANATION);
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

  document.addEventListener('DOMContentLoaded', () => {
    joinGameWithSocket(roomId);
  });
}

export { registerGameSocketListeners };
