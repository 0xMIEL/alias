/* eslint-disable sort-keys */
export const SOCKET_EVENT = {
  GAME_LIST_UPDATE: 'gameListUpdate',
  GAME_LOBBY_MESSAGE: 'gameLobbyMessage',
  JOIN_ROOM: 'joinRoom',
  JOIN_TEAM: 'joinTeam',
  KILL_ROOM: 'killRoom',
  LEAVE_ROOM: 'leaveRoom',
  JOIN_GAME: 'joinGame',
  START_GAME: 'startGame',
  END_GAME: 'endGame',
  START_ROUND: 'startRound',
  END_ROUND: 'endRound',
  ERROR: 'error',
  WORD_EXPLANATION: 'wordExplanation',
  CHEATING_EXPLANATION: 'cheatingExplanation',
  WORD_GUESS: 'wordGuess',
  INCORRECT_GUESS: 'incorrectGuess',
  CORRECT_GUESS: 'correctGuess',
  GAME_MESSAGE: 'gameMessage',
  SHOW_SECRET: 'showSecret',
};

export const CHAT = {
  GUESS: 'guess',
  EXPLANATION: 'explanation',
};
