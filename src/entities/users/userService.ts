import { Model } from 'mongoose';
import { IUser } from './types/userTypes';

export class UserService {
  constructor(private User: Model<IUser>) {
    this.User = User;
  }

  async create(data: IUser) {
    const user = new this.User(data);
    return await user.save();
  }

  async getOne(email: string) {
    return await this.User.findOne({ email });
  }

  async getMany() {
    return await this.User.find();
  }
}
