import mongoose, { Document } from 'mongoose';
import { GameDifficulty } from '../../../constants/constants';

export const gameRoomStatuses = {
  finished: 'finished',
  inProgress: 'inProgress',
  lobby: 'lobby',
} as const;

export type GameRoomStatus = keyof typeof gameRoomStatuses;

export type GameRoomQueryOptions = {
  limit: number;
  page: number;
  status: GameRoomStatus;
  teamSize?: number;
  timePerRound?: number;
};

export interface IGameRoom extends Document {
  _id: mongoose.Types.ObjectId;
  difficulty: GameDifficulty;
  hostUserId: mongoose.Types.ObjectId;
  teamSize: number;
  timePerRound: number;
  currentTeam: number;
  currentExplanaitor: mongoose.Types.ObjectId;
  currentWord: string;
  roundsTotal: number;
  currentRound: number;
  status: GameRoomStatus;
  team1: { players: Array<mongoose.Types.ObjectId>; score: number };
  team2: { players: Array<mongoose.Types.ObjectId>; score: number };
  playerJoined: Array<mongoose.Types.ObjectId>;
}

export type IGameRoomUpdate = Partial<
  Omit<IGameRoom, 'teamSize' | 'timePerRound' | 'roundsTotal'>
>;
