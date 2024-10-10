import { Document } from 'mongoose';
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  username: string;
  roundsTotal: number;
  scores: Array<{ team: number; score: number }>;
}

export type IUserUpdate = Partial<Omit<IUser, 'password'>>;
