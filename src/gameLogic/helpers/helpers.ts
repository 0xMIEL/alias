import { Server } from 'socket.io';
import { IGameRoom } from '../../entities/gameRooms/types/gameRoom';
import { HTTP_STATUS_CODE, SOCKET_EVENT } from '../../constants/constants';
import { getRandomWord, isCheatinExplanation, isTheSame } from './wordHelpers';
import {
  AddPlayerToRoomProps,
  EmitSecretWordProps,
  HandleCorrectGuessProps,
  HandleExplanationMessageProps,
  HandleGuessMessageProps,
  HandleIncorrectGuessProps,
} from '../types/types';
import { PlayersMap } from '../game';

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

function emitSecretWord({ gameRoom, players, io }: EmitSecretWordProps) {
  const roomId = gameRoom._id.toString();
  const currentExplanaitor = gameRoom.currentExplanaitor.toString();

  const playersInGame = players.get(roomId);
  const explanatorPlayer = playersInGame?.find(
    (el) => el.userId === currentExplanaitor,
  );

  const playerSocket = io.sockets.sockets.get(explanatorPlayer!.socket);
  playerSocket!.emit(SOCKET_EVENT.SHOW_SECRET, {
    secret: gameRoom.currentWord,
  });
}

function addPlayerToRoom({
  roomId,
  socketId,
  userId,
  players,
}: AddPlayerToRoomProps) {
  const player = { socket: socketId, userId };
  const room = players.get(roomId);
  const playerIsInRoom = room?.some((user) => user.userId === userId);

  if (!playerIsInRoom) {
    room!.push(player);
  }
}

function isUserExplanator(userId: string, currentExplanaitor: string) {
  return userId === currentExplanaitor;
}

async function handleExplanationMessage({
  io,
  gameRoom,
  wordCheckerService,
  message,
}: HandleExplanationMessageProps) {
  const { currentWord } = gameRoom;
  const roomId = gameRoom._id.toString();

  const isCheating = await isCheatinExplanation(
    wordCheckerService,
    currentWord,
    message,
  );

  io.to(roomId).emit(
    isCheating
      ? SOCKET_EVENT.CHEATING_EXPLANATION
      : SOCKET_EVENT.WORD_EXPLANATION,
    { message: isCheating ? 'Cheating detected!' : message },
  );
}

async function handleGuessMessage({
  gameRoom,
  message,
  io,
  wordCheckerService,
  gameRoomService,
  players,
}: HandleGuessMessageProps) {
  const gameDifficultyWordThreshold = 90;
  const roomId = gameRoom._id.toString();
  const { currentWord, currentTeam } = gameRoom;

  io.to(roomId).emit(SOCKET_EVENT.WORD_GUESS, { message });

  const isCorrect =
    (await isTheSame(wordCheckerService, currentWord, message)) >
    gameDifficultyWordThreshold;

  if (!isCorrect) {
    return handleIncorrectGuess({ io, message, roomId });
  }

  const updatedGameRoom = await handleCorrectGuess({
    currentTeam,
    gameRoomService,
    io,
    message,
    roomId,
    wordCheckerService,
  });

  emitSecretWord({ gameRoom: updatedGameRoom!, io, players });
}

async function handleCorrectGuess({
  gameRoomService,
  roomId,
  currentTeam,
  wordCheckerService,
  message,
  io,
}: HandleCorrectGuessProps) {
  await gameRoomService.updateScoreByOne(roomId, currentTeam);

  const newWord = await getRandomWord(wordCheckerService);

  const updatedGameRoom = await gameRoomService.update(
    { currentWord: newWord },
    roomId,
  );

  io.to(roomId).emit(SOCKET_EVENT.CORRECT_GUESS, {
    message: `Correct guess: ${message}!`,
    updatedGameRoom,
  });

  return updatedGameRoom;
}

function handleIncorrectGuess({
  io,
  message,
  roomId,
}: HandleIncorrectGuessProps) {
  io.to(roomId).emit(SOCKET_EVENT.INCORRECT_GUESS, {
    message: `Incorrect guess: ${message}, try again!`,
  });

  return;
}

function isAllPlayersJoined(gameRoom: IGameRoom, players: PlayersMap) {
  const roomId = gameRoom._id.toString();

  return (
    players.get(roomId)!.length >=
    gameRoom.team1.players.length + gameRoom.team2.players.length
  );
}

export {
  getTimePerRoundInMilliseconds,
  getCurrentExplanaitorAndTeam,
  emitGameNotFoundError,
  emitSecretWord,
  addPlayerToRoom,
  isUserExplanator,
  handleExplanationMessage,
  handleGuessMessage,
  isAllPlayersJoined,
};
