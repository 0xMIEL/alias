/* eslint-disable no-console */
import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI! || 'mongodb://localhost:27017/mydatabase';

export const connect = () => {
  mongoose
    .connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));
};
