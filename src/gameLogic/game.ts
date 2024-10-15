import { Server, Socket } from 'socket.io';
import { GameRoomService } from '../entities/gameRooms/GameRoomService';
import { GameRoom } from '../entities/gameRooms/GameRoom';
import {
  gameRoomStatuses,
  IGameRoom,
  IGameRoomUpdate,
} from '../entities/gameRooms/types/gameRoom';
import { SOCKET_EVENT } from '../constants/constants';
import { emitGameNotFoundError, toIWord, fromIWord } from './helpers/helpers';
import { startRound } from './startRound';
import { WordCheckerService } from '../entities/word/wordCheckerService';

const gameDifficultyWordThreshold = 90;
type Player = {
  socket: string;
  userId: string;
};

export type PlayersMap = Map<string, Player[]>;
const players: PlayersMap = new Map();

export function mountGameEvents(socket: Socket, io: Server) {
  const gameRoomService = new GameRoomService(GameRoom);
  const wordCheckerService = new WordCheckerService();

  socket.on(SOCKET_EVENT.JOIN_GAME, ({ roomId }) => {
    socket.join(roomId);
    const minPlayersToStartTheGame = 2;

    if (!players.has(roomId)) {
      players.set(roomId, []);
    }

    const player = { socket: socket.id, userId: socket.user!._id.toString() };
    const room = players.get(roomId);
    room!.push(player);

    if (
      players.get(roomId) &&
      players.get(roomId)!.length >= minPlayersToStartTheGame
    ) {
      start(roomId);
    }
  });

  async function start(roomId: string) {
    const data: IGameRoomUpdate = {
      status: gameRoomStatuses.inProgress,
    };

    const gameRoom = await gameRoomService.update(data, roomId);
    if (!gameRoom) {
      return emitGameNotFoundError(io, roomId);
    }

    startRound({
      gameRoom,
      gameRoomService,
      io,
      players,
      wordCheckerService,
    });
  }

  socket.on(SOCKET_EVENT.START_GAME, async ({ roomId }) => {
    io.in(roomId).emit(SOCKET_EVENT.START_GAME, roomId);
  });

  socket.on(SOCKET_EVENT.GAME_MESSAGE, async ({ message, roomId }) => {
    const gameRoom = await gameRoomService.getOne(roomId);
    const { currentExplanaitor, currentWord } = gameRoom;

    const user = socket.user!;

    const isExplanaitor = user._id.toString() === currentExplanaitor.toString();

    if (isExplanaitor) {
      if (
        await isCheatinExplanation(wordCheckerService, currentWord, message)
      ) {
        io.to(roomId).emit(SOCKET_EVENT.CHEATING_EXPLANATION, {
          message: 'Cheating detected!',
        });
      } else {
        io.to(roomId).emit(SOCKET_EVENT.WORD_EXPLANATION, { message });
      }
    } else {
      handleGuessMessage(gameRoom, message);
    }
  });

  async function handleGuessMessage(gameRoom: IGameRoom, message: string) {
    const roomId = gameRoom._id.toString();
    const { currentWord, currentTeam, currentExplanaitor } = gameRoom;
    io.to(roomId).emit(SOCKET_EVENT.WORD_GUESS, { message });

    if (
      (await isTheSame(wordCheckerService, currentWord, message)) <
      gameDifficultyWordThreshold
    ) {
      io.to(roomId).emit(SOCKET_EVENT.INCORRECT_GUESS, {
        message: `Incorrect guess: ${message}, try again!`,
      });

      return;
    }

    await gameRoomService.updateScoreByOne(roomId, currentTeam);

    const newWord = await getRandomWord(gameRoom.difficulty, wordCheckerService);

    const updatedGameRoom = await gameRoomService.update(
      { currentWord: newWord },
      roomId,
    );

    io.to(roomId).emit(SOCKET_EVENT.CORRECT_GUESS, {
      message: `Correct guess: ${message}!`,
      updatedGameRoom,
    });

    const playersInGame = players.get(roomId);

    const explanatorPlayer = playersInGame?.find(
      (el) => el.userId === currentExplanaitor.toString(),
    );

    const playerSocket = io.sockets.sockets.get(explanatorPlayer!.socket);
    playerSocket!.emit(SOCKET_EVENT.SHOW_SECRET, { secret: newWord });
  }
}

export async function isCheatinExplanation(
  wordCheckerService: WordCheckerService,
  wordToCheck: string,
  explanation: string,
) {
  const word = toIWord(wordToCheck);
  const sentence = explanation;
  const cheatingResponse = await wordCheckerService.checkSentenceForWord(
    word,
    sentence,
  );
  return cheatingResponse;
}

export async function isTheSame(
  wordCheckerService: WordCheckerService,
  word: string,
  guess: string,
) {
  const inputWord = toIWord(guess);
  const targetWord = toIWord(word);

  const similarityResponse = await wordCheckerService.checkSimilarity(
    inputWord,
    targetWord,
  );
  return similarityResponse;
}

export async function getRandomWord(difficulty: string, wordCheckerService: WordCheckerService) {
  const generatedWord = await wordCheckerService.getRandomWord(difficulty);
  return fromIWord(generatedWord);
}
