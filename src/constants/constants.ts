/* eslint-disable sort-keys */
export const HTTP_STATUS_CODE = {
  BAD_REQUEST_400: 400,
  CREATED_201: 201,
  FORBIDDEN_403: 403,
  INTERNAL_SERVER_ERROR_500: 500,
  NO_CONTENT_204: 204,
  NOT_FOUND_404: 404,
  SUCCESS_200: 200,
  TOO_MANY_REQUESTS_429: 429,
  UNAUTHORIZED_401: 401,
  REDIRECT_302: 302,
};

export const SOCKET_EVENT = {
  // when new game created, updated or deleted
  GAME_LIST_UPDATE: 'gameListUpdate',
  // chat message in game lobby
  GAME_LOBBY_MESSAGE: 'gameLobbyMessage',
  //new player join game room lobby
  JOIN_ROOM: 'joinRoom',
  // join one of the team
  JOIN_TEAM: 'joinTeam',
  // host leave the game lobby and game lobby should be destroyed
  KILL_ROOM: 'killRoom',
  // player leave game room lobby
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
};

export const GAME_OPTIONS = {
  MIN_GAME_ROUNDS: 1,
  MAX_GAME_ROUNDS: 10,
  MIN_TEAM_SIZE: 2,
  MAX_TEAM_SIZE: 4,
  MIN_TIME_PER_ROUND_MINUTES: 1,
  MAX_TIME_PER_ROUND_MINUTES: 5,
};

export type StatusCode =
  (typeof HTTP_STATUS_CODE)[keyof typeof HTTP_STATUS_CODE];

export type SocketEvent = (typeof SOCKET_EVENT)[keyof typeof SOCKET_EVENT];
