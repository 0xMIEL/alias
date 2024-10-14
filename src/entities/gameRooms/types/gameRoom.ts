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

export interface IGameRoom {
  _id: string;
  difficulty: GameDifficulty;
  hostUserId: string;
  teamSize: number;
  timePerRound: number;
  currentTeam: number;
  currentExplanaitor: string;
  currentWord: string;
  roundsTotal: number;
  currentRound: number;
  status: GameRoomStatus;
  team1: { players: Array<string>; score: number };
  team2: { players: Array<string>; score: number };
  playerJoined: Array<{ userId: string }> | [];
}

export type IGameRoomUpdate = Partial<
  Omit<IGameRoom, 'teamSize' | 'timePerRound' | 'roundsTotal'>
>;
