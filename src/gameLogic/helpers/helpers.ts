import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { HTTP_STATUS_CODE, SOCKET_EVENT } from '../../constants/constants';
import { gameHistoryService } from '../../entities/gameHistory/GameHistoryService';
import { IGameRoom } from '../../entities/gameRooms/types/gameRoom';
import { UserService } from '../../entities/users/UserService';
import { PlayersMap } from '../game';
import {
  AddPlayerToRoomProps,
  EmitSecretWordProps,
  HandleCorrectGuessProps,
  HandleExplanationMessageProps,
  HandleGuessMessageProps,
  HandleIncorrectGuessProps,
} from '../types/types';
import { getRandomWord, isCheatinExplanation, isTheSame } from './wordHelpers';

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
  const playerInRoom = room?.find((user) => user.userId === userId);

  if (playerInRoom) {
    playerInRoom.socket = socketId;
    return true;
  }

  room!.push(player);
}

function isUserExplanator(userId: string, currentExplanaitor: string) {
  return userId === currentExplanaitor;
}

async function handleExplanationMessage({
  io,
  gameRoom,
  wordCheckerService,
  message,
  username,
}: HandleExplanationMessageProps) {
  const { currentWord, currentExplanaitor, currentRound, currentTeam } =
    gameRoom;
  const roomId = gameRoom._id.toString();

  const isCheating = await isCheatinExplanation(
    wordCheckerService,
    currentWord,
    message,
  );

  await gameHistoryService.storeDescription(
    currentExplanaitor,
    message,
    roomId,
    currentRound,
    currentWord,
    currentTeam,
  );

  io.to(roomId).emit(
    isCheating
      ? SOCKET_EVENT.CHEATING_EXPLANATION
      : SOCKET_EVENT.WORD_EXPLANATION,
    { message: isCheating ? 'Cheating detected!' : `${username}: ${message}` },
  );
}

async function handleGuessMessage({
  gameRoom,
  message,
  io,
  wordCheckerService,
  gameRoomService,
  players,
  username,
}: HandleGuessMessageProps) {
  const gameDifficultyWordThreshold = 90;
  const roomId = gameRoom._id.toString();
  const { currentWord, currentTeam, currentRound } = gameRoom;

  io.to(roomId).emit(SOCKET_EVENT.WORD_GUESS, {
    message: `${username}: ${message}`,
  });

  const isCorrect =
    (await isTheSame(wordCheckerService, currentWord, message)) >
    gameDifficultyWordThreshold;

  await gameHistoryService.storeResponse(
    roomId,
    message,
    currentRound,
    currentTeam,
  );

  if (!isCorrect) {
    return handleIncorrectGuess({ io, message, roomId });
  }

  const updatedGameRoom = await handleCorrectGuess({
    currentTeam,
    difficulty: gameRoom.difficulty,
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
  difficulty,
}: HandleCorrectGuessProps) {
  await gameRoomService.updateScoreByOne(roomId, currentTeam);

  const newWord = await getRandomWord(difficulty, wordCheckerService);

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

async function saveUsersGameData(
  gameRoom: IGameRoom,
  userService: UserService,
) {
  const scoreTeam1 = gameRoom.team1.score;
  const scoreTeam2 = gameRoom.team2.score;
  const gameObjectId = new mongoose.Types.ObjectId(gameRoom._id);

  const isDraw = scoreTeam1 === scoreTeam2;
  const team1Win = scoreTeam1 > scoreTeam2;

  const players = [
    ...gameRoom.team1.players.map((player) => ({
      id: player,
      win: team1Win,
    })),
    ...gameRoom.team2.players.map((player) => ({
      id: player,
      win: !team1Win,
    })),
  ];

  const promises = players.map((player) => {
    const outcome = isDraw ? 'draw' : player.win ? 'win' : 'loss';

    userService.updateUserProfile(player.id.toString(), gameObjectId, outcome);
  });

  await Promise.all(promises);
}

export {
  addPlayerToRoom,
  emitGameNotFoundError,
  emitSecretWord,
  getCurrentExplanaitorAndTeam,
  getTimePerRoundInMilliseconds,
  handleExplanationMessage,
  handleGuessMessage,
  isAllPlayersJoined,
  isUserExplanator,
  saveUsersGameData,
};
