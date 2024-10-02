import { Model } from 'mongoose';
import { IUser } from './types/userTypes';
import { hashPassword, comparePasswords } from './helpers/authHelpers';
import { generateToken } from './helpers/jwtHelpers';
import { AppError } from '../../core/AppError';
export class UserService {
  constructor(private User: Model<IUser>) {
    this.User = User;
  }

  async create(data: IUser) {
    data.password = await hashPassword(data.password);
    const user = new this.User(data);
    return await user.save();
  }

  async getOne(email: string, password: string) {
    const user = await this.User.findOne({ email });

    if (!user) {
      throw new AppError('User not found');
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid password');
    }

    const token = generateToken(user.username);
    return {  token, user };
  }

  async getMany() {
    return await this.User.find();
  }
}
