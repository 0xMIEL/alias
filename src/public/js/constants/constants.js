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
};
