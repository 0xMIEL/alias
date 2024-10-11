import { IUser } from '../entities/users/types/userTypes';

declare global {
  namespace Express {
    interface Request {
      language?: Language;
      user?: IUser;
    }
  }
}
