import { Schema, model, Types } from 'mongoose';
import { IUser } from './types/userTypes';

const userSchema = new Schema<IUser>({
  email: {
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
    required: [true, 'Email is required'],
    type: String,
    unique: true,
  },
  gameHistory: [
    {
      gameId: {  ref: 'Game', type: Types.ObjectId, },
      outcome: {  enum: ['win', 'loss', 'draw'],type: String },
    },
  ],
  password: {
    required: [true, 'Password is required'],
    type: String,
  },
  role: {
    default: 'user',
    enum: ['user', 'admin'],
    type: String,
  },

  username: {
    required: [true, 'Username is required'],
    type: String,
    unique: true,
  },
  wins: {
    default: 0,
    type: Number,
  },
});

export const User = model<IUser>('User', userSchema);
