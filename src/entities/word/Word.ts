import { Schema, model } from 'mongoose';
import { IWord } from './types/word';

const wordSchema = new Schema<IWord>({
  value: { required: true, type: String },
});

export const Word = model<IWord>('Word', wordSchema);