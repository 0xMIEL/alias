import { Response } from 'express';
import { Schema, model } from 'mongoose';
import { IDescription, IMessage, IResponse } from './types/gameHistoryTypes';

const messageSchema = new Schema<IMessage>(
  {
    gameId: {
      ref: 'GameRoom',
      required: [true, 'Game ID is required'],
      type: Schema.Types.ObjectId,
    },
    senderId: {
      ref: 'User',
      required: [true, 'Sender ID is required'],
      type: Schema.Types.ObjectId,
    },
    team: {
      enum: {
        message: '{VALUE} is not a valid team. Valid teams are A or B.',
        values: ['A', 'B'],
      },
      required: [true, 'Team is required'],
    },
    text: {
      required: [true, 'Message text is required'],
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
      type: Schema.Types.ObjectId,
    },
    description: {
      required: [true, 'Description is required'],
      type: String,
    },
    gameId: {
      ref: 'GameRoom',
      required: [true, 'Game ID is required'],
      type: Schema.Types.ObjectId,
    },
    roundNumber: {
      required: [true, 'Round number is required'],
      type: Number,
    },
    team: {
      enum: {
        message: '{VALUE} is not a valid team. Valid teams are A or B.',
        values: ['A', 'B'],
      },
      required: [true, 'Team is required'],
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
      type: Schema.Types.ObjectId,
    },
    playerId: {
      ref: 'User',
      required: [true, 'Player ID is required'],
      type: Schema.Types.ObjectId,
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
      enum: {
        message: '{VALUE} is not a valid team. Valid teams are A or B.',
        values: ['A', 'B'],
      },
      required: [true, 'Team is required'],
    },
  },
  { timestamps: true },
);

const Message = model<IMessage>('Message', messageSchema);

const Description = model<IDescription>('Description', descriptionSchema);

const Response = model<IResponse>('Message', responseSchema);

export { Description, Message, Response };
