import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema({
  email: {
    match: [/.+@.+\..+/, 'Please enter a valid email address'],
    required: [true, 'Email is required'],
    type: String,
    unique: true,
  },
  password: {
    required: [true, 'Password is required'],
    type: String,
  },
  username: {
    required: [true, 'Username is required'],
    type: String,
    unique: true,
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
export type UserModel = typeof User;
