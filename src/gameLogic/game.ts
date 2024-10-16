import { Server, Socket } from 'socket.io';
import { GameRoomService } from '../entities/gameRooms/GameRoomService';
import { GameRoom } from '../entities/gameRooms/GameRoom';
import { gameRoomStatuses } from '../entities/gameRooms/types/gameRoom';
import { SOCKET_EVENT } from '../constants/constants';
import {
  emitGameNotFoundError,
  addPlayerToRoom,
  isUserExplanator,
  handleExplanationMessage,
  handleGuessMessage,
  isAllPlayersJoined,
} from './helpers/helpers';
import { startRound } from './startRound';
import { WordCheckerService } from '../entities/word/wordCheckerService';
import { isGameRoomFull } from '../utils/isGameRoomFull';

type Player = {
  socket: string;
  userId: string;
};

export type PlayersMap = Map<string, Player[]>;
const players: PlayersMap = new Map();

export function mountGameEvents(socket: Socket, io: Server) {
  const gameRoomService = new GameRoomService(GameRoom);
  const wordCheckerService = new WordCheckerService();

  socket.on(SOCKET_EVENT.JOIN_GAME, async ({ roomId }) => {
    try {
      socket.join(roomId);

      if (!players.has(roomId)) {
        players.set(roomId, []);
      }

      const userId = socket.user!._id.toString();

      const isInRoom = addPlayerToRoom({
        players,
        roomId,
        socketId: socket.id.toString(),
        userId,
      });

      if (isInRoom) {
        return;
      }

      const gameRoom = await gameRoomService.getOne(roomId);

      if (!gameRoom) {
        emitGameNotFoundError(io, roomId);
      }

      if (isGameRoomFull(gameRoom) && isAllPlayersJoined(gameRoom, players)) {
        const updatedGameRoom = await gameRoomService.update(
          { status: gameRoomStatuses.inProgress },
          roomId,
        );

        startRound({
          gameRoom: updatedGameRoom!,
          gameRoomService,
          io,
          players,
          wordCheckerService,
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  });

  socket.on(SOCKET_EVENT.START_GAME, async ({ roomId }) => {
    io.in(roomId).emit(SOCKET_EVENT.START_GAME, roomId);
  });

  socket.on(SOCKET_EVENT.GAME_MESSAGE, async ({ message, roomId }) => {
    const gameRoom = await gameRoomService.getOne(roomId);
    const { currentExplanaitor } = gameRoom;

    const user = socket.user!;
    const { username } = user;

    const isExplanaitor = isUserExplanator(
      user._id.toString(),
      currentExplanaitor.toString(),
    );

    if (isExplanaitor) {
      handleExplanationMessage({
        gameRoom,
        io,
        message,
        username,
        wordCheckerService,
      });
    } else {
      handleGuessMessage({
        gameRoom,
        gameRoomService,
        io,
        message,
        players,
        user,
        wordCheckerService,
      });
    }
  });
}
