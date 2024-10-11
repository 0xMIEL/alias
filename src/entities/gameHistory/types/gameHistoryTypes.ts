import { Document } from 'mongoose';

export interface IMessage extends Document {
  gameId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date
}

export interface IDescription extends Document {
  describerId: string;
  description: string;
  gameId: string;
  roundNumber: number;
  team: 'A' | 'B';
  word: string;
}

export interface IResponse extends Document {
  gameId: string;
  playerId: string;
  response: string;
  roundNumber: number;
  team: 'A' | 'B';
}
