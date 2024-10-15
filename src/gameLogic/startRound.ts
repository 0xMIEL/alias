import { Server } from 'socket.io';
import {
  IGameRoom,
  IGameRoomUpdate,
} from '../entities/gameRooms/types/gameRoom';
import { SOCKET_EVENT } from '../constants/constants';
import {
  emitGameNotFoundError,
  emitSecretWord,
  getCurrentExplanaitorAndTeam,
  getTimePerRoundInMilliseconds,
} from './helpers/helpers';
import { endGame } from './endGame';
import { GameRoomService } from '../entities/gameRooms/GameRoomService';
import { PlayersMap } from './game';
import { endRound } from './endRound';
import { WordCheckerService } from '../entities/word/wordCheckerService';
import { getRandomWord } from './helpers/wordHelpers';

type StartRoundProps = {
  gameRoom: IGameRoom;
  io: Server;
  gameRoomService: GameRoomService;
  wordCheckerService: WordCheckerService;
  players: PlayersMap;
};

async function startRound({
  gameRoom,
  io,
  gameRoomService,
  wordCheckerService,
  players,
}: StartRoundProps) {
  const pauseBetweenRoundsInMilliseconds = 3000;
  const turnsPerRound = 2;
  const { roundsTotal, currentRound, _id, timePerRound } = gameRoom;
  const roomId = _id.toString();

  if (currentRound >= roundsTotal * turnsPerRound) {
    const updatedRoom = await gameRoomService.getOne(roomId);

    return await endGame(updatedRoom, io, gameRoomService);
  }

  const { currentExplanaitor, currentTeam } =
    getCurrentExplanaitorAndTeam(gameRoom);

  const currentWord = await getRandomWord(gameRoom.difficulty, wordCheckerService);

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

  io.to(roomId).emit(SOCKET_EVENT.START_ROUND, {
    timePerRoundInMilliseconds,
    updatedGameRoom,
  });

  emitSecretWord({ gameRoom: updatedGameRoom, io, players });

  setTimeout(() => {
    endRound(io, roomId);

    setTimeout(async () => {
      await startRound({
        gameRoom: updatedGameRoom,
        gameRoomService,
        io,
        players,
        wordCheckerService,
      });
    }, pauseBetweenRoundsInMilliseconds);
  }, timePerRoundInMilliseconds);
}

export { startRound };
