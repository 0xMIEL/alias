import mongoose, { Schema, model } from 'mongoose';
import { gameRoomStatuses, IGameRoom } from './types/gameRoom';
import { GAME_DIFFICULTY, GAME_OPTIONS } from '../../constants/constants';

const gameRoomeSchema = new Schema<IGameRoom>(
  {
    currentExplanaitor: mongoose.Types.ObjectId,
    currentRound: {
      default: 0,
      type: Number,
    },
    currentTeam: {
      default: 0,
      type: Number,
    },
    currentWord: {
      default: '',
      type: String,
    },
    difficulty: {
      default: GAME_DIFFICULTY.EASY,
      enum: [...Object.values(GAME_DIFFICULTY)],
      type: String,
    },
    hostUserId: {
      required: true,
      type: String,
    },
    playerJoined: {
      default: [],
      type: [mongoose.Types.ObjectId],
    },
    roundsTotal: {
      max: GAME_OPTIONS.MAX_GAME_ROUNDS,
      min: GAME_OPTIONS.MIN_GAME_ROUNDS,
      required: true,
      type: Number,
    },
    status: {
      default: gameRoomStatuses.lobby,
      enum: Object.values(gameRoomStatuses),
      required: true,
      type: String,
    },
    team1: {
      players: {
        default: [],
        type: [mongoose.Types.ObjectId],
      },
      score: {
        default: 0,
        type: Number,
      },
    },
    team2: {
      players: {
        default: [],
        type: [mongoose.Types.ObjectId],
      },
      score: {
        default: 0,
        type: Number,
      },
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
    this.team1.players.push(this.hostUserId);
  }

  next();
});

export const GameRoom = model<IGameRoom>('GameRoom', gameRoomeSchema);
