import { Document } from 'mongoose';

export interface IWord extends Document {
  category: string;
  difficulty: string;
  value: string;
}