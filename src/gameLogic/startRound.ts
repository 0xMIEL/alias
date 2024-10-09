import { Server } from 'socket.io';
import {
  IGameRoom,
  IGameRoomUpdate,
} from '../entities/gameRooms/types/gameRoom';
import { SOCKET_EVENT } from '../constants/constants';
import {
  emitGameNotFoundError,
  getCurrentExplanaitorAndTeam,
  getTimePerRoundInMilliseconds,
} from './helpers/helpers';
import { endGame } from './endGame';
import { GameRoomService } from '../entities/gameRooms/GameRoomService';
import { getRandomWord } from './game';
import { endRound } from './endRound';

async function startRound(
  gameRoom: IGameRoom,
  io: Server,
  gameRoomService: GameRoomService,
) {
  const turnsPerRound = 2;
  const { roundsTotal, currentRound, _id: roomId, timePerRound } = gameRoom;

  if (currentRound >= roundsTotal * turnsPerRound) {
    const updatedRoom = await gameRoomService.getOne(roomId);

    return endGame(updatedRoom, io);
  }

  const { currentExplanaitor, currentTeam } =
    getCurrentExplanaitorAndTeam(gameRoom);

  const currentWord = getRandomWord(); // todo word api integration

  const data: IGameRoomUpdate = {
    currentExplanaitor,
    currentRound: currentRound + 1,
    currentTeam,
    currentWord,
  };

  const updatedGameRoom = await gameRoomService.update(data, roomId);
  if (!updatedGameRoom) {
    return emitGameNotFoundError(io, roomId);
  }

  const timePerRoundInMilliseconds =
    getTimePerRoundInMilliseconds(timePerRound);

  io.in(roomId).emit(SOCKET_EVENT.START_ROUND, {
    timePerRoundMiliseconds: timePerRoundInMilliseconds,
    updatedGameRoom,
    word: currentWord,
  });

  setTimeout(async () => {
    endRound(io, roomId);

    startRound(updatedGameRoom, io, gameRoomService);
  }, timePerRoundInMilliseconds);
}

export { startRound };
