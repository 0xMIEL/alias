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
import { WordCheckerService } from '../entities/word/wordCheckerService';

async function startRound(
  gameRoom: IGameRoom,
  io: Server,
  gameRoomService: GameRoomService,
  wordCheckerService: WordCheckerService
) {
  const turnsPerRound = 2;
  const pauseBetweenRoundsInMilliseconds = 3000;
  const { roundsTotal, currentRound, _id: roomId, timePerRound } = gameRoom;

  if (currentRound >= roundsTotal * turnsPerRound) {
    const updatedRoom = await gameRoomService.getOne(roomId);

    return endGame(updatedRoom, io);
  }

  const { currentExplanaitor, currentTeam } =
    getCurrentExplanaitorAndTeam(gameRoom);

  const currentWord = await getRandomWord(wordCheckerService); // todo word api integration

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
  });

  setTimeout(async () => {
    endRound(io, roomId);

    setTimeout(() => {
      startRound(updatedGameRoom, io, gameRoomService, wordCheckerService);
    }, pauseBetweenRoundsInMilliseconds);
  }, timePerRoundInMilliseconds);
}

export { startRound };
