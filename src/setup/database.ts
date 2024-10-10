/* eslint-disable no-console */
import mongoose from 'mongoose';
import { seedDatabase } from './databaseSeed/seedWords';

const mongoUri =
  process.env.MONGO_URI! || 'mongodb://localhost:27017/mydatabase';

export const connectDatabase = () => {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .then(() => seedDatabase())
    .catch((err) => console.log(err));
};
