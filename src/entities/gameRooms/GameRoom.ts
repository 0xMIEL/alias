import mongoose, { Schema, model } from 'mongoose';
import { gameRoomStatuses, IGameRoom } from './types/gameRoom';

const MIN_GAME_ROUNDS = 1;
const MAX_GAME_ROUNDS = 10;
const MIN_TEAM_SIZE = 2;
const MAX_TEAM_SIZE = 4;
const MIN_TIME_PER_ROUND_MINUTES = 1;
const MAX_TIME_PER_ROUND_MINUTES = 5;

const gameRoomeSchema = new Schema<IGameRoom>(
  {
    currentRound: {
      default: 0,
      type: Number,
    },
    hostUserId: {
      required: true,
      type: String,
    },
    playerJoined: [mongoose.Types.ObjectId],
    players: [
      {
        team: Number,
        userId: mongoose.Types.ObjectId,
      },
    ],
    roundsTotal: {
      max: MAX_GAME_ROUNDS,
      min: MIN_GAME_ROUNDS,
      required: true,
      type: Number,
    },
    scores: [
      {
        score: { default: 0, type: Number },
        team: Number,
      },
    ],
    status: {
      default: gameRoomStatuses.lobby,
      enum: Object.values(gameRoomStatuses),
      required: true,
      type: String,
    },
    teamSize: {
      max: MAX_TEAM_SIZE,
      min: MIN_TEAM_SIZE,
      required: true,
      type: Number,
    },
    timePerRound: {
      max: MAX_TIME_PER_ROUND_MINUTES,
      min: MIN_TIME_PER_ROUND_MINUTES,
      required: true,
      type: Number,
    },
  },
  { timestamps: true },
);

gameRoomeSchema.pre('save', function (next) {
  if (this.isNew) {
    this.players.push({
      team: 1,
      userId: this.hostUserId,
    });
  }

  next();
});

export const GameRoom = model<IGameRoom>('GameRoom', gameRoomeSchema);
