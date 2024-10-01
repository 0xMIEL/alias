import { Schema, model } from 'mongoose';
import { IUser } from './types/userTypes';

const userSchema = new Schema<IUser>({
  email: {
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
    required: [true, 'Email is required'],
    type: String,
    unique: true,
  },
  password: {
    required: [true, 'Password is required'],
    type: String,
  },
  roundsTotal: {
    type: Number,
  },
  scores: [{ score: Number, team: Number }],
  username: {
    required: [true, 'Username is required'],
    type: String,
    unique: true,
  },
});

export const User = model<IUser>('User', userSchema);
