import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    required: [true, 'Username is required'],
    type: String,
    unique: true, // Ensure usernames are unique
  },
  email: {
    required: [true, 'Email is required'],
    type: String,
    unique: true, // Ensure emails are unique
    match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email validation
  },
  password: {
    required: [true, 'Password is required'],
    type: String,
  },
});

export const User = mongoose.model<IUser>('User', userSchema);
export type UserModel = typeof User;
