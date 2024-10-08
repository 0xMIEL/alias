import { Types } from 'mongoose';

export interface IMessage {
  gameId: Types.ObjectId;
  senderId: Types.ObjectId;
  team: 'A' | 'B';
  text: string;
}

export interface IDescription {
  describerId: Types.ObjectId;
  description: string;
  gameId: Types.ObjectId;
  roundNumber: number;
  team: 'A' | 'B';
  word: string;
}

export interface IResponse {
  gameId: Types.ObjectId;
  playerId: Types.ObjectId;
  response: string;
  roundNumber: number;
  team: 'A' | 'B';
}
