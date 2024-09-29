import { IUser, UserModel } from './User';

export class UserService {
  constructor(private User: UserModel) {}

  async createUser(data: IUser): Promise<IUser> {
    const user = new this.User(data);
    await user.save(); 
    return user;
  }

  async findUser(email: string): Promise<IUser | null> {
    return await this.User.findOne({ email }); 
  }
}
