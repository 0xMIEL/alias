/* eslint-disable max-lines-per-function */
import { Server, Socket } from 'socket.io';
import { GameRoomService } from '../entities/gameRooms/GameRoomService';
import { GameRoom } from '../entities/gameRooms/GameRoom';
import {
  gameRoomStatuses,
  IGameRoomUpdate,
} from '../entities/gameRooms/types/gameRoom';
import { SOCKET_EVENT } from '../constants/constants';
import { emitGameNotFoundError } from './helpers/helpers';
import { startRound } from './startRound';

export function mountGameEvents(socket: Socket, io: Server) {
  const gameRoomService = new GameRoomService(GameRoom);

  socket.on(SOCKET_EVENT.JOIN_GAME, ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on(SOCKET_EVENT.START_GAME, async ({ roomId }) => {
    const data: IGameRoomUpdate = {
      status: gameRoomStatuses.inProgress,
    };

    const gameRoom = await gameRoomService.update(data, roomId);
    if (!gameRoom) {
      return emitGameNotFoundError(io, roomId);
    }

    io.in(roomId).emit(SOCKET_EVENT.START_GAME, gameRoom);

    startRound(gameRoom, io, gameRoomService);
  });

  socket.on(SOCKET_EVENT.WORD_GUESS, async ({ roomId, guess }) => {
    const { currentWord, currentTeam } = await gameRoomService.getOne(roomId);

    io.to(roomId).emit(SOCKET_EVENT.WORD_GUESS, { guess });

    // todo wordapi integration
    if (!isTheSame(currentWord, guess)) {
      io.to(roomId).emit(SOCKET_EVENT.INCORRECT_GUESS, {
        message: `Incorrect guess: ${guess}, try again!`,
      });

      return;
    }

    //update score, change ui, fetch new word
    await gameRoomService.updateScoreByOne(roomId, currentTeam);

    const newWord = getRandomWord(); // todo integration
    const updatedGameRoom = await gameRoomService.update(
      { currentWord: newWord },
      roomId,
    );

    io.to(roomId).emit(SOCKET_EVENT.CORRECT_GUESS, {
      message: `Correct guess: ${guess}!`,
      updatedGameRoom,
    });
  });

  socket.on(SOCKET_EVENT.WORD_EXPLANATION, async ({ roomId, explanation }) => {
    const { currentWord } = await gameRoomService.getOne(roomId);

    // todo wordapi integration
    if (isCheatinExplanation(currentWord, explanation)) {
      io.to(roomId).emit(SOCKET_EVENT.CHEATING_EXPLANATION, {
        message: 'Cheating detected!',
      });
    } else {
      io.in(roomId).emit(SOCKET_EVENT.WORD_EXPLANATION, { explanation });
    }
  });
}

export function isCheatinExplanation(word: string, explanation: string) {
  return word === explanation;
}

export function isTheSame(word: string, guess: string) {
  return word === guess;
}

export function getRandomWord() {
  return 'word';
}
