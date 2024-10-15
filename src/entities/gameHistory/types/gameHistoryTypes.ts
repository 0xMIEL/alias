import { Document, Types } from 'mongoose';

export interface IMessage extends Document {
  gameId: string;
  userId: string;
  username: string;
  text: string;
  createdAt: Date;
}

export interface IDescription extends Document {
  describerId: Types.ObjectId;
  description: string;
  gameId: string;
  roundNumber: number;
  team: number;
  word: string;
  createdAt: Date;
}

export interface IResponse extends Document {
  gameId: string;
  playerId: string;
  response: string;
  roundNumber: number;
  team: number;
  createdAt: Date;
}
