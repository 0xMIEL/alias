import { Server } from 'socket.io';
import { IGameRoom } from '../../entities/gameRooms/types/gameRoom';
import { PlayersMap } from '../game';
import { WordCheckerService } from '../../entities/word/wordCheckerService';
import { GameRoomService } from '../../entities/gameRooms/GameRoomService';
import { GameDifficulty } from '../../constants/constants';

export type EmitSecretWordProps = {
  gameRoom: IGameRoom;
  players: PlayersMap;
  io: Server;
};

export type AddPlayerToRoomProps = {
  roomId: string;
  socketId: string;
  userId: string;
  players: PlayersMap;
};

export type HandleExplanationMessageProps = {
  io: Server;
  gameRoom: IGameRoom;
  wordCheckerService: WordCheckerService;
  message: string;
};

export type HandleGuessMessageProps = {
  gameRoom: IGameRoom;
  message: string;
  io: Server;
  wordCheckerService: WordCheckerService;
  gameRoomService: GameRoomService;
  players: PlayersMap;
};

export type HandleIncorrectGuessProps = {
  io: Server;
  message: string;
  roomId: string;
};

export type HandleCorrectGuessProps = {
  gameRoomService: GameRoomService;
  roomId: string;
  currentTeam: number;
  wordCheckerService: WordCheckerService;
  message: string;
  io: Server;
  difficulty: GameDifficulty;
};
