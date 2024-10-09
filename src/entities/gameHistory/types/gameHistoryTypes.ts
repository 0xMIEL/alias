import { Document, Types } from 'mongoose';

export interface IMessage extends Document<Types.ObjectId> {
  gameId: Types.ObjectId;
  senderId: Types.ObjectId;
  team: 'A' | 'B';
  text: string;
}

export interface IDescription extends Document<Types.ObjectId> {
  describerId: Types.ObjectId;
  description: string;
  gameId: Types.ObjectId;
  roundNumber: number;
  team: 'A' | 'B';
  word: string;
}

export interface IResponse extends Document<Types.ObjectId> {
  gameId: Types.ObjectId;
  playerId: Types.ObjectId;
  response: string;
  roundNumber: number;
  team: 'A' | 'B';
}
