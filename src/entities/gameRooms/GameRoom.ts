import mongoose, { Schema, model } from 'mongoose';
import { gameRoomStatuses, IGameRoom } from './types/gameRoom';

const gameRoomeSchema = new Schema<IGameRoom>({
  currentRound: { required: true, type: Number },
  hostUserId: { required: true, type: String },
  players: [{ team: Number, userId: mongoose.Types.ObjectId }],
  roundsTotal: { required: true, type: Number },
  scores: [{ score: Number, team: Number }],
  status: {
    enum: Object.values(gameRoomStatuses),
    required: true,
    type: String,
  },
  teamSize: { required: true, type: Number },
  timePerRound: { required: true, type: Number },
});

export const GameRoom = model<IGameRoom>('GameRoom', gameRoomeSchema);
