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
    if (user && (await comparePasswords(password, user.password))) {
      const token = generateToken(user.username);
      return { user, token };
    }
    return null;
  }

  async getMany() {
    return await this.User.find();
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
}
