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

export type Player = { userId: string; team: number };

export interface IGameRoom {
  hostUserId: string;
  teamSize: number;
  timePerRound: number;
  roundsTotal: number;
  players: Player[];
  currentRound: number;
  status: GameRoomStatus;
  scores: Array<{ team: number; score: number }>;
  playerJoined: Array<{ userId: string }>;
}

export type IGameRoomUpdate = Partial<
  Omit<IGameRoom, 'teamSize' | 'timePerRound' | 'roundsTotal'>
>;
