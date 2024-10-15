import { Document, Types  } from 'mongoose';
export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  username: string;
  wins: number; 
  role: 'user' | 'admin'; 
  gameHistory: Array<{ gameId: Types.ObjectId; outcome: string }>;
}

export type IUserUpdate = Partial<Omit<IUser, 'password'>>;
