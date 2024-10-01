import { Schema, model, Document } from 'mongoose';

export interface IWord extends Document {
  value: string;
}

const wordSchema = new Schema<IWord>({
  value: { required: true, type: String },
});

export const Word = model<IWord>('Word', wordSchema);
export type WordModel = typeof Word;
