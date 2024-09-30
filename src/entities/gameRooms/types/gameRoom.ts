export const gameRoomStatuses = {
  finished: 'finished',
  inProgress: 'inProgress',
  lobby: 'lobby',
} as const;

export type GameRoomStatus = keyof typeof gameRoomStatuses;

export interface IGameRoom {
  hostUserId: string;
  teamSize: number;
  timePerRound: number;
  roundsTotal: number;
  players: Array<{ userId: string; team: number }>;
  currentRound: number;
  status: GameRoomStatus;
  scores: Array<{ team: number; score: number }>;
}
