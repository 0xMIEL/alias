import { Response } from 'express';
import { Schema, model } from 'mongoose';
import { IDescription, IMessage, IResponse } from './types/gameHistoryTypes';

const messageSchema = new Schema<IMessage>(
  {
    gameId: {
      ref: 'GameRoom',
      required: [true, 'Game ID is required'],
      type: String,
    },
    text: {
      required: [true, 'Message text is required'],
      type: String,
    },
    userId: {
      ref: 'User',
      required: [true, 'User ID is required'],
      type: String,
    },
    username: {
      ref: 'User',
      required: [true, 'Username is required'],
      type: String,
    },
  },
  { timestamps: true },
);

const descriptionSchema = new Schema<IDescription>(
  {
    describerId: {
      ref: 'User',
      required: [true, 'Describer ID is required'],
      type: Schema.ObjectId,
    },
    description: {
      required: [true, 'Description is required'],
      type: String,
    },
    gameId: {
      ref: 'GameRoom',
      required: [true, 'Game ID is required'],
      type: String,
    },
    roundNumber: {
      required: [true, 'Round number is required'],
      type: Number,
    },
    team: {
      required: [true, 'Team is required'],
      type: Number,
    },
    word: {
      required: [true, 'Word is required'],
      type: String,
    },
  },
  { timestamps: true },
);

const responseSchema = new Schema<IResponse>(
  {
    gameId: {
      ref: 'GameRoom',
      required: [true, 'Game ID is required'],
      type: String,
    },
    response: {
      required: [true, 'Response is required'],
      type: String,
    },
    roundNumber: {
      required: [true, 'Round number is required'],
      type: Number,
    },
    team: {
      required: [true, 'Team is required'],
      type: Number,
    },
  },
  { timestamps: true },
);

const Message = model<IMessage>('Message', messageSchema);

const Description = model<IDescription>('Description', descriptionSchema);

const Response = model<IResponse>('Response', responseSchema);

export { Description, Message, Response };
