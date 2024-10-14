import { Schema, model } from 'mongoose';
import { IWord } from './types/word';

const wordSchema = new Schema<IWord>({
  category: { required: true, type: String },
  difficulty: { required: true, type: String },
  value: { required: true, type: String },
});

export const Word = model<IWord>('Word', wordSchema);