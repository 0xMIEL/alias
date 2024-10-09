import mongoose, { Schema, model } from 'mongoose';
import { gameRoomStatuses, IGameRoom } from './types/gameRoom';
import { GAME_OPTIONS } from '../../constants/constants';

const gameRoomeSchema = new Schema<IGameRoom>(
  {
    currentExplanaitor: mongoose.Types.ObjectId,
    currentRound: {
      default: 0,
      type: Number,
    },
    currentTeam: { type: Number },
    currentWord: { type: String },
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
      max: GAME_OPTIONS.MAX_GAME_ROUNDS,
      min: GAME_OPTIONS.MIN_GAME_ROUNDS,
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
      max: GAME_OPTIONS.MAX_TEAM_SIZE,
      min: GAME_OPTIONS.MIN_TEAM_SIZE,
      required: true,
      type: Number,
    },
    timePerRound: {
      max: GAME_OPTIONS.MAX_TIME_PER_ROUND_MINUTES,
      min: GAME_OPTIONS.MIN_TIME_PER_ROUND_MINUTES,
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
