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

  async getOneById(id: string) {  
    const user = await this.User.findOne({ _id: id });

    if (!user) {
      throw new AppError('User not found');
    }

    return user;
  }

  async getMany() {
    return await this.User.find().select(['-password']);
  }

  async update(data: IUserUpdate, password: string) {
    const hashedPassword = await hashPassword(password);

    return await this.User.findOneAndUpdate(
      { email: data.email },
      { ...data, password: hashedPassword },
      { new: true },
    );
  }
  async updateById(id: string, data: IUserUpdate, password?: string) {
    const updateData: Partial<IUser> = { ...data };

    if (password) {
        updateData.password = await hashPassword(password);
    }

    return await this.User.findOneAndUpdate(
        { _id: id }, 
        updateData,
        { new: true }
    );
  }

  async remove(id: string) {
    const deletedUser = await this.User.findOne({ _id: id }).deleteOne();

    if (!deletedUser) {
      throw new AppError(`Fail to delete user. Id ${id} not found`);
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
    res.clearCookie('username'); 

    return username;
  }
}
