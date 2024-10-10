import { IUser } from '../entities/users/types/userTypes';

declare global {
  namespace Express {
    export interface Request {
      language?: Language;
      user?: IUser;
    }
  }
}

export {};
