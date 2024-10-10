import { Server } from 'socket.io';
import { IGameRoom } from '../../entities/gameRooms/types/gameRoom';
import { HTTP_STATUS_CODE, SOCKET_EVENT } from '../../constants/constants';

function getTimePerRoundInMilliseconds(timePerRoundInMinutes: number) {
  const secondsInMinute = 60;
  const milisecondsInSecond = 1000;
  return timePerRoundInMinutes * secondsInMinute * milisecondsInSecond;
}

function getCurrentExplanaitorAndTeam(gameRoom: IGameRoom) {
  const { currentRound } = gameRoom;
  const turnsPerRound = 2;
  const firstTeam = 1;
  const secondTeam = 2;
  // odd for team1(1) even for team2(2)
  const currentTeam =
    (currentRound + 1) % turnsPerRound === 0 ? firstTeam : secondTeam;

  const currentTeamPlayers = gameRoom[`team${currentTeam}`].players;

  const currentExplanatorIndex = currentRound % currentTeamPlayers.length;

  return {
    currentExplanaitor: currentTeamPlayers[currentExplanatorIndex],
    currentTeam,
  };
}

function emitGameNotFoundError(io: Server, roomId: string) {
  io.to(roomId).emit(SOCKET_EVENT.ERROR, {
    code: HTTP_STATUS_CODE.NOT_FOUND_404,
    message: 'No game found.',
  });
}

export {
  getTimePerRoundInMilliseconds,
  getCurrentExplanaitorAndTeam,
  emitGameNotFoundError,
};
