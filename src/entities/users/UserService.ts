import { Model } from 'mongoose';
import { IUser, IUserUpdate } from './types/userTypes';
import { hashPassword, comparePasswords } from './helpers/authHelpers';
import { generateToken } from './helpers/jwtHelpers';
import { AppError } from '../../core/AppError';
import { verifyToken } from './helpers/jwtHelpers';
import { Response } from 'express';
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
      throw new AppError('Invalid credentials');
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials');
    }

    const token = generateToken(user.username);
    return { token, user };
  }

  async getMany() {
    return await this.User.find().select(['-password']);
  }

  async update(data: IUserUpdate, password: string) {
    return await this.User.findOneAndUpdate({ _password: password }, data, {
      new: true,
    });
  }

  async remove(email: string) {
    const deletedUser = await this.User.findOne({ email });

    if (!deletedUser) {
      throw new AppError(`Fail to delete user. Email ${email} not found`);
    }

    return deletedUser;
  }

  async extractUsernameFromToken(token: string, res: Response) {
    if (!token) {
      throw new AppError('No token provided');
    }

    const decoded = verifyToken(token);
    const username = decoded.userId;

    res.clearCookie('jwtToken');

    return username;
  }
}
