import mongoose, { Schema, model } from 'mongoose';

const gameRoomStatuses = {
  finished: 'finished',
  inProgress: 'inProgress',
  lobby: 'lobby',
} as const;

type GameRoomStatus = keyof typeof gameRoomStatuses;

interface IGameRoom {
  hostUserId: string;
  teamSize: number;
  timePerRound: number;
  roundsTotal: number;
  players: Array<{ userId: string; team: number }>;
  currentRound: number;
  status: GameRoomStatus;
  scores: Array<{ team: number; score: number }>;
}

const gameRoomeSchema = new Schema<IGameRoom>({
  currentRound: { required: true, type: Number },
  hostUserId: { required: true, type: String },
  players: [{ team: Number, userId: mongoose.Types.ObjectId }],
  roundsTotal: { required: true, type: Number },
  scores: [{ score: Number, team: Number }],
  status: { enum: Object.values(gameRoomStatuses), required: true, type: String },
  teamSize: { required: true, type: Number },
  timePerRound: { required: true, type: Number },
});

export const GameRoom = model<IGameRoom>('GameRoom', gameRoomeSchema);
