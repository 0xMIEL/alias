import { Document } from 'mongoose';

export interface IWord extends Document {
  value: string;
}