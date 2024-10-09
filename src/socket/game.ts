/* eslint-disable max-lines-per-function */
import { Server, Socket } from 'socket.io';
import { GameRoomService } from '../entities/gameRooms/GameRoomService';
import { GameRoom } from '../entities/gameRooms/GameRoom';
import {
  gameRoomStatuses,
  IGameRoom,
  IGameRoomUpdate,
} from '../entities/gameRooms/types/gameRoom';
import { HTTP_STATUS_CODE, SOCKET_EVENT } from '../constants/constants';

export function mountGameEvents(socket: Socket, io: Server) {
  const gameRoomService = new GameRoomService(GameRoom);

  socket.on(SOCKET_EVENT.START_GAME, async ({ roomId }) => {
    const data: IGameRoomUpdate = {
      status: gameRoomStatuses.inProgress,
    };

    const gameRoom = await gameRoomService.update(data, roomId);
    if (!gameRoom) {
      io.to(roomId).emit(SOCKET_EVENT.ERROR, {
        code: HTTP_STATUS_CODE.NOT_FOUND_404,
        message: 'No game found.',
      });

      return;
    }

    io.in(roomId).emit(SOCKET_EVENT.START_GAME, gameRoom);

    startRound(gameRoom);
  });

  async function startRound(gameRoom: IGameRoom) {
    const secondsInMinute = 60;
    const milisecondsInSecond = 1000;
    const turnsPerRound = 2;
    const timePerRoundMiliseconds =
      gameRoom.timePerRound * secondsInMinute * milisecondsInSecond;
    const {
      roundsTotal,
      currentRound,
      _id: roomId,
      players,
      currentExplanaitor,
    } = gameRoom;

    if (currentRound >= roundsTotal * turnsPerRound) {
      return endGame(gameRoom);
    }

    // odd for team1(1) even for team2(2)
    const currentTeam = (currentRound + 1) % turnsPerRound;
    const currentTeamPlayers = players.filter(
      (player) => player.team === currentTeam,
    );

    // const currentExplanaitor =
    const currentWord = getRandomWord(); // todo word api integration

    const data: IGameRoomUpdate = {
      currentRound: currentRound + 1,
      currentTeam,
      currentWord,
    };

    const updatedGameRoom = await gameRoomService.update(data, roomId);
    if (!updatedGameRoom) {
      io.to(socket.id).emit(SOCKET_EVENT.ERROR, {
        code: HTTP_STATUS_CODE.NOT_FOUND_404,
        message: 'No game found.',
      });

      return;
    }

    io.in(roomId).emit(SOCKET_EVENT.START_ROUND, {
      timePerRoundMiliseconds,
      updatedGameRoom,
      word: currentWord,
    });

    setTimeout(() => {
      io.in(roomId).emit(SOCKET_EVENT.END_ROUND);

      startRound(updatedGameRoom);
    }, timePerRoundMiliseconds);
  }

  function getRandomWord() {
    return 'word';
  }

  function endGame(gameRoom: IGameRoom) {
    io.in(gameRoom._id).emit(SOCKET_EVENT.END_GAME, gameRoom);
  }

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

  socket.on(SOCKET_EVENT.WORD_GUESS, async ({ roomId, guess }) => {
    const { currentWord } = await gameRoomService.getOne(roomId);

    // todo wordapi integration
    if (!isTheSame(currentWord, guess)) {
      io.to(roomId).emit(SOCKET_EVENT.INCORRECT_GUESS, {
        message: `Incorrect guess: ${guess}, try again!`,
      });

      return;
    }

    //update score, change ui, fetch new word
  });

  function isCheatinExplanation(word: string, explanation: string) {
    return word === explanation;
  }

  function isTheSame(word: string, guess: string) {
    return word === guess;
  }
}
