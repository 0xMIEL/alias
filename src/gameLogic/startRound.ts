/* eslint-disable no-console */
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
import { getRandomWord, PlayersMap } from './game';
import { endRound } from './endRound';
import { WordCheckerService } from '../entities/word/wordCheckerService';

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
  const turnsPerRound = 2;
  const pauseBetweenRoundsInMilliseconds = 3000;
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

  const playersIn = players.get(roomId.toString());
  if (!playersIn) {
    return console.log('no players');
  }

  playersIn.forEach((player) => {
    const playerSocket = io.sockets.sockets.get(player.socket);

    if (!playerSocket) {
      return console.log('not found socket id', player.socket);
    }

    playerSocket.join(roomId);
  });

  io.to(roomId).emit(SOCKET_EVENT.START_ROUND, {
    timePerRoundInMilliseconds,
    updatedGameRoom,
  });

  const playersInGame = players.get(roomId.toString());
  const explanatorPlayer = playersInGame?.find(
    (el) => el.userId === currentExplanaitor.toString(),
  );
  const playerSocket = io.sockets.sockets.get(explanatorPlayer!.socket);
  playerSocket!.emit(SOCKET_EVENT.SHOW_SECRET, { secret: currentWord });

  setTimeout(async () => {
    endRound(io, roomId);

    setTimeout(() => {
      startRound({
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
