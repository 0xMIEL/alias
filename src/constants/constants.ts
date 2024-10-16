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
  FULL_LOBBY: 'fullLobby',
  NOT_FULL_LOBBY: 'notFullLobby',
  GAME_SUMMARY: 'gameSummary',
};

export const GAME_OPTIONS = {
  MIN_GAME_ROUNDS: 1,
  MAX_GAME_ROUNDS: 10,
  MIN_TEAM_SIZE: 2,
  MAX_TEAM_SIZE: 4,
  MIN_TIME_PER_ROUND_MINUTES: 1,
  MAX_TIME_PER_ROUND_MINUTES: 5,
};

export const GAME_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

const defaultTeamQuantity = 2;
export const TOTAL_TEAMS =
  (process.env.TOTAL_TEAMS as unknown as number) || defaultTeamQuantity;

export type StatusCode =
  (typeof HTTP_STATUS_CODE)[keyof typeof HTTP_STATUS_CODE];

export type SocketEvent = (typeof SOCKET_EVENT)[keyof typeof SOCKET_EVENT];

export type GameDifficulty =
  (typeof GAME_DIFFICULTY)[keyof typeof GAME_DIFFICULTY];
